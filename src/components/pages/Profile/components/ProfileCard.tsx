import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../../../ui/avatar";

interface ProfileCardProps {
  username: string;
  email: string;
  points: number;
  role: string;
}

export default function ProfileCard({
  username,
  email,
  points,
  role,
}: ProfileCardProps) {
  return (
    <Card className="w-full max-w-[800px]">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex gap-x-4 items-center">
          <Avatar className="rounded-full">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="w-28 rounded-full border-slate-300 border"
            />
            <AvatarFallback className="w-14 rounded-full border-slate-300 border">
              CN
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle>{username}</CardTitle>
            <CardDescription>{email}</CardDescription>
          </div>
        </div>
        <div>
          <h2>Points: {points}</h2>
          <h2>Role: {role}</h2>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4"></CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
