import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskModal from "../components/taskModal";
import CommentModal from "@/components/CommentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Briefcase, Command, LayoutDashboard, Plus } from "lucide-react";

export default function BoardPage() {
  const { boardId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState("");
  const [newTasks, setNewTasks] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [members, setMembers] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `https://teamsync-backend-5s2n.onrender.com/api/boards/${boardId}/lists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLists(res.data);
    };
    fetchData();
  }, [boardId, token]);

  useEffect(() => {
    const fetchMembers = async () => {
      const workspaceId = localStorage.getItem("workspaceId");
      const res = await axios.get(
        `https://teamsync-backend-5s2n.onrender.com/api/workspace/${workspaceId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMembers(res.data);
    };

    fetchMembers();
  }, [token]);

  useEffect(() => {
    const fetchWorkspaceId = async () => {
      try {
        const res = await axios.get(
          `https://teamsync-backend-5s2n.onrender.com/api/board/${boardId}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const workspaceId = res.data.workspaceId;
        const membersRes = await axios.get(
          `https://teamsync-backend-5s2n.onrender.com/api/workspace/${workspaceId}/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMembers(membersRes.data);
      } catch (error) {
        console.log("Error fetching workspace members:", error);
      }
    };
    fetchWorkspaceId();
  }, [token, boardId]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceListIndex = lists.findIndex(
      (list) => list._id === source.droppableId
    );
    const destinationListIndex = lists.findIndex(
      (list) => list._id === destination.droppableId
    );

    const sourceTasks = [...lists[sourceListIndex].tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    const updatedLists = [...lists];
    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      updatedLists[sourceListIndex].tasks = sourceTasks;

      const reorderedTaskIds = sourceTasks.map((t) => t._id);

      await axios.patch(
        `https://teamsync-backend-5s2n.onrender.com/api/tasks/${draggableId}/move`,
        {
          toListId: destination.droppableId,
          position: destination.index,
          reorderedTaskIds,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      const destinationTasks = [...lists[destinationListIndex].tasks];
      destinationTasks.splice(destination.index, 0, movedTask);
      updatedLists[sourceListIndex].tasks = sourceTasks;
      updatedLists[destinationListIndex].tasks = destinationTasks;

      const reorderedTaskIds = destinationTasks.map((t) => t._id);

      await axios.patch(
        `https://teamsync-backend-5s2n.onrender.com/api/tasks/${draggableId}/move`,
        {
          toListId: destination.droppableId,
          position: destination.index,
          reorderedTaskIds,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    setLists(updatedLists);
  };

  const fetchLists = async () => {
    const res = await axios.get(
      `https://teamsync-backend-5s2n.onrender.com/api/boards/${boardId}/lists`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLists(res.data);
  };

  const handleAddList = async () => {
    const res = await axios.post(
      `https://teamsync-backend-5s2n.onrender.com/api/workspace/boards/${boardId}/lists`,
      { title: newList },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLists([...lists, { ...res.data, tasks: [] }]);
    setNewList("");
    fetchLists();
    toast.success("List added Successfully");
  };

  const handleAddTask = async (listId) => {
    const res = await axios.post(
      `https://teamsync-backend-5s2n.onrender.com/api/workspace/lists/${listId}/tasks`,
      { title: newTasks[listId] || "", description: "" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLists(
      lists.map((l) =>
        l._id === listId ? { ...l, tasks: [...l.tasks, res.data] } : l
      )
    );
    setNewTasks({ ...newTasks, [listId]: "" });
    toast.success("Task Added Successfully");
    fetchLists();
  };

  const handleDeleteTask = async (taskId, listId) => {
    await axios.delete(`https://teamsync-backend-5s2n.onrender.com/api/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setLists((prevLists) =>
      prevLists.map((l) =>
        l._id === listId
          ? { ...l, tasks: l.tasks.filter((t) => t._id !== taskId) }
          : l
      )
    );
    toast.success("Task deleted Successfully");
  };

  const handleDeleteList = async (listId) => {
    await axios.delete(`https://teamsync-backend-5s2n.onrender.com/api/lists/${listId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setLists(lists.filter((l) => l._id !== listId));
    toast.success("List deleted successfully");
  };

  const handleSaveTaskFromModal = async () => {
    const res = await axios.patch(
      `https://teamsync-backend-5s2n.onrender.com/api/tasks/${selectedTask._id}`,
      {
        title: selectedTask.title,
        description: selectedTask.description,
        dueDate: selectedTask.dueDate,
        assignedTo:
          selectedTask.assignedTo === "unassigned"
            ? null
            : selectedTask.assignedTo,
        isCompleted: !!selectedTask.isCompleted,
        status: selectedTask.status || "To Do",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setLists((prev) =>
      prev.map((list) =>
        list._id === selectedListId
          ? {
              ...list,
              tasks: list.tasks.map((t) =>
                t._id === selectedTask._id ? res.data : t
              ),
            }
          : list
      )
    );
    toast.success("Task updated successfully");

    fetchLists();
    setSelectedTask(null);
  };

  console.log("members:", members);
  console.log("boardId:", boardId);
  console.log("lists:", lists);

  return (
    <>
      <TaskModal
        task={selectedTask}
        setTaskData={setSelectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleSaveTaskFromModal}
        members={members}
        onDelete={handleDeleteTask}
        listId={selectedListId}
      />
      {showCommentModal && (
        <CommentModal
          boardId={boardId}
          onClose={() => setShowCommentModal(false)}
          token={token}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Briefcase />
                </div>
                <h1
                  className="text-xl font-bold text-gray-800 cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Team-Sync
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant={""}
                  onClick={() => setShowCommentModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2"
                >
                  <Command /> Board Comments
                </Button>
                <Button
                  className={
                    "px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600"
                  }
                  onClick={() => navigate("/dashboard")}
                >
                  <LayoutDashboard />
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DragDropContext
          onDragEnd={handleDragEnd}
          className="container mx-auto px-4 py-6"
        >
          <div className="flex space-x-6 overflow-x-auto pb-4 mt-5 ">
            {lists.map((list) => (
              <div
                key={list._id}
                className={`flex-shrink-0 w-80 rounded-xl p-4 border-2`}
              >
                <CardHeader className="flex justify-between items-center mb-4">
                  <CardTitle className={"text-gray-500 font-semibold "}>
                    {list.title}
                  </CardTitle>
                  <span className="text-sm text-gray-500">
                    {list.tasks.length}
                  </span>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => handleDeleteList(list._id)}
                  >
                    🗑️
                  </Button>
                </CardHeader>
                <CardContent className={"space-y-3"}>
                  <Droppable droppableId={list._id} isDropDisabled={false}>
                    {(provided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3"
                      >
                        {list.tasks.map((task, index) => {
                          console.log(
                            "assignedToUsername:",
                            task.assignedToUsername
                              ?.trim()
                              ?.split(" ")[0]
                              ?.charAt(0)
                              .toUpperCase()
                          );
                          return (
                            <>
                              <Draggable
                                key={task._id}
                                draggableId={task._id}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    key={task._id}
                                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
                                    onClick={() => {
                                      console.log(
                                        "Task clicked:",
                                        task,
                                        "List ID:",
                                        list._id
                                      );
                                      setSelectedTask(task);
                                      setSelectedListId(list._id);
                                    }}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className="font-medium text-gray-800 text-sm">
                                        {task.title}
                                      </h4>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          task.status === "Done"
                                            ? "bg-green-100 text-green-600"
                                            : task.status === "In Progress"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                      >
                                        {task.status}
                                      </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">
                                      {task.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
                                          {task.assignedToUsername
                                            ?.trim()
                                            ?.split(" ")[0]
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                        </div>
                                        <span>{task.assignedToUsername}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="flex items-center flex-nowrap">
                                          {new Date(
                                            task.dueDate
                                          ).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                )}
                              </Draggable>
                            </>
                          );
                        })}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                  <div className="mt-2">
                    <Input
                      placeholder="New task"
                      value={newTasks[list._id] || ""}
                      onChange={(e) =>
                        setNewTasks({
                          ...newTasks,
                          [list._id]: e.target.value,
                        })
                      }
                    />
                    <Button
                      onClick={() => handleAddTask(list._id)}
                      className={
                        "w-full px-4 mt-2 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600"
                      }
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Add Task
                    </Button>
                  </div>
                </CardContent>
              </div>
            ))}
            <div className="flex-shrink-0 w-80 h-">
              <Card
                className={
                  "w-full rounded-xl p-4 border-2 flex flex-col justify-between"
                }
              >
                <CardHeader className={"text-gray-500 font-semibold"}>
                  Create New List
                </CardHeader>
                <CardContent className={`flex flex-col gap-2`}>
                  <Input
                    value={newList}
                    onChange={(e) => setNewList(e.target.value)}
                    placeholder="New List Title"
                  />
                  <Button
                    onClick={handleAddList}
                    className={
                      "w-full px-4 mt-2 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600"
                    }
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Add List
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DragDropContext>
      </div>
    </>
  );
}
