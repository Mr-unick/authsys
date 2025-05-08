import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "../../../components/components/ui/button";
import { Card } from "../../../components/components/ui/card";
import { Input } from "../../../components/components/ui/input";
import { toast } from "sonner";
import { FileUp } from 'lucide-react';
import axios from 'axios';

export default function ExcelToJsonConverter() {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isConverting, setIsConverting] = useState(false);

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
        toast.success('File uploaded successfully!');
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
       await axios.post('/api/leaddetails/uploadLeads',{leads:excelData})
      toast.success('Leads Uploaded Succesfully');
    } catch (error) {
      toast.error('Error uploading leads');
      console.error('Error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto border-none shadow-none">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl text-gray-500 mb-2">Upload Leads with Excel</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
            <Input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
           <label 
    for="file-upload" 
    className="flex items-center justify-center gap-1 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg " >
   
           <FileUp size={20} color='white'/> Select File
            </label>
            {fileName && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {fileName}
              </p>
            )}
          </div>

          {excelData && (
            <div className="space-y-8 ">
             

              <Button
                onClick={handleUpload}
                disabled={isConverting}
                className="w-full bg-blue-700 text-white hover:bg-blue-600 mt-5"
              >
                {isConverting ? 'Converting...' : 'Upload Leads'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}