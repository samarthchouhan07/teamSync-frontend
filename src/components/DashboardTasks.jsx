import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import axios from "axios";

export const DashboardTasks = () => {
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://teamsync-backend-5s2n.onrender.com/api/dashboard/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //   console.log("res.data",res.data)
      return res.data;
    },
  });
  console.log("Tasks in dashboard:", tasks);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
        <CardDescription>
          Latest task updates across all projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks?.map((task) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-2"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1 sm:mt-0 ${
                    task.status === "Done"
                      ? "bg-green-500"
                      : task.status === "In Progress"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`text-sm font-medium  ${
                    task.status === "Done"
                      ? "text-green-500"
                      : task.status === "In Progress"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {task.status.replace("-", " ")}
                </span>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full text-white flex items-center justify-center text-xs font-semibold">
                  {(task.assignedToUsername || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
