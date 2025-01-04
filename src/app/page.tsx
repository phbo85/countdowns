"use client";

import SearchBar from "@/components/search-bar";
import MediaList from "@/components/media-list";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-5xl font-bold mb-4 [text-shadow:_6px_6px_0_rgb(244_63_94)]">
        Countdown Tracker
      </h1>
      <SearchBar />
      <MediaList />
    </main>
  );
}
