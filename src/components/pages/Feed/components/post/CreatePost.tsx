import { useEffect, useState } from "react";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Textarea } from "../../../../ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "../../../../ui/card";
import { CircleArrowDown } from "lucide-react";
import emitter from "../../../../../emitter/eventEmitter";
import { MapLocation } from "../../../Map/Components/utils";
import SelectLocation from "./SelectLocation";
import LocationService from "../../../../../service/LocationService";

const apiUrl = import.meta.env.VITE_API_URL;

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [locationsDisplayedOnMap, setLocationsDisplayedOnMap] = useState<
    MapLocation[]
  >([]);
  const [globalSelectedLocation, setGlobalSelectedLocation] =
    useState<MapLocation | null>(null);

  console.log(globalSelectedLocation);

  const handleCreatePost = async (title: string, body: string) => {
    try {
      emitter.emit("startLoading");
      const userToken = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");

      if (!userId || !title || !body || !globalSelectedLocation?.id) {
        return;
      }

      const response = await fetch(`${apiUrl}/api/feed/createPost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title,
          body,
          locationId: globalSelectedLocation.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      setTitle("");
      setBody("");
      setGlobalSelectedLocation(null);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      emitter.emit("refreshPostList");
      emitter.emit("stopLoading");
      setGlobalSelectedLocation(null);
    }
  };

  useEffect(() => {
    LocationService.fetchAllAvailableLocations().then(
      (locations: MapLocation[] | null) => {
        if (locations) {
          const publicLocations = locations.filter(
            (location) => location.isPublic
          );
          setLocationsDisplayedOnMap(publicLocations);
        }
      }
    );
  }, []);

  return (
    <Card className="">
      <CardHeader className="flex flex-col gap-y-2">
        <h2 className="text-3xl font-semibold">Create New Post</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter the title and content for your new post.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Write your post here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="h-[500px] w-full rounded-md overflow-hidden border border-slate-300 mt-2">
          <SelectLocation
            locationsDisplayedOnMap={locationsDisplayedOnMap}
            setGlobalSelectedLocation={setGlobalSelectedLocation}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end w-full gap-x-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleCreatePost(title, body)}
          >
            Add post
            <CircleArrowDown />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
