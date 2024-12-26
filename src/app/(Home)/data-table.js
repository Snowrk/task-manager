"use client";

import { useState, useEffect } from "react";
import { v4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SquarePlus } from "lucide-react";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { format, sub, isPast } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const uri = process.env.NEXT_PUBLIC_API;

const FormSchema = z.object({
  dueDate: z.date({
    required_error: "A date of birth is required.",
  }),
  taskName: z
    .string({ required_error: "Task name is required." })
    .min(3, { message: "Task name should contain at least 3 letters." }),
  description: z.string().optional(),
  status: z.string(),
  priority: z.string(),
});

export function DataTable({ columns, data, setTaskList }) {
  const jwtToken = Cookies.get("jwtToken");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });
  async function onSubmit(data) {
    const obj = {
      id: v4(),
      taskName: data.taskName,
      description: data.description,
      dueDate: format(new Date(data.dueDate), "MM-dd-yyyy"),
      status: data.status,
      priority: data.priority,
    };
    const url = `${uri}/tasks`;
    const options = {
      method: "POST",
      body: JSON.stringify(obj),
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
    setTaskList((prev) => [...prev, obj]);
  }
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form]);

  return (
    <div className="w-4/6 max-w-6xl">
      <div className="flex items-center py-4 gap-2 flex-wrap">
        <Input
          placeholder="Search tasks..."
          value={globalFilter}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          className="max-w-sm"
        />
        <Select
          onValueChange={(event) => {
            console.log(event);
            table.getColumn("status")?.setFilterValue(event);
          }}
          value={table.getColumn("status")?.getFilterValue() ?? ""}
          className="max-w-sm"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => table.resetColumnFilters()}>
          Clear Filters
        </Button>
        <Button variant="outline" onClick={() => table.resetSorting()}>
          Clear Sorting
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <SquarePlus /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <SquarePlus /> Add Task
              </DialogTitle>
              <DialogDescription>
                Add the task you want to keep track off.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 flex flex-col"
              >
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Task Name</FormLabel>
                      <Input
                        id="taskName"
                        value={field.value}
                        onChange={field.onChange}
                        className="col-span-3"
                      />
                      <FormMessage className="col-span-4 text-center" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Description</FormLabel>
                      <Textarea
                        id="description"
                        value={field.value}
                        onChange={field.onChange}
                        className="col-span-3"
                      />
                      <FormMessage className="col-span-4 text-center" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left justify-start font-normal col-span-3",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a due date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(1901, 0, 1)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="col-span-4 text-center" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        className="max-w-sm"
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage className="col-span-4 text-center" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        className="max-w-sm"
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Set priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Priority</SelectLabel>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage className="col-span-4 text-center" />
                    </FormItem>
                  )}
                />
                <DialogClose asChild>
                  <Button type="submit" className="self-end">
                    Add
                  </Button>
                </DialogClose>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    isPast(new Date(row.getVisibleCells()[2].getValue())) &&
                    row.getVisibleCells()[3].getValue() !== "Completed"
                      ? "bg-red-800 text-white hover:text-foreground"
                      : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const cls = cell.column.id === "dueDate" ? "px-6" : "";
                    const cln = cell.column.id === "priority" ? "px-6" : "";
                    return (
                      <TableCell key={cell.id} className={`${cls} ${cln}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
