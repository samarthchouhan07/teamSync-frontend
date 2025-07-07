import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function JoinWorkspace() {
  const [workspaceId, setWorkspaceId] = useState("");
  const navigate = useNavigate();
  const { data: myWorkspaces,isLoading } = useQuery({
    queryKey: ["myWorkspaces"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/workspace/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const token = localStorage.getItem("token");

  const handleJoin = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:5000/api/workspace/join",
      {
        workspaceId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success("Workspace joined");
    navigate(`/workspace/${res.data._id}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <Card
        className={
          "w-full max-w-md shadow-xl border border-gray-200 bg-white/80 backdrop-blur-sm"
        }
      >
        <CardHeader className={"text-center space-y-2"}>
          <div className="flex justify-center">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className={"text-2xl font-bold text-gray-800"}>
            Join a workspace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <Label htmlFor="workspaceId" className={"text-sm text-gray-700"}>
                Workspace Id
              </Label>
              <Input
                id="workspaceId"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                placeholder="Enter workspace Id"
                required
              />
            </div>
            <Button
              type="submit"
              className={"w-full bg-green-600 hover:bg-green-700 text-white"}
            >
              Join Workspace
            </Button>
          </form>
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Your Current Workspace:
            </h3>
            {isLoading ? (
              <>
                 <Skeleton className={"h-6 w-full rounded"}/>
                 <Skeleton className={"h6 w-full rounded"}/>
              </>
            ):myWorkspaces.length===0?(
              <p className="text-sm text-gray-500">You are not in any workspaces</p>
            ):(
              <ul className="space-y-1">
                {myWorkspaces.map((ws)=>(
                  <li key={ws._id} className="text-sm text-gray-800 border p-2 rounded bg-gray-50">
                    <strong>{ws.name}</strong>
                    <span className="ml-2 text-gray-500 text-xs">
                      (ID: {ws._id})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
