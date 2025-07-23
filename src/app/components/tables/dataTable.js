"use client";

import { Button } from "../../../components/components/ui/button";
import axios from "axios";
import { FilePen, FileSpreadsheet, Loader2, Plus, Search, Sheet, Trash, UserPlus } from "lucide-react";
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
import PopupModal from "../poppupmodal";
import UploadLeads from "../modals/uploadleads";



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
  const [loading, setLoading] = useState(false);
  const [pagearray, SetPageArry] = useState([1]);
  const [currentPage, SetcurrentPage] = useState(1);
  const [perPgae, SetperPgae] = useState(null);
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
  function goToPage(pageNumber, perPage) {
    SetperPgae(perPage)
    SetcurrentPage(pageNumber)
    setChange(true)
    // if (pageNumber < 1 || pageNumber > perPage) return;
    // const url = new URL(window.location.href);
    // url.searchParams.set("page", pageNumber);
    // url.searchParams.set("perpage", perPage);
    // window.location.href = url.toString();

  }
  

  const handleFetchdata = useCallback(() => {
    setLoading(true);
    axios
      .get(`${ROOT_URL}api/${url}?page=${currentPage}&perpage=${perPgae}`)
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
        if (res?.count) {
          SetPageArry(new Array(Math.ceil(res?.count / 10)).fill(0))
        }

        setLoading(false)
      })
      .catch(error => {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      });
    setChange(false);

  }, [url, change, router]);


  useEffect(() => {
    handleFetchdata();
  }, []);


  useEffect(() => {
    if (change) {
      handleFetchdata();
    }
  }, [change, handleFetchdata ]);


  useEffect(() => {
    handleSearchChange(searchTerm);
  }, [rows]);


  useEffect(() => {
    setSelectAll(false);
    setSelectedRows([]);
  }, [filteredRows]);


  // if (res?.type == 'model') {
  //   return <Modal title={`Add ${tableData?.name}`} open={true} >
  //     <div className="h-[10rem] w-[10rem] bg-red-500">
  //       <button>Add Roles</button>
  //     </div>
  //   </Modal>
  // }

  if (loading) {
    return <div className='flex justify-center items-center h-[80vh] w-full'>
      <Loader2 className="animate-spin" size={35} />
    </div>;
  }

  // Get final data to display
  const displayData = sortedData();

  return (
    <div className="w-full font-pretty max-sm:px-2 pb-16">

      {
        tableData?.rows?.length > 0 && <div className="mb-4 flex justify-between">
          <div className="flex gap-3">
            <div className="flex px-2 items-center rounded-md border-[1px] gap-2 w-[60%] bg-white max-md:w-[100%]">
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
              <SelectTrigger className="w-[180px] h-full bg-white max-md:hidden">
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


            {selectedRows?.length > 0 && tableData?.delete && (
              <div className="flex items-center gap-2">
                <PopupModal setChange={setChange} data={selectedRows} modaltype={'confirmdelete'} classname={'bg-red-500 text-white hover:bg-red-700 text-sm  ml-2  flex items-center gap-2 p-2  px-4 rounded-md'} > <p className='max-md:hidden'>Delete {selectedRows.length > 0 ? `(${selectedRows.length})` : 'All'} </p><Trash size={18} /></PopupModal>
              </div>
            )}

            {selectedRows?.length > 0 && tableData?.assign && (
              <div className="flex items-center gap-2">
                <PopupModal setChange={setChange} modaltype={'confirmassign'} data={selectedRows} classname={'bg-blue-500 text-white hover:bg-blue-700 text-sm  ml-2  flex items-center gap-2 p-3 px-4 rounded-md'} ><p className='max-md:hidden'>Assign </p><UserPlus size={18} /></PopupModal>
              </div>
            )}


            <Button
              onClick={handleExport}
              className="font-semibold bg-green-500 hover:bg-green-500 hover:text-white text-white h-full"
              variant="outline"
            >
              <>
                <span className="max-md:hidden font-normal text-white">
                  Export {selectedRows.length > 0 ? `(${selectedRows.length})` : 'All'}
                </span>
                <span className="max-sm:block">
                  <FileSpreadsheet size={22} />
                </span>
              </>

            </Button>

            {tableData?.create && (
              <button onClick={() => tableData?.formtype == 'modal' && setOpen(true)} className="bg-[#4E49F2] rounded-md hover:bg-[#4E49F2] text-white font-semibold ">
                {
                  tableData?.formtype == 'modal' ? <Modal title={`Add ${tableData?.name}`} classname={'bg-[#4E49F2] text-white'} icon='Add' open={open}>
                    <FormComponent formdata={tableData?.createform} setOpen={setOpen} />
                  </Modal> : <Link className="text-sm px-3 flex gap-2" href={`${tableData?.createform?.formurl}`}><p className="max-md:hidden">Add {tableData?.name}</p><Plus size={18} strokeWidth={3} />
                  </Link>
                }
              </button>
            )}

            {tableData?.upload && (
              <UploadLeads />
            )}



          </div>
        </div>
      }


      {/* Table */}
      <div className="overflow-y-scroll max-h-[85vh] border-[1px] rounded-md">

        {
          tableData?.rows?.length > 0 && <Table className="min-w-full  text-sm text-left text-gray-500 bg-white  ">
            <thead className="text-xs text-gray-100  p-3 first-letter:uppercase ">
              <tr>
                <TH>
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
                    classname={`${key == 'id' ? "hidden" : ""}`}
                  >
                    {key.replace(/_/g, ' ')} {sortConfig.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TH>
                ))}
                {(tableData?.update || tableData?.delete) && <TH classname="">Actions</TH>}

              </tr>
            </thead>
            <tbody className="max-w-[100%] bg-white ">
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
                        if (key === 'id') {
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
                                tableData?.formtype == 'modal' ? <Modal title={`Edit`} icon='Edit' classname={`bg-green-500 text-white hover:text-white hover:bg-green-500  shadow-none px-3 -py-1`} open={open}>
                                  <FormComponent id={row.id} formdata={tableData?.updateform} setOpen={setOpen} />
                                </Modal> : <Button className="bg-[#4E49F2] text-white">
                                  <Link className="flex items-center gap-2" href={`${tableData?.updateform?.formurl}?id=${row.id}`}>

                                    <FilePen size={22} /><p className="max-sm:hidden">Edit</p>
                                  </Link>
                                </Button>
                              )}
                            </button>
                            {tableData?.delete && (

                              <div className="flex items-center gap-2">
                                <PopupModal url={url} setChange={setChange} data={[row]} modaltype={'confirmdelete'} classname={'bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-500 hover:text-white text-sm  ml-2  flex items-center gap-2'} > <p className='max-md:hidden'>Delete </p><Trash size={18} /></PopupModal>
                              </div>

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
          tableData?.rows?.length == 0 && <div className="w-full h-[85vh] flex justify-center items-center flex-col gap-6">
            <h1 className="text-2xl font-bold">No data found</h1>
            <div className="flex gap-4">
              {tableData?.create && (
                <button onClick={() => tableData?.formtype == 'modal' && setOpen(true)} className="bg-[#4E49F2] hover:bg-[#4E49F2] text-white font-semibold rounded-md font-semibold">
                  {
                    tableData?.formtype == 'modal' ? <Modal title={`Add ${tableData?.name}`} icon={'Add'} classname={'bg-[#4E49F2] text-white'} open={open}>
                      <FormComponent formdata={tableData?.createform} setOpen={setOpen} />
                    </Modal> : <Link href={`${tableData?.createform?.formurl}`}>Add {tableData?.name}</Link>
                  }
                </button>
              )}
              {tableData?.upload && (
                <button onClick={() => tableData?.formtype == 'modal' && setOpen(true)} className="bg-[#4E49F2] rounded-md hover:bg-[#4E49F2] text-white font-semibold">
                  {
                    tableData?.formtype == 'modal' ? <Modal title={`Upload ${tableData?.name}`} classname={'bg-[#4E49F2] text-white'} icon='upload' open={open}>
                      <FormComponent formdata={tableData?.createform} setOpen={setOpen} />
                    </Modal> : <Link className="text-sm px-3 flex gap-2" href={`${tableData?.createform?.formurl}`}><p className="max-sm:hidden">Add {tableData?.name}</p><Plus size={18} strokeWidth={3} />
                    </Link>
                  }
                </button>
              )}
            </div>
          </div>
        }

        {/* Pagination */}

        {tableData?.pagination && (
          <div className="w-full bg-white flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t">

            {/* Showing text */}
            <div className="text-sm text-gray-600 w-full md:w-1/3 text-center md:text-left">
              Showing {tableData?.pagination.startIndex + 1}–{tableData?.pagination.endIndex + 1} of {tableData?.pagination.totalRows} entries
              {selectedRows.length > 0 && (
                <span className="text-blue-500"> ({selectedRows.length} selected)</span>
              )}
            </div>

            {/* Pagination buttons */}
            <Pagination className="w-full md:w-1/3 flex justify-center">
              <PaginationContent className="flex gap-1">

                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={tableData.pagination.hasPrevPage ? '' : 'pointer-events-none opacity-40'}
                    onClick={() => goToPage(tableData.pagination.page - 1 ,tableData.pagination.perPage)}
                  />
                </PaginationItem>

                {/* Page numbers (dynamic) */}
                {Array.from({ length: Math.min(tableData.pagination.totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={tableData.pagination.page === pageNum}
                        onClick={() => goToPage(pageNum ,tableData.pagination.perPage)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {/* Ellipsis if more pages */}
                {tableData.pagination.totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={tableData.pagination.hasNextPage ? '' : 'pointer-events-none opacity-40'}
                    onClick={() => goToPage(currentPage + 1,tableData.pagination.perPage)}
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>

            {/* Spacer or additional actions */}
            <div className="w-full md:w-1/3 text-center md:text-right text-sm text-gray-500">
              {/* You can show page info here, e.g., Page 1 of 5 */}
              Page {tableData.pagination.page} of {tableData.pagination.totalPages}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DataTable;