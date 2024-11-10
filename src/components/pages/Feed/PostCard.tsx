// PostCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';

interface PostCardProps {
    title: string;
    body: string;
}

const PostCard: React.FC<PostCardProps> = ({ title, body }) => {
    return (
        <Card className="m-4 w-full max-w-md">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{body}</p>
            </CardContent>
        </Card>
    );
};

export default PostCard;
