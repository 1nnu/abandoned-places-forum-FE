import ProfileCard from "./components/ProfileCard";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import emitter from "../../../emitter/eventEmitter";
import ChangeEmailForm from "./components/ChangeEmailForm";
import ChangePasswordForm from "./components/ChangePasswordForm";

interface UserProfile {
  username: string;
  email: string;
  points: number;
  role: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        emitter.emit("startLoading");
        const userToken = localStorage.getItem("userToken");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user profile");
      } finally {
        emitter.emit("stopLoading");
      }
    };

    fetchUserData();
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return;
  }

  return (
    <div className="flex justify-center w-full py-8">
      <div className="max-w-[1440px] flex flex-row w-full justify-center">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <ProfileCard
              username={userData.username}
              email={userData.email}
              points={userData.points}
              role={userData.role}
            />
          </TabsContent>
          <TabsContent value="email">
            <ChangeEmailForm />
          </TabsContent>
          <TabsContent value="password">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
