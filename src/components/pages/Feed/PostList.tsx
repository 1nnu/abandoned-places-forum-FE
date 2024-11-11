import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";

const apiUrl = import.meta.env.VITE_API_URL;

interface Post {
  id: number;
  title: string;
  body: string;
  locationId: string;
  createdBy: string;
  creatadAt: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/feed`);
        const data = await response.json();
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
            locationId="2"
            createdBy={post.createdBy}
            creatadAt="7. nov"
          />
        ))}
        <PostCard
          id={1}
          title="Cool"
          body="Mina leidsin aged amahajaetud majakese"
          locationId="2"
          createdBy="Martin Janov"
          creatadAt="7. nov"
        />
        <PostCard
          id={1}
          title="Cool"
          body="Mina leidsin aged amahajaetud majakese"
          locationId="2"
          createdBy="Martin Janov"
          creatadAt="7. nov"
        />
        <PostCard
          id={1}
          title="Cool"
          body="Mina leidsin aged amahajaetud majakese"
          locationId="2"
          createdBy="Martin Janov"
          creatadAt="7. nov"
        />
        <PostCard
          id={1}
          title="Cool"
          body="Mina leidsin aged amahajaetud majakese"
          locationId="2"
          createdBy="Martin Janov"
          creatadAt="7. nov"
        />
        <PostCard
          id={1}
          title="Cool"
          body="Mina leidsin aged amahajaetud majakese"
          locationId="2"
          createdBy="Martin Janov"
          creatadAt="7. nov"
        />
      </div>
    </div>
  );
};

export default PostList;
