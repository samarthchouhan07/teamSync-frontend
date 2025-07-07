import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Calendar,
  Calendar1,
  ClipboardCopy,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Settings2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boardName, setBoardName] = useState("");
  const token = localStorage.getItem("token");
  const [boards, setBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: workspaces = []} = useQuery({
    queryKey: ["myWorkspaces"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/dashboard/my",
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

  const fetchBoards = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/workspace/${id}/boards`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Boards fetched:", res.data);
      setBoards(res.data.boards);
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  useEffect(() => {
    try {
      fetchBoards();
    } catch (error) {
      console.log("error in fetchBoards call useEffect:", error);
    }
  }, [id, token]);

  const handleCreateBoard = async () => {
    await axios.post(
      `http://localhost:5000/api/workspace/${id}/boards`,
      { name: boardName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success("Board created");
    fetchBoards();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
    toast.success("Workspace ID copied to clipboard");
  };

  console.log("boards", boards);
  const filteredBoards = boards.filter((board) =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Workspace Dashboard
              </h1>
              <p className="text-gray-600">
                Manage Your boards and collaborate with your{" "}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className={
                  "flex text-black items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                }
                onClick={() => navigate(`/workspace/settings/${id}`)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Workspace Id
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Share this ID to invite team members
                </p>
                <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-700 select-all">
                  {id}
                </code>
              </div>
              <Button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`}
              >
                <ClipboardCopy className="w-4 h-4" />
                Copy
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 h-fit">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Create New Board
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label
                    className={"block text-sm font-medium text-gray-700 mb-2"}
                  >
                    Board Name
                  </Label>
                  <Input
                    type={"text"}
                    placeholder="Enter board name..."
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    className={
                      "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    }
                  />
                </div>
                <Button
                  onClick={handleCreateBoard}
                  disabled={!boardName.trim()}
                  className={cn(
                    "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  )}
                >
                  Create Board
                </Button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Your Boards
                    </h3>
                    <p className="text-sm text-gray-500">
                      {boards.length} boards total
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search boards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-64"
                  />
                </div>
              </div>
              {filteredBoards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBoards.map((board) => (
                    <div
                      key={board._id}
                      className="group p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-blue-300 bg-white/50"
                      onClick={() => navigate(`/board/${board._id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {board.name}
                        </h4>
                        {/* <Button
                          className={
                            "opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 hover:scale-110 rounded"
                          }
                        >
                          <MoreHorizontal className="w-4 h-4 text-black hover:text-white"/>
                        </Button> */}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{board.members} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            <span>
                              {new Date(board.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>
                    {searchTerm
                      ? "No boards found matching your search"
                      : "No boards yet"}
                  </p>
                  <p>
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Create your first board to get started"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Boards
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {boards.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Workspace
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {workspaces.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="size-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    //   <div className="max-w-4xl mx-auto space-y-6">
    //     <Card
    //       className={
    //         "shadow-lg border border-gray-200 bg-white/80 backdrop-blur-sm"
    //       }
    //     >
    //       <CardHeader className={"flex items-center justify-between"}>
    //         <CardTitle className={"text-xl font-bold text-gray-800"}>
    //           Workspace ID
    //         </CardTitle>
    //         <Button
    //           variant={"outline"}
    //           size={"sm"}
    //           className={"gap-2"}
    //           onClick={copyToClipboard}
    //         >
    //           <ClipboardCopy className="w-4 h-4" />
    //           Copy
    //         </Button>
    //       </CardHeader>
    //       <CardContent className={"text-gray-600 break-all"}>{id}</CardContent>
    //     </Card>
    //     <Card
    //       className={
    //         "shadow-lg border border-gray-200 bg-white/80 backdrop-blur-sm"
    //       }
    //     >
    //       <CardHeader>
    //         <CardTitle className={"text-lg font-semibold text-gray-800"}>
    //           Create a new Board
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="flex gap-2">
    //           <Input
    //             placeholder="Board Name"
    //             value={boardName}
    //             onChange={(e) => setBoardName(e.target.value)}
    //           />
    //           <Button onClick={handleCreateBoard}>Create</Button>
    //         </div>
    //       </CardContent>
    //     </Card>
    //     <Card
    //       className={
    //         "shadow-lg border border-gray-200 bg-white/80 backdrop-blur-sm"
    //       }
    //     >
    //       <CardHeader>
    //         <CardTitle className={"text-lg font-semibold text-gray-800"}>
    //           Your Boards
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         {boards?.length > 0 ? (
    //           <ul className="space-y-2">
    //             {boards.map((board) => (
    //               <li
    //                 key={board._id}
    //                 className="text-blue-600 hover:underline cursor-pointer "
    //                 onClick={() => navigate(`/board/${board._id}`)}
    //               >
    //                 {board.name}
    //               </li>
    //             ))}
    //           </ul>
    //         ) : (
    //           <p className="text-sm text-gray-500">Mo Boards yet.</p>
    //         )}
    //       </CardContent>
    //     </Card>
    //     <div className="text-center">
    //       <Button
    //         variant={"secondary"}
    //         onClick={() => navigate(`/workspace/settings/${id}`)}
    //         >
    //         <Settings/>
    //         Go To Workspace Settings
    //       </Button>
    //     </div>
    //   </div>
    // </div>
  );
}
