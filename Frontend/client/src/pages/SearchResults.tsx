import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

// A basic Community type. You might want to expand this based on your actual data model.
interface Community {
  _id: string;
  name: string;
  description: string;
  domain: string;
  city: string;
  zone: string;
}

const searchCommunities = async (query: string): Promise<Community[]> => {
  const response = await fetch(
    `https://indian-community-beta.vercel.app//api/communities/search?q=${encodeURIComponent(
      query
    )}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch search results.");
  }
  return response.json();
};

export function SearchResults() {
  // FIX: Read search query directly from the window's URL
  const query = new URLSearchParams(window.location.search).get("q") || "";

  const {
    data: communities,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["communitiesSearch", query],
    queryFn: () => searchCommunities(query),
    enabled: !!query, // Only run the query if there is a search term
  });

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Search Query</AlertTitle>
          <AlertDescription>
            Please enter a search term in the hero section to find communities.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-lg">Loading results...</p>
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}

      {communities && communities.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Card key={community._id}>
              <CardHeader>
                <CardTitle>{community.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {community.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{community.domain}</Badge>
                  <Badge variant="outline">{community.city}</Badge>
                  <Badge variant="outline">{community.zone}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {communities && communities.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Results Found</AlertTitle>
          <AlertDescription>
            We couldn't find any communities matching your search. Try a
            different term.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
