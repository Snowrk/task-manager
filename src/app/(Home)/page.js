import Image from "next/image";
import Header from "@/components/header";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Home() {
  const data = [
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
  ];
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-grow justify-center items-center">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
