import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateWorkspace() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        "https://teamsync-backend-5s2n.onrender.com/api/workspace/create",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Workspace Created");
      navigate(`/workspace/${res.data._id}`);
    } catch (error) {
      console.log("Error in workspace creation:", error);
      toast.error("Error creating workspace");
    }
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
            Create a new workspace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className={"w-full bg-indigo-600 hover:bg-indigo-700"}>
              Create Workspace
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
