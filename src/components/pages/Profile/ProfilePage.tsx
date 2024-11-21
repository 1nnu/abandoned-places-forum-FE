import { useAuth } from "../../../contexts/AuthContext";
import ProfileCard from "./components/ProfileCard";
import { useState, useEffect } from "react";

interface UserProfile {
  username: string;
  email: string;
  points: number;
  role: string;
}

export default function ProfilePage() {
  const { userId } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user profile");
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
        <ProfileCard
          username={userData.username}
          email={userData.email}
          points={userData.points}
          role={userData.role}
        />
      </div>
    </div>
  );
}
