"use client";

import { Button } from "../../../components/components/ui/button";
import axios from "axios";
import { Search } from "lucide-react";
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
import { ROOT_URL } from "../../../../const";
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

const DataTable = ({ url }) => {
  const [tableData, setTableData] = useState(null);
  const [rows, setRows] = useState([]);
  const [change, setChange] = useState(false);

  const handleSortChange = (key) => {
    // setSortKey(key);
  };

  const handleSearchChange = (key) => {
    // setSearchKey(key);
  };

  // to delete data

  const handleDelete = async (id) => {
    let res = await axios.delete(`${ROOT_URL}api/${url}?id=${id}`);
    if (res.data.status) {
      setChange(true);
    }
  };

  // to edit data

  const handleUpdate = async (id) => {
    setChange(true);
  };

  // export to excel
  const handleExport = () => {
    let data = rows;

    const worksheet = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Sheet1");

    let date = new Date();
    date = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear();
    XLSX.writeFile(wb, `${tableData.title}_${date}.xlsx`);
  };

  // to fetch data

  const handleFetchdata = useCallback(() => {
    axios
      .get(`${ROOT_URL}api/${url}`)
      .then((res) => res.data)
      .then((res) => {
        setTableData(res.data);
        setRows(res.data.rows);
      });
    setChange(false);
    return;
  }, [change]);

  // to fetch initial data

  useEffect(() => {
    handleFetchdata();
  }, []);

  // to fetch data after updating , deleting ,adding

  useEffect(() => {
    if (change) {
      handleFetchdata();
    }
  }, [change]);

  if (!tableData || tableData.length === 0) {
    return <div className="text-center p-4 h-[80vh] w-full flex justify-center items-center">No data available.</div>;
  }

  return (
    <div className="w-full font-pretty">
      {/* <h1 className="my-2 text-md font-normal">{tableData.title}</h1> */}

      <div className="mb-5 flex justify-between">
        <div className="flex gap-3 ">
          <div className="flex px-2 items-center rounded-md border-[1px] gap-2 w-[60%] bg-white ">
            <Search size={14} />{" "}
            <input
              onChange={(e) => {
                handleSearchChange(e.target.value);
              }}
              className="border-none outline-none text-sm w-[80%]"
              type="text"
            />
          </div>

          <Select
            onValueChange={(value) => {
              handleSortChange(value);
            }}
          >
            <SelectTrigger className="w-[180px] h-full bg-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {tableData?.columns?.map((filter, key) => {
                return (
                  <SelectItem key={key} value={filter}>
                    {filter}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => handleExport()}
            className="font-semibold bg-green-500 hover:bg-green-500 hover:text-white text-gray-50"
            variant="outline"
          >
            Export
          </Button>
          {tableData.create && (
            <Button className="bg-[#4E49F2] hover:bg-[#4E49F2] text-white font-semibold">
              <Modal title={`Add ${tableData.name}`}>
                <FormComponent />
              </Modal>
            </Button>
          )}
        </div>
      </div>
      <div className=" overflow-y-scroll max-h-[85vh] border-[1px] rounded-md ">
        <Table className="min-w-full text-sm text-left text-gray-500  bg-white ">
          <thead className="text-xs text-gray-100  bg-[#4E49F2] rounded-md p-3  first-letter:uppercase">
            <tr>
              {tableData.columns.map((key) => (
                <TH key={key}>
                  {key}
                </TH>
              ))}
              {(tableData.update || tableData.delete) && (
                <TH>Actions</TH>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b hover:bg-[#F2F2F2]">
                {Object.values(row).map((value, idx) => (
                  <TD key={idx} >
                    {value}
                  </TD>
                ))}

                {(tableData.update || tableData.delete) && (
                  <TD >
                    <div className="flex gap-5">
                    {tableData.update && (
                      <Modal title={`Edit`}>
                        <div className="w-full h-full bg-red">
                          sssssssssssssssssssss
                        </div>
                      </Modal>
                    )}
                    {tableData.delete && (
                      <button
                        onClick={() => {
                          handleDelete(row.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                    </div>
                    
                  </TD>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="w-full bg-white flex justify-start items-end p-2">
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
                <PaginationLink href="#">4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">5</PaginationLink>
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
      </div>
    </div>
  );
};

export default DataTable;