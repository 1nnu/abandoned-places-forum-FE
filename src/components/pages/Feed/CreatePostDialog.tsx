// CreatePostDialog.tsx
import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '../../ui/alert-dialog';

interface CreatePostDialogProps {
    onCreate: (title: string, body: string) => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ onCreate }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleCreatePost = () => {
        onCreate(title, body);
        setTitle('');
        setBody('');
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Create Post</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create New Post</AlertDialogTitle>
                    <AlertDialogDescription>
                        Enter the title and content for your new post.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <textarea
                        placeholder="Body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <button onClick={handleCreatePost} className="px-4 py-2 bg-green-600 text-white rounded">
                            Submit
                        </button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CreatePostDialog;
