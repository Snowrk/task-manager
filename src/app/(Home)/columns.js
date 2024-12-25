"use client";

import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const deleteTask = (id) => {};

export const columns = [
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
  },
  {
    accessorKey: "status",
    header: "Status",
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
        <Button variant="ghost" onClick={() => deleteTask(data.id)}>
          <Pencil />
        </Button>
      );
    },
  },
];
