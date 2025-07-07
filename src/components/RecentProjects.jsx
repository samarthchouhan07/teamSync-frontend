import { Calendar, CheckCircle, Plus, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { Avatar } from "./ui/avatar";
import { Progress } from "./ui/progress";

export const RecentProjects = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ["myWorkspaces"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://teamsync-backend-5s2n.onrender.com/api/dashboard/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("worksapces:", data);
      return data;
    },
  });
  console.log("workspaces:", workspaces);

  return (
    <div className="w-full">
      <Card className={"col-span-2"}>
        <CardHeader>
          <CardTitle
            className={
              "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            }
          >
            Recent Workspace
            <Button size={"sm"} onClick={() => navigate("/workspace/create")}>
              <Plus className="h-4 w-4 mr-2" />
              New Workspace
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className={"h-16 w-full rounded-lg"} />
                <Skeleton className={"h-16 w-full rounded-lg"} />
              </>
            ) : workspaces.length === 0 ? (
              <>
                <p className="text-sm text-gray-500">No Workspace Found</p>
              </>
            ) : (
              workspaces.slice(0, 3).map((workspace) => {
                const memberCount = workspace.members.length;
                const role = workspace.memberRoles?.[userId] || "member";
                return (
                  <div
                    key={workspace._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:shadow transition-shadow"
                  >
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <h3 className="font-semibold">{workspace.name}</h3>
                        <Badge variant="outline" className="capitalize w-fit">
                          {role}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap text-sm text-gray-600 gap-x-4 gap-y-1">
                        <span className="flex items-center ">
                          <Users className="h-4 w-4 mr-1" />
                          {memberCount} members
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(workspace.createdAt), "dd MM yyyy")}
                        </span>
                        <span className="flex items-center">
                          <CheckCircle className="size-4 mr-1" />
                          {workspace.completedTasks}/ {workspace.totalTasks}{" "}
                          tasks
                        </span>
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={
                            workspace.totalTasks > 0
                              ? (workspace.completedTasks /
                                  workspace.totalTasks) *
                                100
                              : 0
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end mt-4 sm:mt-0 w-full sm:w-auto gap-4">
                      <div className="flex -space-x-2">
                        {[0, 1, 2].map((_, idx) => (
                          <Avatar
                            key={idx}
                            className={"size-8 border-2 border-white"}
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full text-white flex items-center justify-center text-xs font-semibold">
                              M
                            </div>
                          </Avatar>
                        ))}
                      </div>
                      <Button
                        variant={"outline"}
                        size={"sm"}
                        onClick={() => navigate(`/workspace/${workspace._id}`)}
                      >
                        Open
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
