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
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

    // Real-time updates via SSE
    const eventSource = new EventSource('/api/activities/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.heartbeat) return;

      // Generally refresh for any activity that might affect this table
      // In a more complex app, we'd filter by activity type or module
      setChange(true);
    };

    eventSource.onerror = (err) => {
      console.error("SSE error in DataTable:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);


  useEffect(() => {
    if (change) {
      handleFetchdata();
    }
  }, [change, handleFetchdata]);


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
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>;
  }

  // Get final data to display
  const displayData = sortedData();

  return (
    <div className="w-full font-pretty max-sm:px-2 pb-16">

      {
        tableData?.rows?.length > 0 && <div className="mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <div className="flex px-3.5 py-2 items-center rounded-lg border border-slate-200 gap-2.5 bg-white flex-1 md:min-w-[280px]">
              <Search size={15} className="text-slate-400" />
              <input
                onChange={(e) => handleSearchChange(e.target.value)}
                className="border-none outline-none text-sm w-full font-normal placeholder:text-slate-400"
                type="text"
                placeholder="Search..."
                value={searchTerm}
              />
            </div>

            <Select
              onValueChange={(value) => handleSortChange(value)}
              value={sortConfig.key || ""}
            >
              <SelectTrigger className="w-[160px] h-full bg-white rounded-lg border-slate-200 text-xs font-medium text-slate-500 max-md:hidden">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-slate-200">
                {tableData?.columns?.map((column, key) => (
                  <SelectItem key={key} value={column} className="text-xs font-medium text-slate-600 cursor-pointer">
                    {column.replace(/_/g, ' ')} {sortConfig.key === column && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">


            {selectedRows?.length > 0 && tableData?.delete && (
              <div className="flex items-center gap-2">
                <PopupModal url={url} setChange={setChange} data={selectedRows} modaltype={'confirmdelete'} classname={'bg-red-600 text-white hover:bg-red-700 text-sm font-medium flex items-center gap-2 h-9 px-3.5 rounded-lg transition-colors'} > <p className='max-md:hidden'>Delete {selectedRows.length > 0 ? `(${selectedRows.length})` : 'All'} </p><Trash size={15} /></PopupModal>
              </div>
            )}

            {selectedRows?.length > 0 && tableData?.assign && (
              <div className="flex items-center gap-2">
                <PopupModal setChange={setChange} modaltype={'confirmassign'} data={selectedRows} classname={'bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium flex items-center gap-2 h-9 px-3.5 rounded-lg transition-colors'} ><p className='max-md:hidden'>Assign </p><UserPlus size={15} /></PopupModal>
              </div>
            )}


            <Button
              onClick={handleExport}
              className="font-medium bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-3.5 rounded-lg transition-colors text-sm border-none"
              variant="outline"
            >
              <>
                <span className="max-md:hidden">
                  Export {selectedRows.length > 0 ? `(${selectedRows.length})` : 'All'}
                </span>
                <span className="md:hidden">
                  <FileSpreadsheet size={18} />
                </span>
              </>
            </Button>

            {tableData?.create && (
              <div className="flex items-center">
                {
                  tableData?.formtype == 'modal' ? (
                    <Modal
                      title={`Add ${tableData?.name}`}
                      classname={'bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-3.5 rounded-lg transition-colors font-medium text-sm'}
                      icon='Add'
                      open={addOpen}
                      onOpenChange={setAddOpen}
                    >
                      <FormComponent
                        formdata={tableData?.createform}
                        onSuccess={() => {
                          setChange(true);
                          setAddOpen(false);
                        }}
                      />
                    </Modal>
                  ) : (
                    <Link className="bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium text-sm px-3.5 h-9 flex items-center transition-colors gap-2" href={`${tableData?.createform?.formurl}`}>
                      <p className="max-md:hidden">Add {tableData?.name}</p>
                      <Plus size={16} />
                    </Link>
                  )
                }
              </div>
            )}

            {tableData?.upload && (
              <UploadLeads />
            )}



          </div>
        </div>
      }


      {/* ─── TABLE (desktop md+) ─── */}
      <div className="hidden md:block bg-white border border-slate-100 rounded-xl overflow-hidden mb-6">
        {
          tableData?.rows?.length > 0 && <Table className="min-w-full text-sm text-left bg-white">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
              <tr>
                <TH className="px-5 py-3">
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
                    classname={`px-5 py-3 cursor-pointer hover:text-indigo-600 transition-colors ${key == 'id' ? "hidden" : ""}`}
                  >
                    {key.replace(/_/g, ' ')} {sortConfig.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TH>
                ))}
                {(tableData?.update || tableData?.delete) && <TH classname="px-5 py-3">Actions</TH>}

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
                      className={`hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 ${isSelected ? 'bg-indigo-50/30' : ''}`}
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
                                tableData?.formtype == 'modal' ? (
                                  <Button
                                    onClick={() => {
                                      setEditingId(row.id);
                                      setEditOpen(true);
                                    }}
                                    className={`bg-indigo-600 text-white hover:text-white hover:bg-indigo-700 px-3 h-8 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors`}
                                  >
                                    <FilePen size={14} />
                                    <span className="max-sm:hidden">Edit</span>
                                  </Button>
                                ) : (
                                  <Button className="bg-[#4E49F2] text-white">
                                    <Link className="flex items-center gap-2" href={`${tableData?.updateform?.formurl}?id=${row.id}`}>
                                      <FilePen size={22} /><p className="max-sm:hidden">Edit</p>
                                    </Link>
                                  </Button>
                                )
                              )}
                            </button>
                            {tableData?.delete && (
                              <div className="flex items-center gap-2">
                                <PopupModal url={url} setChange={setChange} data={[row]} modaltype={'confirmdelete'} classname={'bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium flex items-center gap-1.5 border border-red-100'} > <p className='max-md:hidden'>Delete </p><Trash size={13} /></PopupModal>
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
          tableData?.rows?.length == 0 && <div className="w-full h-[85vh] flex justify-center items-center flex-col gap-5">
            <h1 className="text-lg font-bold text-slate-600">No data found</h1>
            <div className="flex gap-4">
              {tableData?.create && (
                <div className="flex items-center">
                  {
                    tableData?.formtype == 'modal' ? (
                      <Modal
                        title={`Add ${tableData?.name}`}
                        icon={'Add'}
                        classname={'bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm'}
                        open={addOpen}
                        onOpenChange={setAddOpen}
                      >
                        <FormComponent
                          formdata={tableData?.createform}
                          onSuccess={() => {
                            setChange(true);
                            setAddOpen(false);
                          }}
                        />
                      </Modal>
                    ) : <Link className="bg-indigo-600 text-white p-3 rounded-lg font-medium text-sm" href={`${tableData?.createform?.formurl}`}>Add {tableData?.name}</Link>
                  }
                </div>
              )}
              {tableData?.upload && (
                <div className="flex items-center">
                  {
                    tableData?.formtype == 'modal' ? <Modal title={`Upload ${tableData?.name}`} classname={'bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm'} icon='upload' open={addOpen} onOpenChange={setAddOpen}>
                      <FormComponent formdata={tableData?.createform} onSuccess={() => { setChange(true); setAddOpen(false); }} />
                    </Modal> : <Link className="text-sm px-3 flex gap-2 bg-indigo-600 text-white p-3 rounded-lg font-medium" href={`${tableData?.createform?.formurl}`}><p className="max-sm:hidden">Add {tableData?.name}</p><Plus size={18} strokeWidth={3} />
                    </Link>
                  }
                </div>
              )}
            </div>
          </div>
        }

        {/* Pagination */}

        {tableData?.pagination && (
          <div className="w-full bg-white flex flex-col md:flex-row justify-between items-center gap-3 p-4 border-t border-slate-100">

            {/* Showing text */}
            <div className="text-sm text-slate-500 w-full md:w-1/3 text-center md:text-left font-medium">
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
                    onClick={() => goToPage(tableData.pagination.page - 1, tableData.pagination.perPage)}
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
                        onClick={() => goToPage(pageNum, tableData.pagination.perPage)}
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
                    onClick={() => goToPage(currentPage + 1, tableData.pagination.perPage)}
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>

            {/* Spacer or additional actions */}
            <div className="w-full md:w-1/3 text-center md:text-right text-sm text-slate-400 font-medium">
              {/* You can show page info here, e.g., Page 1 of 5 */}
              Page {tableData.pagination.page} of {tableData.pagination.totalPages}
            </div>
          </div>
        )}

      </div>

      {/* ─── MOBILE CARD LIST (hidden on md+) ─── */}
      <div className="md:hidden space-y-3 mb-8">
        {tableData?.rows?.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-8 text-center flex flex-col items-center gap-3">
            <div className="text-4xl">📭</div>
            <p className="font-medium text-slate-500">No data found</p>
          </div>
        ) : (
          displayData?.map((row, index) => {
            const isSelected = selectedRows.includes(row.id);
            const allEntries = Object.entries(row).filter(([k]) => k !== 'id');
            const [firstKey, firstVal] = allEntries[0] || [];
            const rest = allEntries.slice(1);
            const badgeColors = {
              active: 'bg-green-100 text-green-700',
              inactive: 'bg-gray-100 text-gray-500',
              pending: 'bg-amber-100 text-amber-700',
              draft: 'bg-gray-100 text-gray-500',
            };
            return (
              <div
                key={index}
                className={`bg-white rounded-xl border overflow-hidden transition-colors ${isSelected ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-100'}`}
              >
                {/* Card header: checkbox + primary field + actions */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRowSelection(row.id)}
                      className="w-4 h-4 accent-indigo-600 shrink-0"
                    />
                    <span className="font-semibold text-slate-700 text-sm truncate">{firstVal ?? '—'}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {tableData?.update && (
                      tableData?.formtype === 'modal' ? (
                        <button
                          onClick={() => { setEditingId(row.id); setEditOpen(true); }}
                          className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          <FilePen size={13} /> Edit
                        </button>
                      ) : (
                        <Link
                          href={`${tableData?.updateform?.formurl}?id=${row.id}`}
                          className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          <FilePen size={13} /> Edit
                        </Link>
                      )
                    )}
                    {tableData?.delete && (
                      <PopupModal
                        url={url}
                        setChange={setChange}
                        data={[row]}
                        modaltype="confirmdelete"
                        classname="bg-red-50 text-red-600 border border-red-100 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        <Trash size={13} /> Del
                      </PopupModal>
                    )}
                  </div>
                </div>

                {/* Card body: remaining fields */}
                {rest.length > 0 && (
                  <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    {rest.map(([key, value], idx) => {
                      const isStatus = key.toLowerCase().includes('status');
                      const valStr = String(value ?? '').toLowerCase();
                      const isBadge = isStatus || ['active', 'inactive', 'pending', 'draft'].includes(valStr);
                      return (
                        <React.Fragment key={idx}>
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide self-center truncate">
                            {key.replace(/_/g, ' ')}
                          </span>
                          {isBadge ? (
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full w-fit capitalize ${badgeColors[valStr] || 'bg-indigo-50 text-indigo-700'}`}>
                              {value}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-700 font-medium truncate">{value ?? '—'}</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Mobile pagination */}
        {tableData?.pagination && (
          <div className="flex items-center justify-between pt-1 pb-4">
            <span className="text-xs text-slate-500 font-medium">
              Page {tableData.pagination.page} / {tableData.pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(tableData.pagination.page - 1, tableData.pagination.perPage)}
                disabled={!tableData.pagination.hasPrevPage}
                className="px-4 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white disabled:opacity-40 text-slate-600 active:bg-slate-50"
              >
                ← Prev
              </button>
              <button
                onClick={() => goToPage(tableData.pagination.page + 1, tableData.pagination.perPage)}
                disabled={!tableData.pagination.hasNextPage}
                className="px-4 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white disabled:opacity-40 text-slate-600 active:bg-slate-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>


      {editOpen && (
        <Modal
          title={`Edit ${tableData?.name}`}
          icon='Edit'
          classname={`hidden`}
          open={editOpen}
          onOpenChange={setEditOpen}
        >
          <FormComponent
            id={editingId}
            formdata={tableData?.updateform}
            onSuccess={() => {
              setChange(true);
              setEditOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default DataTable;