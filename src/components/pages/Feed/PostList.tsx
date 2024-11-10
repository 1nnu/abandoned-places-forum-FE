import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import CreatePostDialog from './CreatePostDialog';

const apiUrl = import.meta.env.VITE_API_URL;

interface Post {
    id: number;
    title: string;
    body: string;
}

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/feed`);
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleCreatePost = async (title: string, body: string) => {
        try {
            const response = await fetch(`${apiUrl}/api/feed/createPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, body }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const newPost = await response.json();
            setPosts([...posts, newPost]);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="p-4">
            <CreatePostDialog onCreate={handleCreatePost} />
            <div className="mt-4 space-y-4">
                {posts.map((post, key) => (
                    <div key={key} className="border p-4 rounded shadow-sm bg-white">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <p className="text-gray-700">{post.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;
