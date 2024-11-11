import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export default function ProfileCard() {
  return (
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
      <h2 className="text-2xl font-semibold text-slate-800">Martin Janov</h2>
    </div>
  );
}
