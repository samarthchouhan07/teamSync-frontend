import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

export default function TaskModal({
  task,
  onClose,
  onSave,
  setTaskData,
  members,
  onDelete,
  listId,
}) {
  console.log("selectedTask:", task);
  // if (!task) return null;
  const isOpen = !!task;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      {task && (
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update your task details here.
            </DialogDescription>
          </DialogHeader>
          <Input
            className="mb-2"
            placeholder="Task title"
            value={task.title || ""}
            onChange={(e) => setTaskData({ ...task, title: e.target.value })}
          />
          <Textarea
            className="mb-2"
            placeholder="Task description"
            rows={4}
            value={task.description || ""}
            onChange={(e) =>
              setTaskData({ ...task, description: e.target.value })
            }
          />
          <Label className="text-sm text-muted-foreground">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal mb-2",
                  !task.dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {task.dueDate
                  ? format(new Date(task.dueDate), "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className={"w-full p-4 min-w-[260px] z-50"}>
              <Calendar
                mode="single"
                selected={task.dueDate ? new Date(task.dueDate) : undefined}
                onSelect={(date) =>
                  setTaskData({ ...task, dueDate: date?.toISOString() ?? null })
                }
                className={"w-full p-4 min-w-[260px] z-50"}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          <Label className="text-sm text-muted-foreground ">Assign To</Label>
          <Select
            value={task.assignedTo || ""}
            onValueChange={(value) =>
              setTaskData({ ...task, assignedTo: value })
            }
          >
            <SelectTrigger className={"mb-2"}>
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent className={"mt-2"}>
              <SelectItem value={"unassigned"}>Unassigned</SelectItem>
              {members.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label className="text-sm text-muted-foreground">Status</Label>
          <Select
            value={task.status}
            onValueChange={(value) => setTaskData({ ...task, status: value })}
          >
            <SelectTrigger className={"mb-2"}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>

          {task.assignedTo === localStorage.getItem("userId") && (
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="checkbox"
                checked={task.isCompleted || false}
                onCheckedChange={(checked) =>
                  setTaskData({ ...task, isCompleted: checked })
                }
              />
              <Label
                htmlFor="isCompleted"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark as done
              </Label>
            </div>
          )}
          <Button
            onClick={onSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
          <DialogFooter className="flex flex-col gap-2 ">
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task._id, listId);
                onClose();
              }}
              className="w-full"
            >
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
