import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkspaceChoice from "./WorkspaceChoice";
import {
  Bell,
  Briefcase,
  Home,
  LogOut,
  Settings,
  Sparkles,
  Users,
  WorkflowIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data, isLoading, error } = useQuery({
    queryKey: ["workspaceCount"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/workspace/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const {
    data: taskCount,
    isLoading: isTaskLoding,
    error: taskCountError,
  } = useQuery({
    queryKey: ["taskCount"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/tasks/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const {
    data: memberCountData,
    isLoading: isLoadingMemberCount,
    error: memberCountError,
  } = useQuery({
    queryKey: ["memberCount"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/workspace/members/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateString = currentTime.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading || isLoadingMemberCount || isTaskLoding) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error)
    return <p className="text-sm text-red-500">Error: {error.message}</p>;
  if (memberCountError)
    return (
      <p className="text-sm text-red-500">Error: {memberCountError.message}</p>
    );
  if (taskCountError)
    return (
      <p className="text-sm text-red-500">Error: {taskCountError.message}</p>
    );
  if (!localStorage.getItem("token") || !localStorage.getItem("userId")) {
    navigate("/register");
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="bg-white/80 backdrop-blue-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Briefcase />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Team-Sync</h1>
                  <p className="text-xs text-gray-500">Project Management</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-black">{timeString}</p>
                  <p className="text-xs text-gray-500">{dateString}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className={
                      "p-2 hover:bg-gray-100 hover:scale-110 transition-all duration-300"
                    }
                  >
                    <Bell className="w-4 h-4 text-black" />
                  </Button>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className={
                      "p-2 hover:bg-gray-100 hover:scale-110 transition-all duration-300"
                    }
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="w-4 h-4 text-black" />
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant={"putline"}
                    size={"sm"}
                    className={
                      "p-2 hover:scale-110 transition-all duration-300 flex text-black items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    }
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-500 shadow-yellow-400 " />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back!
              </h1>
            </div>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Ready to manage your projects? Choose how you'd like to get
              started with your workspace.
            </p>
          </div>
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Choose Your Workspace
              </h2>
              <p className="text-white ">
                Select an option to begin your project management journey{" "}
              </p>
            </div>
            <WorkspaceChoice />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card
              className={
                "bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              }
            >
              <CardContent className={"p-6 text-center"}>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {data.count}
                </h3>
                <p className="text-gray-600">Active Workspaces</p>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {memberCountData.count}
                </h3>
                <p className="text-gray-600">Team Members</p>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <WorkflowIcon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {taskCount.count}
                </h3>
                <p className="text-gray-600">Total Tasks</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Team-Sync</h3>
                    <p className="text-sm text-gray-300">Project Management</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  Streamline your project management with Team-Sync. Create
                  workspaces, collaborate with teams, and achieve your goals
                  efficiently.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Community
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Create Workspace
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Join Workspace
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      My Projects
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Team Members
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Feature Request
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Bug Report
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">
                  © 2024 Team-Sync. All rights reserved.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-gray-400 text-sm">
                  Made with ❤️ for better project management
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">
                    All systems operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

const SkeletonCard = () => {
  return (
    <Card
      className={
        "bg-white/30 backdrop-blur-sm border-0 shadow-md animate-pulse"
      }
    >
      <CardContent className={"p-6 text-center space-y-4"}>
        <Skeleton className="w-12 h-12 rounded-full mx-auto" />
        <Skeleton className="h-6 w-16 mx-auto" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </CardContent>
    </Card>
  );
};
