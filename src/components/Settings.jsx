import {  useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  Shield,
  Palette,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateProfile = async ({ userId, profileData, token }) => {
  const { data } = await axios.put(
    `http://localhost:5000/api/auth/profile/${userId}`,
    profileData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

const changePassword = async ({ userId, passwordData, token }) => {
  const { currentPassword, newPassword } = passwordData;
  const { data } = await axios.put(
    `http://localhost:5000/api/auth/password/${userId}`,
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/${userId}`);
        const data = await res.json();
        setProfileData({
          username: data.username,
          email: data.email,
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const updateMutation = useMutation({
    mutationFn: ({ userId, profileData, token }) =>
      updateProfile({ userId, profileData, token }),
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries(["userId", userId]);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update profile");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: ({ userId, passwordData, token }) =>
      changePassword({ userId, passwordData, token }),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Password update failed");
    },
  });

  const handleSave = async () => {
    updateMutation.mutate({ userId, profileData, token });
  };

  const handleChangePassword = async () => {
    const { newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    passwordMutation.mutate({ userId, passwordData, token });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 bg-white border-b px-6 py-4 shadow-sm flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xl font-semibold"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-8 px-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 gap-2 w-full mb-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    className={"mt-2"}
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    className={"mt-2"}
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </div>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Change your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Password</Label>
                  <Input
                    className={"mt-2"}
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="********"
                    className={"mt-2"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="********"
                    className={"mt-2"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-sm"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 mr-1" />
                    ) : (
                      <Eye className="w-4 h-4 mr-1" />
                    )}
                    {showPassword ? "Hide" : "Show"} Password
                  </Button>
                  <Button
                    disabled={passwordMutation.isPending}
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
