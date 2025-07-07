import {
  BoardChart,
  DashboardChart,
  UpcomingChart,
} from "@/components/dashboardChart";
import { DashboardTasks } from "@/components/DashboardTasks";
import { DashboardTeam } from "@/components/DashboardTeam";
import { RecentProjects } from "@/components/RecentProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const userId = localStorage.getItem("userId");
  const [summary, setSummary] = useState({});
  const [upcoming, setUpcoming] = useState([]);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://teamsync-backend-5s2n.onrender.com/api/dashboard/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API response", res.data);
        setSummary(res.data.summary);
        setUpcoming(res.data.upcoming);
        setBoards(res.data.boards);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchData();
  }, [userId]);
  console.log("boards", boards);
  console.log("summary", summary);
  console.log("upcoming", upcoming);

  if (!summary) {
    return <div className="p-6 text-gray-600">Loading dashboard...</div>;
  }
  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-4">
      <div className="flex flex-col w-full mt-4 gap-6">
        <Tabs defaultValue="boards" className={"w-full"}>
          <TabsList className={"grid grid-cols-3 gap-2 mb-4"}>
            <TabsTrigger value="boards">Board Activity</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          <TabsContent value="boards">
            <BoardChart tasks={upcoming} />
          </TabsContent>
          <TabsContent value="summary">
            <DashboardChart summary={summary} />
          </TabsContent>
          <TabsContent value="upcoming">
            <UpcomingChart upcoming={upcoming} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-col w-full mt-6 gap-6">
        <Tabs defaultValue="workspace" className={"w-full"}>
          <TabsList className={"grid grid-cols-3 mb-4 gap-2"}>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>{" "}
          </TabsList>
          <TabsContent value="overview" className={"space-y-6"}></TabsContent>
          <TabsContent value="workspace">
            <RecentProjects />
          </TabsContent>
          <TabsContent value="tasks">
            <DashboardTasks />
          </TabsContent>
          <TabsContent value="team" className={"space-y-6"}>
            <DashboardTeam />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
