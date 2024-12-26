"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import { DataTable } from "./data-table";
import { ArrowUpDown, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditDialog } from "./editDialog";
import { DeleteBtn } from "@/components/deleteBtn";
import Cookies from "js-cookie";

const uri = process.env.NEXT_PUBLIC_API;

export default function Home() {
  const [taskList, setTaskList] = useState([]);
  const jwtToken = Cookies.get("jwtToken");
  const deleteTask = async (id) => {
    const url = `${uri}/tasks/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
    };
    const request = await fetch(url, options);
    const response = await request.json();
    if (request.ok) {
      console.log(response);
    } else {
      console.log(response);
    }
    setTaskList((prev) => [...prev.filter((item) => item.id !== id)]);
  };

  const columns = [
    {
      accessorKey: "taskName",
      header: "Task Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "dueDate",
      // header: "Due Date (mm-dd-yyyy)",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due Date (mm-dd-yyyy)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableGlobalFilter: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableGlobalFilter: false,
    },
    {
      accessorKey: "priority",
      // header: "Priority",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      sortingFn: (rowA, rowB, columnId) => {
        if (rowA.original.priority === rowB.original.priority) {
          return 0;
        }
        if (rowA.original.priority === "Low") {
          return -1;
        }
        if (rowA.original.priority === "High") {
          return 1;
        }
        if (rowA.original.priority === "Medium") {
          if (rowB.original.priority === "Low") {
            return 1;
          }
          return -1;
        }
      },
      enableGlobalFilter: false,
    },
    {
      id: "delete",
      header: "Delete",
      cell: ({ row }) => {
        const data = row.original;

        return <DeleteBtn deleteTask={deleteTask} id={data.id} />;
      },
    },
    {
      id: "edit",
      header: "Edit",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <EditDialog
            taskList={taskList}
            setTaskList={setTaskList}
            id={data.id}
          />
        );
      },
    },
  ];
  useEffect(() => {
    const getData = async () => {
      const url = `${uri}/tasks`;
      const options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${jwtToken}`,
        },
      };
      const request = await fetch(url, options);
      const response = await request.json();
      if (request.ok) {
        setTaskList(response);
      } else {
        console.log("error");
      }
    };
    getData();
  }, [setTaskList, jwtToken]);
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-grow justify-center items-center">
        <DataTable
          columns={columns}
          data={taskList}
          setTaskList={setTaskList}
        />
      </div>
    </div>
  );
}
