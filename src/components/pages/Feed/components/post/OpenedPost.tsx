import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { FormControl, FormItem, FormField } from "../../../../ui/form";
import { Input } from "../../../../ui/input";
import { SendIcon } from "lucide-react";

import { z } from "zod";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FormProvider,
} from "react-hook-form";
import Comment from "../comment/Comment";
import { zodResolver } from "@hookform/resolvers/zod";
import emitter from "../../../../../emitter/eventEmitter";

const apiUrl = import.meta.env.VITE_API_URL;

const CommentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

interface FetchPostsDto {
  id: number;
  title: string;
  body: string;
  locationId: string;
  createdByUsername: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  hasUpvoted: boolean;
}

export default function OpenedPost() {
  const { postId } = useParams<{ postId: string }>();
  const [comments, setComments] = useState<string[]>([]);
  const [post, setPost] = useState<FetchPostsDto>();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(CommentSchema),
  });

  const { control, handleSubmit } = methods;

  const endOfCommentsRef = useRef<HTMLDivElement>(null);

  const handleAddComment: SubmitHandler<FieldValues> = (data) => {
    if (data.comment) {
      // Mock adding a comment
      setComments((prevComments) => [...prevComments, data.comment]);
    }
  };

  const fetchPostById = async (postId: string): Promise<void> => {
    try {
      emitter.emit("startLoading");

      const userToken = localStorage.getItem("userToken");

      if (!userToken) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(`${apiUrl}/api/feed/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Post not found");
        }
        throw new Error("Failed to fetch post");
      }

      const data: FetchPostsDto = await response.json();
      setPost(data);
    } catch (error: any) {
      console.log(error);
    } finally {
      emitter.emit("stopLoading");
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostById(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (endOfCommentsRef.current) {
      endOfCommentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  return (
    post && (
      <div className="flex justify-center">
        <div className="max-w-[800px] w-full py-8 gap-y-2 flex flex-col">
          <Card className="w-full">
            <CardHeader>
              <h2 className="text-2xl font-semibold mb-2">
                {post.title || "Post"}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {post.body || "Loading..."}
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end w-full gap-x-2">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </div>
            </CardFooter>
          </Card>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleAddComment)}>
                <div className="flex gap-x-2">
                  <FormField
                    control={control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="Write your comment"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit
                    <SendIcon />
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
          <div className="flex flex-col gap-y-2 h-[40vh] overflow-y-scroll">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Comment name={"User"} comment={comment} key={index} />
              ))
            ) : (
              <div className="p-2 text-slate-500 italic">No comments</div>
            )}
            <div ref={endOfCommentsRef} />
          </div>
        </div>
      </div>
    )
  );
}
