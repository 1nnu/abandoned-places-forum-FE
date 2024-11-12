import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { MessageCircle, SendIcon } from "lucide-react";
import { FormControl, FormMessage, FormItem, FormField } from "../../ui/form";
import { z } from "zod";
import { useForm, SubmitHandler, FieldValues, FormProvider } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Input } from "../../ui/input";
import Comment from "./Comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const CommentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

interface CommentsDialogProps {
  postId: number
}

interface CommentProps {
  createdByUsername: string;
  body: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function CommentsDialog({postId} : CommentsDialogProps) {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [showComments, setShowComments] = useState(false);
  const { userId } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm({
    resolver: zodResolver(CommentSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  // Reference to the dummy div at the end of the comments list
  const endOfCommentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when comments update
    if (endOfCommentsRef.current) {
      endOfCommentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/feed/${postId}/comments`);
        
        if (response.ok) {
          const commentsData = await response.json();
          setComments(commentsData);
        } else {
          setError('Failed to load comments');
        }
      } catch (error) {
        setError('Error fetching comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    console.log(comments)
  }, [postId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleAddComment: SubmitHandler<FieldValues> = async (data) => {
    if (data.comment) {
      const newComment = data.comment;
      try {
        // Make a POST request to add the comment
        const response = await fetch(`${apiUrl}/api/feed/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-ID": userId,
          },
          body: JSON.stringify({
          comment: newComment,
          postId: postId,
          userId: userId 
        }),
        });

        if (response.ok) {
          const commentData = await response.json();
          console.log(commentData)
          setComments((prevComments) => [...prevComments, commentData.body]);
        } else {
          console.error("Failed to add comment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
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
            <AlertDialogDescription>
              <div className="flex flex-col gap-y-2 h-[40vh] overflow-y-scroll">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <Comment name={comment.createdByUsername} comment={comment.body} key={index} />
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
