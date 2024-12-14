"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { searchMedia, getMediaDetails } from "@/lib/tmdb";
import { TMDBResult, MediaDetails } from "@/types/tmdb";
import MediaTile from "@/components/media-tile";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBResult[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaDetails[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load media from local storage on component mount
  useEffect(() => {
    const storedMedia = localStorage.getItem("trackedMedia");
    if (storedMedia) {
      try {
        const parsedMedia = JSON.parse(storedMedia);
        setSelectedMedia(parsedMedia);
      } catch (error) {
        console.error("Error parsing stored media", error);
      }
    }
  }, []);

  // Update local storage whenever selectedMedia changes
  useEffect(() => {
    localStorage.setItem("trackedMedia", JSON.stringify(selectedMedia));
  }, [selectedMedia]);

  const handleSearch = async () => {
    const results = await searchMedia(query);
    setSearchResults(results.slice(0, 6)); // Only show the first 6 results
    setIsDrawerOpen(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const addMediaToTracker = async (result: TMDBResult) => {
    const details = await getMediaDetails(result.id, result.media_type);

    if (details) {
      // Prevent duplicates
      if (!selectedMedia.some((media) => media.id === details.id)) {
        const updatedMedia = [...selectedMedia, details];
        updatedMedia.sort((a, b) => {
          const dateA =
            a.media_type === "tv" ? a.next_episode_date : a.release_date;
          const dateB =
            b.media_type === "tv" ? b.next_episode_date : b.release_date;
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
        setSelectedMedia(updatedMedia);
      }
    }
    setIsDrawerOpen(false);
  };

  const removeMedia = (id: number) => {
    setSelectedMedia(selectedMedia.filter((media) => media.id !== id));
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Media Tracker</h1>

      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search for a movie or TV show"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="mr-2"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Search Results</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          <div className="grid grid-cols-3 gap-4 p-4">
            {searchResults.map((result) => {
              const isAlreadyAdded = selectedMedia.some(
                (media) => media.id === result.id
              );
              return (
                <div key={result.id} className="border p-2">
                  {result.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                      alt={result.title || result.name}
                      className="w-full h-48 object-cover mb-2"
                    />
                  )}
                  <p className="font-bold">{result.title || result.name}</p>
                  <p className="text-sm text-gray-500">
                    {result.media_type === "movie"
                      ? `Release Date: ${result.release_date}`
                      : `First Air Date: ${result.first_air_date}`}
                  </p>
                  {isAlreadyAdded ? (
                    <Button variant="outline" disabled>
                      Already Added
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => addMediaToTracker(result)}
                    >
                      Add to Tracker
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>

      <div className="grid grid-cols-3 gap-4">
        {selectedMedia.map((media) => (
          <MediaTile
            key={media.id}
            media={media}
            onRemove={() => removeMedia(media.id)}
          />
        ))}
      </div>
    </main>
  );
}
