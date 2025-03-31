"use client";

import { Button } from "../../../components/components/ui/button";
import axios from "axios";
import { FilePen, FileSpreadsheet, Search, Sheet, Trash } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/components/ui/select";
import { Table } from "../../../components/components/ui/table";
import Modal from "../modal";
import { ROOT_URL, userData } from "../../../../const";
import FormComponent from "../forms/form";
import * as XLSX from "xlsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/components/ui/pagination";
import Block from "./tags/column";
import TD from "./tags/column";
import TH from "./tags/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { Checkbox } from "../../../components/components/ui/checkbox";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { haspermission } from "@/utils/authroization";



//const ROOT_URL = process.env.NEXT_PUBLIC_API_URL || '';

const DataTable = ({ url }) => {
  const [tableData, setTableData] = useState(null);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [change, setChange] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [open, setOpen] = useState(false)
  const [res, setRes] = useState(null)
  const router = useRouter();
  const { asPath } = router;


  // Sorting logic
  const handleSortChange = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sort to data
  const sortedData = useCallback(() => {
    if (!sortConfig.key) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      if (a[sortConfig.key] === undefined || b[sortConfig.key] === undefined) {
        return 0;
      }

      const aValue = typeof a[sortConfig.key] === 'string' ? a[sortConfig.key].toLowerCase() : a[sortConfig.key];
      const bValue = typeof b[sortConfig.key] === 'string' ? b[sortConfig.key].toLowerCase() : b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredRows, sortConfig]);

  // Search logic
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredRows(rows);
      return;
    }

    const filtered = rows.filter((row) => {
      return Object.values(row).some((value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term.toLowerCase());
      });
    });

    setFilteredRows(filtered);
  };

  // Selection logic
  const toggleRowSelection = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all visible rows
      setSelectedRows(filteredRows.map(row => row.id));
    } else {
      // Deselect all
      setSelectedRows([]);
    }
  };

  // Perform actions on selected rows
  const handleActionOnSelected = (action) => {
    if (selectedRows.length === 0) return;

    // Example: bulk delete
    if (action === 'delete') {
      if (window.confirm(`Delete ${selectedRows.length} selected items?`)) {
        Promise.all(selectedRows.map(id => axios.delete(`${ROOT_URL}api/${url}?id=${id}`)))
          .then(() => {
            setChange(true);
            setSelectedRows([]);
          })
          .catch(err => console.error("Bulk delete failed:", err));
      }
    }

    // Add more bulk actions as needed
  };

  // Delete single row
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        let res = await axios.delete(`${ROOT_URL}api/${url}?id=${id}`);
        if (res.data.status) {
          setChange(true);
          setSelectedRows(prev => prev.filter(rowId => rowId !== id));
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // Update row
  const handleUpdate = async (id) => {
    setChange(true);
  };

  // Export to Excel
  const handleExport = () => {
    const dataToExport = selectedRows.length > 0
      ? rows.filter(row => selectedRows.includes(row.id))
      : rows;

    // Transform data for export if needed
    const exportData = dataToExport.map(row => {
      const exportRow = {};
      tableData?.columns.forEach(col => {
        exportRow[col] = row[col];
      });
      return exportRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Sheet1");

    let date = new Date();
    date = date.getDate() + "_" + (date.getMonth() + 1) + "_" + date.getFullYear();
    XLSX.writeFile(wb, `${tableData?.title}_${date}.xlsx`);
  };

  // Fetch data
  const handleFetchdata = useCallback(() => {
    axios
      .get(`${ROOT_URL}api/${url}`)
      .then((res) => res.data)
      .then((res) => {
        if (res.status == 500) {
          toast.error("Something went wrong");
          router.back();
          return
        }

        if (res.status == 401) {
          toast.error(res.message)
          router.back();
          return
        }
        setTableData(res?.data);
        setRows(res?.data?.rows);
        setFilteredRows(res?.data?.rows);
        setRes(res)
      })
      .catch(error => {
        console.error("Failed to fetch data:", error);

      });
    setChange(false);
  }, [url, change, router]);

  // Initial data fetch
  useEffect(() => {
    handleFetchdata();
  }, []);

  // Fetch after changes
  useEffect(() => {
    if (change) {
      handleFetchdata();
    }
  }, [change, handleFetchdata]);

  // Update filtered rows when rows change
  useEffect(() => {
    handleSearchChange(searchTerm);
  }, [rows]);

  // Reset selection when filtered rows change
  useEffect(() => {
    setSelectAll(false);
    setSelectedRows([]);
  }, [filteredRows]);



  if (res?.type == 'model') {
    return <Modal title={`Add ${tableData?.name}`} open={true} >
      <div className="h-[10rem] w-[10rem] bg-red-500">
        <button>Add Roles</button>
      </div>
    </Modal>
  }

  // Get final data to display
  const displayData = sortedData();

  return (
    <div className="w-full font-pretty max-sm:px-2">
      {/* Table actions and filters */}

      {
        tableData?.rows?.length > 0 && <div className="mb-5 flex justify-between">
          <div className="flex gap-3">
            <div className="flex px-2 items-center rounded-md border-[1px] gap-2 w-[60%] bg-white max-sm:w-[100%]">
              <Search size={14} />
              <input
                onChange={(e) => handleSearchChange(e.target.value)}
                className="border-none outline-none text-sm w-[80%] "
                type="text"
                placeholder="Search..."
                value={searchTerm}
              />
            </div>

            <Select
              onValueChange={(value) => handleSortChange(value)}
              value={sortConfig.key || ""}

            >
              <SelectTrigger className="w-[180px] h-full bg-white max-sm:hidden">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {tableData?.columns?.map((column, key) => (
                  <SelectItem key={key} value={column}>
                    {column} {sortConfig.key === column && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            {selectedRows?.length > 0 && (
              <div className="flex items-center gap-2">
                
                <Button
                  onClick={() => handleActionOnSelected('delete')}
                  variant="outline"
                  className="text-red-500 hover:text-red-700 text-sm max-sm:hidden"
                >
                  <span className="text-sm">Delete{"("}{selectedRows?.length}{")"}</span>
                </Button>

                <Button
                  onClick={() => handleActionOnSelected('delete')}
                  variant="outline"
                  className="text-red-500 hover:text-red-700 text-sm  mxlg-sm:block ml-2 bg-red-600 text-white"
                >
                  <span className="text-sm"><Trash size={22}/></span>
                </Button>


              </div>
            )}

            <Button
              onClick={handleExport}
              className="font-semibold bg-green-500 hover:bg-green-500 hover:text-white text-gray-50"
              variant="outline"
            >
              <>
                <span className="max-sm:hidden">
                  Export {selectedRows.length > 0 ? `(${selectedRows.length})` : 'All'}
                </span>
                <span className="max-sm:block">
                  <FileSpreadsheet size={22} />
                </span>
              </>

            </Button>

            {tableData?.create && (
              <button onClick={() => tableData?.formtype == 'modal' && setOpen(true)} className="bg-[#4E49F2] rounded-md hover:bg-[#4E49F2] text-white font-semibold">

                {
                  tableData?.formtype == 'modal' ? <Modal title={`Add ${tableData?.name}`} classname={'bg-[#4E49F2] text-white'} icon='Add' open={open}>
                    <FormComponent formdata={tableData?.createform} setOpen={setOpen} />
                  </Modal> : <Link href={`${tableData?.createform?.formurl}`}>Add {tableData?.name}</Link>
                }
              </button>


            )}
          </div>
        </div>
      }


      {/* Table */}
      <div className="overflow-y-scroll max-h-[85vh] border-[1px] rounded-md">

        {
          tableData?.rows?.length > 0 && <Table className="min-w-full  text-sm text-left text-gray-500 bg-white ">
            <thead className="text-xs text-gray-100  p-3 first-letter:uppercase ">
              <tr >
                <TH >
                  <input type="checkbox"
                    checked={selectAll && filteredRows.length > 0}
                    onChange={toggleSelectAll}
                    className="mx-2"
                  />
                </TH>
                {tableData?.columns?.map((key) => (
                  <TH
                    key={key}
                    onClick={() => handleSortChange(key)}

                  >
                    {key.replace(/_/g, ' ')} {sortConfig.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TH>
                ))}
                {(tableData?.update || tableData?.delete) && <TH>Actions</TH>}

              </tr>
            </thead>
            <tbody className="max-w-[100%]">
              {displayData?.length === 0 ? (
                <tr>
                  <td colSpan={tableData?.columns?.length + 2} className="px-4 py-3 text-center">
                    No results found.
                  </td>
                </tr>
              ) : (
                displayData?.map((row, index) => {
                  const isSelected = selectedRows.includes(row.id);

                  return (
                    <tr
                      key={index}
                      className={` hover:bg-[#F2F2F2] ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <TD className="px-4 py-3 text-center">
                        <input type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(row.id)}
                        />
                      </TD>

                      {Object.entries(row).map(([key, value], idx) => {
                        // Skip rendering the id column if it's not in tableData?.columns
                        if (key === 'id' && !tableData?.columns.includes('id')) {
                          return null;
                        }

                        // Determine cell type based on data or column configuration
                        let cellType = 'default';

                        // This is where you would implement column type detection
                        // Example logic:
                        if (typeof value === 'string') {
                          if (value.match(/^#[0-9A-F]{6}$/i)) {
                            cellType = 'color'; // Color hex code
                          } else if (['active', 'inactive', 'pending', 'draft'].includes(value.toLowerCase())) {
                            cellType = 'badge'; // Status badge
                          }
                        } else if (Array.isArray(value)) {
                          cellType = 'list'; // Array of values
                        }

                        if (key.toLowerCase().includes('status')) cellType = 'badge';
                        if (key.toLowerCase().includes('color')) cellType = 'color';
                        if (key.toLowerCase().includes('tags')) cellType = 'list';

                        return (
                          <TD
                            key={idx}
                            type={cellType}
                          >
                            {value}
                          </TD>
                        );
                      })}

                      {(tableData?.update || tableData?.delete) && (
                        <TD>
                          <div className="flex gap-5 max-sm:gap-2">
                            <button>
                              {tableData?.update && (
                                tableData?.formtype == 'modal' ? <Modal title={`Edit`} icon='Edit' classname={`bg-blue-700 text-white`} open={open}>
                                  <FormComponent id={row.id} formdata={tableData?.updateform} setOpen={setOpen} />
                                </Modal> : <Button className="bbg-[#4E49F2] text-white">
                                    <Link className="flex items-center gap-2"  href={`${tableData?.updateform?.formurl}?id=${row.id}`}>
                                   
                                      <FilePen size={22} /><p className="max-sm:hidden">Edit</p>
                                    </Link>
                                </Button>
                              )}
                            </button>
                            {tableData?.delete && (

                              <Modal title={`Delete`} icon='Delete' classname={`bg-red-600 text-white`} open={open}>
                                  <FormComponent id={row.id} formdata={tableData?.updateform} setOpen={setOpen} />
                              </Modal>
                              
                            )}
                          </div>
                        </TD>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>

        }

        {
          tableData?.rows?.length == 0 && <div className="w-full h-[80vh] flex justify-center items-center flex-col gap-6">
            <h1 className="text-2xl font-bold">No data found</h1>
            {tableData?.create && (
              <button onClick={() => tableData?.formtype == 'modal' && setOpen(true)} className="bg-[#4E49F2] hover:bg-[#4E49F2] text-white font-semibold">
                {
                  tableData?.formtype == 'modal' ? <Modal title={`Add ${tableData?.name}`} classname={'bg-[#4E49F2] text-white'} open={open}>
                    <FormComponent formdata={tableData?.createform} setOpen={setOpen} />
                  </Modal> : <Link href={`${tableData?.createform?.formurl}`}>Add {tableData?.name}</Link>
                }
              </button>


            )}
          </div>
        }

        {/* Pagination */}
        {
          tableData?.rows?.length > 15 && <div className="w-full bg-white flex justify-between items-center p-2">
            <div className="text-sm text-gray-500">
              Showing {displayData?.length} of {rows?.length} entries
              {selectedRows.length > 0 && ` (${selectedRows?.length} selected)`}
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        }
      </div>
    </div>
  );
};

export default DataTable;