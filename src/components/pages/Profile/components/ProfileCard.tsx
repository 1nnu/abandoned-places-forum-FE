import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../../../ui/avatar";
import { Separator } from "../../../ui/separator";
import PostList from "../../Feed/components/post/PostList";
import { useEffect, useState } from "react";
import emitter from "../../../../emitter/eventEmitter";

interface UserProfile {
  username: string;
  email: string;
  points: number;
  role: string;
}

export default function ProfileCard() {
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
    <Card className="">
      <CardHeader className="flex flex-col gap-y-4 justify-start items-start">
        <div className="flex gap-x-4 items-center">
          <Avatar className="rounded-full">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="w-28 rounded-full border-slate-300 border"
            />
            <AvatarFallback className="w-14 rounded-full border-slate-300 border">
              CN
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle>{userData.username}</CardTitle>
            <CardDescription>{userData.email}</CardDescription>
          </div>
        </div>
        <Separator />
        <div>
          <h2>Points: {userData.points}</h2>
          <h2>Role: {userData.role}</h2>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Separator />
        <PostList />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
