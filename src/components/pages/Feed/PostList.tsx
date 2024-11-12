import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/feed`);
        const data = await response.json();

        data.sort((a: Post, b: Post) => b.id - a.id);

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
      }
    };

    fetchPosts();
  }, []);

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
            creatadAt={post.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;
