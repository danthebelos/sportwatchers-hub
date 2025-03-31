
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getRecentReviews, getPopularTags } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { Search, Star, ThumbsUp } from "lucide-react";
import { Review as ReviewType } from "@/types";

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const reviews = getRecentReviews();
  const popularTags = getPopularTags().slice(0, 12);
  
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchQuery === "" || 
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.game.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.game.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || review.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const ReviewCard = ({ review }: { review: ReviewType }) => (
    <Card key={review.id} className="sport-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img 
            src={review.user.avatar} 
            alt={review.user.name} 
            className="w-12 h-12 rounded-full object-cover" 
          />
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="font-semibold">{review.user.name}</h3>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(review.rating) ? 'fill-sport-blue' : 'text-muted-foreground'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{review.rating}/5</span>
            </div>
            
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <img 
                  src={review.game.homeTeam.logo} 
                  alt={review.game.homeTeam.name} 
                  className="w-6 h-6 object-contain" 
                />
                <span className="font-medium">{review.game.homeTeam.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm">{review.game.homeScore}</span>
                <span className="text-sm">-</span>
                <span className="font-semibold text-sm">{review.game.awayScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <img 
                  src={review.game.awayTeam.logo} 
                  alt={review.game.awayTeam.name} 
                  className="w-6 h-6 object-contain" 
                />
                <span className="font-medium">{review.game.awayTeam.name}</span>
              </div>
            </div>
            
            <p className="text-foreground mb-3">{review.content}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {review.tags.map(tag => (
                <Button 
                  key={tag} 
                  variant="secondary" 
                  size="sm" 
                  className={`rounded-full px-3 py-1 h-auto text-xs ${selectedTag === tag ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  #{tag}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <Button variant="ghost" size="sm" className="gap-1 h-auto">
                <ThumbsUp className="h-4 w-4" />
                <span>{review.likes}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Reviews</h1>
            
            <div className="w-full md:w-auto relative">
              <Input
                type="search"
                placeholder="Search reviews..."
                className="w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {selectedTag && (
            <div className="mb-6 flex items-center gap-2">
              <span>Filtered by:</span>
              <Button 
                variant="secondary" 
                size="sm" 
                className="rounded-full gap-1"
                onClick={() => setSelectedTag(null)}
              >
                #{selectedTag} ✕
              </Button>
            </div>
          )}
          
          {filteredReviews.length > 0 ? (
            <div className="space-y-6">
              {filteredReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedTag 
                  ? "Try adjusting your search or filter criteria" 
                  : "Be the first to write a review!"}
              </p>
            </div>
          )}
        </div>
        
        <div className="lg:w-1/4">
          <div className="sticky top-20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(({ tag, count }) => (
                  <Button 
                    key={tag} 
                    variant="secondary" 
                    size="sm" 
                    className={`rounded-full ${selectedTag === tag ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    #{tag} <span className="ml-1 text-xs">({count})</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Share your thoughts on a game you've watched recently.
                  </p>
                  <Button className="w-full">
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
