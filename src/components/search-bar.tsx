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
import { X } from "lucide-react";
import SearchResultCard from "./search-result-card";

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

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
  };

  const addMediaToTracker = async (result: TMDBResult) => {
    if (result.media_type === "person") return;
    const details = await getMediaDetails(result.id, result.media_type);

    if (details) {
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
      <div className="flex mb-4 border-4 shadow p-3">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for a movie or TV show"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyUp={handleKeyPress}
            className="mr-2 border-4 h-10 w-full"
          />
          {query && (
            <button
              className="absolute top-1/2 transform -translate-y-1/2 right-3"
              onClick={clearSearch}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button size="lg" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="lg:text-4xl">Search Results</DrawerTitle>
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 p-4 mb-4">
            {searchResults.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                isAlreadyAdded={selectedMedia.some(
                  (media) => media.id === result.id
                )}
                addMediaToTracker={addMediaToTracker}
              />
            ))}
            {searchResults.length === 0 && (
              <p className="text-center w-full">No results found</p>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
