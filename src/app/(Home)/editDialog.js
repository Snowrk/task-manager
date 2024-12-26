import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
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

export const EditDialog = ({ id, taskList, setTaskList }) => {
  const [currentTask] = taskList.filter((item) => item.id === id);
  const currentDate = currentTask.dueDate.split("-");
  const jwtToken = Cookies.get("jwtToken");
  const setDefaultValues = () => {
    form.setValue("taskName", currentTask.taskName);
    form.setValue("description", currentTask.description);
    form.setValue(
      "dueDate",
      new Date(currentDate[2], currentDate[0] - 1, currentDate[1])
    );
    form.setValue("status", currentTask.status);
    form.setValue("priority", currentTask.priority);
  };
  async function onSubmit(data) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    const url = `${uri}/tasks/${id}`;
    const options = {
      method: "PUT",
      body: JSON.stringify({
        taskName: data.taskName,
        description: data.description,
        dueDate: format(new Date(data.dueDate), "MM-dd-yyyy"),
        status: data.status,
        priority: data.priority,
      }),
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
    setTaskList((prev) => {
      const temp = [...prev];
      const idx = temp.findIndex((item) => item.id === id);
      temp[idx].taskName = data.taskName;
      temp[idx].description = data.description;
      temp[idx].dueDate = format(new Date(data.dueDate), "MM-dd-yyyy");
      temp[idx].status = data.status;
      temp[idx].priority = data.priority;
      return temp;
    });
  }
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form.formState, form.reset]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="ml-auto" onClick={setDefaultValues}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil /> Edit Task
          </DialogTitle>
          <DialogDescription>
            Make changes to the existing task.
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
                        disabled={(date) => date < sub(new Date(), { days: 1 })}
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
                        <SelectItem value="In Progress">In Progress</SelectItem>
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
                Save changes
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
