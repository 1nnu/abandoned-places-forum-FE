import { useEffect } from "react";
import { Button } from "../../../../ui/button";
import { HandMetalIcon } from "lucide-react";
import emitter from "../../../../../emitter/eventEmitter";

const apiUrl = import.meta.env.VITE_API_URL;

interface UpvoteButtonProps {
  postId: number;
  userId: string;
  isUpvoted: boolean;
}

export default function UpvoteButton({ postId, userId, isUpvoted }: UpvoteButtonProps) {

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/feed/upvotes/byPost/${postId}`);
        if (!response.ok) throw new Error("Failed to fetch upvotes");

      } catch (error) {
        console.error("Error checking if liked:", error);
      }
    };

    checkIfLiked();
  }, [postId, userId]);

  const handleUpvote = async () => {
    try {
        const upvoteData = {
        postId,
        userId,
      };

      const response = await fetch(`${apiUrl}/api/feed/upvotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
         body: JSON.stringify(upvoteData),
      });

      if (!response.ok) throw new Error("Failed to toggle upvote");

    } catch (error) {
      console.error("Error posting upvote:", error);
    } finally {
        emitter.emit("refreshPostCard");
    }
  };

  return (
    <Button
      onClick={handleUpvote}
      className={`bg-blue-600 hover:bg-blue-700 ${isUpvoted ? "opacity-50" : ""}`}
    >
      {isUpvoted ? "Liked" : "Like"}
      <HandMetalIcon className="ml-2" />
    </Button>
  );
}
