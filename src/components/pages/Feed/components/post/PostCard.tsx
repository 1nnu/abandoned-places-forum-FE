import { Card, CardHeader, CardContent } from "../../../../ui/card";
import CommentsDialog from "../comment/CommentsDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import UpvoteButton from "../upvote/UpvoteButton";
import emitter from "../../../../../emitter/eventEmitter";
import AuthService from "../../../../../auth/AuthService";

const apiUrl = import.meta.env.VITE_API_URL;

interface PostCardProps {
  id: number;
  title: string;
  body: string;
  locationId: string;
  createdBy: string;
  creatadAt: string;
  images?: string[];
}

interface Upvote {
  id: number;
  postId: number;
  userId: string;
}

interface Comment {
  id: number;
  postId: number;
  userId: string;
  content: string;
}

export default function PostCard({
  id,
  title,
  body,
  locationId,
  createdBy,
  creatadAt,
  images = [],
}: PostCardProps) {
  const [upvotes, setUpvotes] = useState<Upvote[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const userId = localStorage.getItem("userId");

  if (!userId) {
    AuthService.logout();
  }

  useEffect(() => {
    const handleIncrement = () => setRefresh((prev) => prev + 1);
    emitter.on("refreshPostCard", handleIncrement);
    return () => {
      emitter.off("refreshPostCard", handleIncrement);
    };
  }, []);

  useEffect(() => {
    emitter.emit("startLoading");
    const fetchUpvotes = async () => {
      try {
        const userToken = localStorage.getItem("userToken");

        const response = await fetch(
          `${apiUrl}/api/feed/upvotes/byPost/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch upvotes");
        const data: Upvote[] = await response.json();
        const alreadyLiked = data.some(
          (upvote: any) => upvote.userId === userId
        );

        setIsUpvoted(alreadyLiked);
        setUpvotes(data);
      } catch (error) {
        console.error(error);
      } finally {
        emitter.emit("stopLoading");
      }
    };

    const fetchComments = async () => {
      try {
        const userToken = localStorage.getItem("userToken");

        const response = await fetch(`${apiUrl}/api/feed/${id}/comments`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch comments");

        const data: Comment[] = await response.json();

        setComments(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUpvotes();
    fetchComments();
    emitter.emit("stopLoading");
  }, [id, refresh]);

  if (!userId) {
    return;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Card className="py-4 px-6 w-full flex flex-col gap-y-8">
        <CardHeader className="p-0 flex flex-row justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <Avatar className="rounded-full">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="w-14 rounded-full border-slate-300 border"
              />
              <AvatarFallback className="w-14 rounded-full border-slate-300 border">
                CN
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-slate-800">
              {createdBy}
            </h2>
          </div>
          <div className="flex flex-col font-sm text-slate-600 gap-y-2">
            <p>{creatadAt}</p>
            <p>{locationId}</p>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-y-2">
          <h2 className="text-xl text-slate-800 font-semibold">{title}</h2>
          <p className="text-md text-slate-700 font-normal">{body}</p>

          {images.length > 0 && (
            <div className="my-4">
              <h3>Images</h3>
              <div className="flex space-x-4">
                {images.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Post Image ${index}`}
                    className="w-20 h-20 object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <div className="w-full flex justify-between gap-x-2 items-center">
          <div className="flex gap-x-4">
            <p className="text-sm text-slate-600 font-normal">
              {" "}
              Likes: {upvotes.length}
            </p>
            <p className="text-sm text-slate-600 font-normal">
              Comments: {comments.length}
            </p>
          </div>
          <div className="flex gap-x-2">
            <UpvoteButton postId={id} userId={userId} isUpvoted={isUpvoted} />
            <CommentsDialog postId={id} />
          </div>
        </div>
      </Card>
    </div>
  );
}
