import PostList from "./PostList";
import SideMenu from "./SideMenu";

export default function FeedPage() {
  return (
    <div className="flex justify-center w-full">
      <div className="max-w-[1440px] flex flex-row w-full justify-center">
        <SideMenu />
        <PostList />
      </div>
    </div>
  );
}
