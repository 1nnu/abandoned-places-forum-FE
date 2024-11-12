import { Card, CardHeader, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { HandMetalIcon } from "lucide-react";
import CommentsDialog from "./CommentsDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface PostCardProps {
  id: number;
  title: string;
  body: string;
  locationId: string;
  createdBy: string;
  creatadAt: string;
  images?: string[];
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
            {creatadAt}
            {locationId}
            {id}
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
            <p className="text-sm text-slate-600 font-normal">Likes: 2</p>
            <p className="text-sm text-slate-600 font-normal">Comments: 3</p>
          </div>
          <div className="flex gap-x-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Like
              <HandMetalIcon />
            </Button>
            <CommentsDialog postId={id}/>
          </div>
        </div>
      </Card>
    </div>
  );
}
