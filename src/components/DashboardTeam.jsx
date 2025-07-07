import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const DashboardTeam = () => {
  const { data: team = [], isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/dashboard/team", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  console.log("Team members:", team);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Collaborators in your shared workspaces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <>
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className={"w-8 h-8 rounded-full"} />
                      <div className="space-y-1">
                        <Skeleton className={"w-32 h-4"} />
                        <Skeleton className={"w-48 h-3"} />
                      </div>
                    </div>
                    <Skeleton className={"w-24 h-3 sm:w-32"} />
                  </div>
                </>
              ))
            : team.map((member) => (
                <>
                  <div
                    key={member._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full text-white flex items-center justify-center text-xs font-semibold">
                        {(member.username || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium">{member.username}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 sm:text-right">
                      Joined: {new Date(member.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </>
              ))}
        </div>
      </CardContent>
    </Card>
  );
};
