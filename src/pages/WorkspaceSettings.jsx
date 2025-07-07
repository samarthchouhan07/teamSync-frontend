import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const WorkspaceSettings = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://teamsync-backend-5s2n.onrender.com/api/workspace/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const current = res.data.find((ws) => ws._id === id);
        if (current) setName(current.name);
      });
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault()

    await axios.put(
      `https://teamsync-backend-5s2n.onrender.com/api/workspace/${id}`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate(`/workspace/${id}`)
    toast.success("Updated workspace");
  };

  const handleDelete = async () => {
    await axios.delete(`https://teamsync-backend-5s2n.onrender.com/api/workspace/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Deleted Workspace");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card
        className={
          "w-full max-w-md shadow-xl border border-gray-200 bg-white/80 backdrop-blur-sm"
        }
      >
        <CardHeader className={"text-center space-y-2"}>
          <div className="flex justify-center">
            <Sparkles className="w-8 h-8 text-indigo-800" />
          </div>
          <CardTitle className={"text-2xl font-bold text-gray-800"}>
            Update workspace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="">
              <Label htmlFor="name" className={"text-sm text-gray-700 "}>
                Workspace Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Product Team"
                className={"mt-1"}
                required
              />
            </div>
            <Button
              type="submit"
              className={"w-full bg-indigo-600 hover:bg-indigo-700"}
            >
              Update Workspace
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className={"w-full bg-red-600 hover:bg-red-700"}
            >
              Delete Workspace
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
