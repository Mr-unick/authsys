import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "../../../components/components/ui/button";
import { toast } from "react-toastify";
import { FileUp, FileSpreadsheet, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ExcelToJsonConverter() {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setExcelData(jsonData);
        setRowCount(jsonData.length);
        toast.success(`Success! Loaded ${jsonData.length} rows.`);
      } catch (error) {
        toast.error('Error reading file. Please check if it\'s a valid Excel file.');
        console.error('Error:', error);
      }
    };

    reader.onerror = () => {
      toast.error('Error reading file');
    };

    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (!excelData) return;

    setIsConverting(true);
    try {
      await axios.post('/api/leaddetails/uploadLeads', { leads: excelData });
      toast.success('Leads database synchronized successfully');
      setExcelData(null);
      setFileName('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Synchronization failed');
      console.error('Error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const clearSelection = () => {
    setExcelData(null);
    setFileName('');
    setRowCount(0);
  };

  return (
    <div className="p-2 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-[#0F1626] tracking-tight">Bulk Import Leads</h2>
        <p className="text-xs text-gray-400 font-medium">Upload .xlsx or .xls files to populate your lead database.</p>
      </div>

      <div className="space-y-4">
        {!excelData ? (
          <div className="relative group">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="file-upload"
            />
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[2rem] p-12 bg-gray-50/50 group-hover:bg-indigo-50/50 group-hover:border-indigo-200 transition-all duration-300">
              <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileSpreadsheet size={32} />
              </div>
              <p className="text-sm font-bold text-gray-500">Drop your file here or <span className="text-indigo-600">click to browse</span></p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">Supported: XLSX, XLS</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-8 flex flex-col items-center text-center animate-in zoom-in-95">
            <div className="h-14 w-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-sm font-black text-emerald-900 uppercase tracking-tight">{fileName}</h3>
            <p className="text-xs text-emerald-700/70 font-bold mt-1">Ready to sync {rowCount} records</p>
            <button
              onClick={clearSelection}
              className="mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-1 hover:underline"
            >
              <X size={12} /> Choose different file
            </button>
          </div>
        )}

        {excelData && (
          <div className="pt-2">
            <Button
              onClick={handleUpload}
              disabled={isConverting}
              className="w-full bg-[#0F1626] text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-gray-200 hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3 h-auto"
            >
              {isConverting ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Synchronizing...
                </>
              ) : (
                <>
                  <FileUp size={16} /> Start Synchronization
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-[10px] font-bold text-amber-900 leading-relaxed">
            Ensure your excel sheets follow the prescribed format. Columns should include Name, Email, and Phone for best results.
          </p>
        </div>
      </div>
    </div>
  );
}
