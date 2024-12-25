"use client";

import { useState } from "react";
import Header from "@/components/header";
import { DataTable } from "./data-table";
import { ArrowUpDown, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditDialog } from "./editDialog";

export default function Home() {
  const [taskList, setTaskList] = useState([
    {
      id: "728ed52f",
      taskName: "work",
      status: "Completed",
      dueDate: "12-25-2024",
      description: "complete your work",
      priority: "High",
    },
    {
      id: "738ed52f",
      taskName: "assignment",
      status: "Pending",
      dueDate: "12-26-2024",
      description: "create a task manager app",
      priority: "High",
    },
    {
      id: "748ed52f",
      taskName: "assignment",
      status: "Pending",
      dueDate: "12-24-2024",
      description: "create a task manager app",
      priority: "Medium",
    },
    {
      id: "758ed52f",
      taskName: "assignment",
      status: "In Progress",
      dueDate: "12-28-2024",
      description: "create a task manager app",
      priority: "Low",
    },
    // ...
  ]);

  const deleteTask = (id) => {
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

        return (
          <Button variant="ghost" onClick={() => deleteTask(data.id)}>
            <Trash2 />
          </Button>
        );
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
