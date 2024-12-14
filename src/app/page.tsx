"use client";

import SearchBar from "@/components/search-bar";
import MediaList from "@/components/media-list";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Media Tracker</h1>
      <SearchBar />
      <MediaList />
    </main>
  );
}
