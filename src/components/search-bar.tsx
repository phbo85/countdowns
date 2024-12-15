"use client";

import { useState } from "react";
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
import { TMDBResult } from "@/types/tmdb";
import { useMediaStore } from "@/stores/media-store";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react"; // Import the close icon

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBResult[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { selectedMedia, setSelectedMedia } = useMediaStore();

  const handleSearch = async () => {
    const results = await searchMedia(query);
    setSearchResults(results.slice(0, 10));
    setIsDrawerOpen(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const addMediaToTracker = async (result: TMDBResult) => {
    if (result.media_type === "person") return;
    const details = await getMediaDetails(result.id, result.media_type);

    if (details) {
      // Prevent duplicates
      if (!selectedMedia.some((media) => media.id === details.id)) {
        const updatedMedia = [...selectedMedia, details];
        updatedMedia.sort((a, b) => {
          const dateA =
            a.media_type === "tv"
              ? a.next_episode_date || a.release_date
              : a.release_date;
          const dateB =
            b.media_type === "tv"
              ? b.next_episode_date || b.release_date
              : b.release_date;
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
        setSelectedMedia(updatedMedia);
      }
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
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
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X className="h-8 w-8" />
            </Button>
          </DrawerHeader>
          <div className="flex flex-wrap gap-4 p-4 mb-4">
            {searchResults.map((result) => {
              const isAlreadyAdded = selectedMedia.some(
                (media) => media.id === result.id
              );
              return (
                <Card
                  key={result.id}
                  className="relative overflow-hidden w-[30%] lg:w-64 aspect-[2/3]"
                >
                  {result.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                      alt={result.title || result.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="relative z-10 p-2 bg-black bg-opacity-50 h-full flex flex-col gap-4">
                    <h2 className="text-sm md:text-lg lg:text-2xl font-bold text-white">
                      {result.title || result.name}
                    </h2>
                    <p className="text-xs text-gray-300">
                      {result.media_type === "movie"
                        ? `Release Date: ${result.release_date}`
                        : `First Air Date: ${result.first_air_date}`}
                    </p>
                    <div className="absolute bottom-2 left-2 right-2">
                      {isAlreadyAdded ? (
                        <Button variant="outline" disabled>
                          Already Added
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => addMediaToTracker(result)}
                          className="w-full"
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
            {searchResults.length === 0 && (
              <p className="text-center w-full">No results found</p>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
