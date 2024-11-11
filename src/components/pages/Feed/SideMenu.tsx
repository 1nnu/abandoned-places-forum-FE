import { Button } from "../../ui/button";
import CreatePostDialog from "./CreatePostDialog";
import ProfileCard from "./ProfileCard";

interface SideMenuProps {
  className?: string;
}

export default function SideMenu({ className }: SideMenuProps) {
  return (
    <aside
      className={`w-1/4 max-w-xs p-4 bg-slate-50 border-r border-slate-300 min-w-[200px] ${className}`}
    >
      <nav className="mt-2 space-y-2">
        <div className="mb-4">
          <ProfileCard />
        </div>
        <CreatePostDialog />
        <Button className="w-full bg-slate-50 hover:bg-slate-100 border border-blue-600 text-blue-600">
          Posts
        </Button>
        <Button className="w-full bg-slate-50 hover:bg-slate-100 border border-blue-600 text-blue-600">
          Users
        </Button>
        <Button className="w-full bg-slate-50 hover:bg-slate-100 border border-blue-600 text-blue-600">
          Locations
        </Button>
        <Button className="w-full bg-slate-50 hover:bg-slate-100 border border-blue-600 text-blue-600">
          Map
        </Button>
      </nav>
    </aside>
  );
}
