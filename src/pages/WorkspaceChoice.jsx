import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, LayoutDashboardIcon, Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkspaceChoice() {
  const navigate=useNavigate()
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5x mx-auto">
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className={"text-center pb-4"}>
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Create Workspace
          </CardTitle>
          <CardDescription className={"text-gray-600"}>
            Start fresh with your own project workspace
          </CardDescription>
        </CardHeader>
        <CardContent className={"pt-0"}>
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rouded-lg transition-all duration-200 flex items-center justify-center gap-2" onClick={()=>navigate("/workspace/create")}>
            Get Started
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
      <Card
        className={
          "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        }
      >
        <CardHeader className={"text-center pb-4"}>
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className={"text-xl font-semibold text-gray-800"}>
            Join Workspace
          </CardTitle>
          <CardDescription className={"text-gray-600"}>
            Collaborate with your team on existing projects
          </CardDescription>
        </CardHeader>
        <CardContent className={"pt-0"}>
          <Button
            className={
              "w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            }
            onClick={()=>navigate("/workspace/join")}
          >
            Join Now
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
      <Card
        className={
          "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-red-50 to-red-100 border-red-200"
        }
      >
        <CardHeader className={"text-center pb-4"}>
          <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
            <LayoutDashboardIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className={"text-xl font-semibold text-gray-800"}>
            Go To Dashboard
          </CardTitle>
          <CardDescription className={"text-gray-600"}>
            Collaborate with your team on existing projects
          </CardDescription>
        </CardHeader>
        <CardContent className={"pt-0"}>
          <Button
            className={
              "w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            }
            onClick={()=>navigate("/dashboard")}
          >
            Explore Dashboard 
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
