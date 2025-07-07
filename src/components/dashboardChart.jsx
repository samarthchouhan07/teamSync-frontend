import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";

export const DashboardChart = ({ summary }) => {
  const chartData = [
    { browser: "total", visitors: summary.total, fill: "#8884d8" },
    {
      browser: "completed",
      visitors: summary.done,
      fill: "#7e7fc2",
    },
    {
      browser: "inprogress",
      visitors: summary.inProgress,
      fill: "#897da8",
    },
    {
      browser: "overdue",
      visitors: summary.overdue,
      fill: "#625780",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    total: {
      label: "Total",
      color: "#625780",
    },
    completed: {
      label: "Completed",
      color: "#897da8",
    },
    inprogress: {
      label: "In Progress",
      color: "#7e7fc2",
    },
    overdue: {
      label: "Overdue",
      color: "#8884d8",
    },
  };

  return (
    <>
      <Card className={"py-0"}>
        <CardHeader className={"px-6 pt-4 pb-2"}>
          <CardTitle>Task Overview</CardTitle>
          <CardDescription>Visual summary of task status</CardDescription>
        </CardHeader>
        <CardContent className={"px-2 sm:p-6"}>
          <ChartContainer
            config={chartConfig}
            className={"mx-auto aspect-square max-h-[250px]"}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                outerRadius={90}
                stroke="0"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm mb-3">
          {/* <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
          <div className="text-muted-foreground leading-none">
            Showing summary of task status of previous months and years
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export const UpcomingChart = ({ upcoming }) => {
  const [activeKey, setActiveKey] = useState("inProgress");

  const groupedData = useMemo(() => {
    const grouped = {};

    upcoming.forEach((task) => {
      const due = new Date(task.dueDate);
      const key = due.toISOString().split("T")[0];
      if (!grouped[key]) grouped[key] = 0;
      if (
        (activeKey === "inProgress" && task.status === "In Progress") ||
        (activeKey === "completed" && task.isCompleted)
      ) {
        grouped[key]++;
      }
    });

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [upcoming, activeKey]);

  return (
    <Card className={"py-0"}>
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Upcoming tasks</CardTitle>
          <CardDescription>
            Grouped by due Date (
            {activeKey === "inProgress" ? "In Progress" : "Completed"})
          </CardDescription>
        </div>
        <div className="flex">
          {[
            { key: "inProgress", label: "In Progress" },
            { key: "completed", label: "Completed" },
          ].map(({ key, label }) => (
            <button
              key={key}
              data-active={activeKey === key}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveKey(key)}
            >
              <span className="text-muted-foreground text-xs">{label}</span>
              <span className="text-lg font-bold sm:text-2xl">
                {
                  upcoming.filter((task) =>
                    key === "inProgress"
                      ? task.status === "In Progress"
                      : task.isCompleted
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className={"px-2 sm:p-6"}>
        <ChartContainer
          config={{
            count: { label: "Task Count", color: "#0f08a8" },
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer>
            <BarChart data={groupedData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="count"
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                }
              />
              <Bar dataKey="count" fill="#1008bf" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent> 
      <CardFooter className="flex-col gap-2 text-sm mb-3">
        {/* <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="text-muted-foreground leading-none ">
          Showing total tasks which are about to come in the future
        </div>
      </CardFooter>
    </Card>
  );
};

export function BoardChart({ tasks }) {
  const [range, setRange] = useState("90d")

  const boardData = useMemo(() => {
    const data = {};

    tasks.forEach((task) => {
      const created = new Date(task.createdAt)
      const key = created.toISOString().split("T")[0]
      if (!data[key]) {
        data[key] = { date: key, todo: 0, inProgress: 0, completed: 0 }
      } 
      if (task.isCompleted) data[key].completed++
      else if (task.status === "In Progress") data[key].inProgress++
      else data[key].todo++
    }) 

    return Object.values(data).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [tasks]) 

  const filteredData = useMemo(() => {
    const now = new Date("2025-07-06")
    const days = range === "30d" ? 30 : range === "7d" ? 7 : 90
    const start = new Date(now)
    start.setDate(now.getDate() - days)
    return boardData.filter((d) => new Date(d.date) >= start)
  }, [boardData, range])

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Board Activity</CardTitle>
          <CardDescription>Tasks created over time by status</CardDescription>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{
            todo: { label: "To Do", color: "#6b7280" },
            inProgress: { label: "In Progress", color: "#6366f1" },
            completed: { label: "Completed", color: "#10b981" },
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer>
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillTodo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                }
              />
              <Area
                dataKey="todo"
                type="monotone"
                fill="url(#fillTodo)"
                stroke="#6b7280"
                stackId="a"
              />
              <Area
                dataKey="inProgress"
                type="monotone"
                fill="url(#fillProgress)"
                stroke="#6366f1"
                stackId="a"
              />
              <Area
                dataKey="completed"
                type="monotone"
                fill="url(#fillDone)"
                stroke="#10b981"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}