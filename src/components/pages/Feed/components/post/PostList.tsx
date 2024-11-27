import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import emitter from "../../../../../emitter/eventEmitter";

const apiUrl = import.meta.env.VITE_API_URL;

interface Post {
  id: number;
  title: string;
  body: string;
  locationId: string;
  createdByUsername: string;
  createdAt: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const handleIncrement = () => setRefresh((prev) => prev + 1);
    emitter.on("refreshPostList", handleIncrement);
    return () => {
      emitter.off("refreshPostList", handleIncrement);
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        emitter.emit("startLoading");
        const userToken = localStorage.getItem("userToken");

        const response = await fetch(`${apiUrl}/api/feed`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        data.sort((a: Post, b: Post) => b.id - a.id);

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        emitter.emit("stopLoading");
      }
    };

    fetchPosts();
  }, [refresh]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 w-full max-w-[800px]">
      <div className="flex flex-col gap-y-4">
        <CreatePost />
        {posts.map((post, key) => (
          <PostCard
            key={key}
            id={post.id}
            title={post.title}
            body={post.body}
            locationId={post.locationId}
            createdBy={post.createdByUsername}
            creatadAt={formatDate(post.createdAt)}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;
