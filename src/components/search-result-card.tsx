import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TMDBResult } from "@/types/tmdb";

interface SearchResultCardProps {
  result: TMDBResult;
  isAlreadyAdded: boolean;
  addMediaToTracker: (result: TMDBResult) => void;
}

export default function SearchResultCard({
  result,
  isAlreadyAdded,
  addMediaToTracker,
}: SearchResultCardProps) {
  return (
    <Card className="relative w-full aspect-[2/3] cursor-pointer">
      <CardContent
        className="h-full flex justify-center items-center bg-cover p-0"
        style={{
          backgroundImage: result.poster_path
            ? `url(https://image.tmdb.org/t/p/w500${result.poster_path})`
            : undefined,
        }}
      >
        <div className="flex flex-col items-center justify-center backdrop-filter backdrop-blur-sm text-white bg-black/30 p-2 gap-8 w-full h-full">
          <h2 className="text-sm md:text-lg lg:text-2xl font-bold ">
            {result.title || result.name}
          </h2>
          <p className="text-xs ">
            {result.media_type === "movie"
              ? `Release Date: ${result.release_date}`
              : `First Air Date: ${result.first_air_date}`}
          </p>
          <div className="absolute bottom-2 left-2 right-2">
            {isAlreadyAdded ? (
              <Button variant="outline" className="w-full" disabled>
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
      </CardContent>
    </Card>
  );
}
