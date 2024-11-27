import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../ui/alert-dialog";
import { Button } from "../../../../ui/button";
import { MessageCircle, SendIcon } from "lucide-react";
import {
  FormControl,
  FormMessage,
  FormItem,
  FormField,
} from "../../../../ui/form";
import { z } from "zod";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FormProvider,
} from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Input } from "../../../../ui/input";
import Comment from "./Comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import emitter from "../../../../../emitter/eventEmitter";

const CommentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

interface CommentsDialogProps {
  postId: number;
}

interface CommentProps {
  createdByUsername: string;
  body: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function CommentsDialog({ postId }: CommentsDialogProps) {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [showComments, setShowComments] = useState(false);

  const methods = useForm({
    resolver: zodResolver(CommentSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const endOfCommentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfCommentsRef.current) {
      endOfCommentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const fetchComments = async () => {
    try {
      emitter.emit("startLoading");
      const userToken = localStorage.getItem("userToken");

      const response = await fetch(`${apiUrl}/api/feed/${postId}/comments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      emitter.emit("stopLoading");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment: SubmitHandler<FieldValues> = async (data) => {
    if (data.comment) {
      const newComment = data.comment;
      try {
        emitter.emit("startLoading");
        const userToken = localStorage.getItem("userToken");
        const userId = localStorage.getItem("userId");

        const response = await fetch(`${apiUrl}/api/feed/${postId}/comments`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: newComment,
            postId: postId,
            createdById: userId,
          }),
        });

        if (response.ok) {
          const commentData = await response.json();
          setComments((prevComments) => [...prevComments, commentData.body]);
          methods.reset({ comment: "" });
        } else {
          console.error("Failed to add comment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        emitter.emit("refreshPostCard");
        fetchComments();
        emitter.emit("stopLoading");
      }
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button
            onClick={() => setShowComments(!showComments)}
            className="border-blue-600 border text-blue-600 hover:border-blue-700 hover:text-blue-700"
            variant="outline"
          >
            Comment
            <MessageCircle />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[60vw]">
          <AlertDialogHeader>
            <div className="w-full flex justify-between">
              <AlertDialogTitle className="text-3xl">Comments</AlertDialogTitle>
              <AlertDialogCancel>
                <XIcon />
              </AlertDialogCancel>
            </div>
            <AlertDialogDescription className="bg-slate-100 p-2 rounded-lg border border-slate-300">
              <div className="flex flex-col gap-y-2 h-[40vh] overflow-y-scroll">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <Comment
                      name={comment.createdByUsername}
                      comment={comment.body}
                      key={index}
                    />
                  ))
                ) : (
                  <div className="p-2 text-slate-500 italic">No comments</div>
                )}
                <div ref={endOfCommentsRef} />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
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
                          autoComplete="off"
                        />
                      </FormControl>
                      {errors.comment && <FormMessage></FormMessage>}
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Submit
                  <SendIcon />
                </Button>
              </div>
            </form>
          </FormProvider>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
