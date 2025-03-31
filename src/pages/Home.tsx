
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentReviews, getUpcomingGames, getPopularTags } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Star, CalendarDays, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const recentReviews = getRecentReviews().slice(0, 3);
  const upcomingGames = getUpcomingGames().slice(0, 3);
  const popularTags = getPopularTags().slice(0, 8);
  
  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="rounded-xl bg-gradient-to-r from-sport-blue to-sport-green p-8 text-white">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h1 className="text-4xl font-bold">Track, rate and share your sports watching experience</h1>
            <p className="text-white/90 text-lg">
              Join SportWatchers community to catalog the games you've watched, rate them, and discover what others are watching.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button variant="default" className="bg-white text-sport-blue hover:bg-white/90">
                Sign Up - It's Free
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reviews */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Recent Reviews</h2>
            <Link to="/reviews">
              <Button variant="ghost" className="flex items-center gap-1">
                See All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6">
            {recentReviews.map(review => (
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
                      
                      <p className="text-foreground mb-3 line-clamp-3">{review.content}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {review.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Games */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Games</h2>
            <div className="space-y-4">
              {upcomingGames.map(game => (
                <Card key={game.id} className="sport-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{game.league.name}</span>
                      <img 
                        src={game.league.logo} 
                        alt={game.league.name} 
                        className="h-5 object-contain" 
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={game.homeTeam.logo} 
                          alt={game.homeTeam.name} 
                          className="w-8 h-8 object-contain" 
                        />
                        <span className="font-medium">{game.homeTeam.name}</span>
                      </div>
                      <span className="text-xs font-semibold bg-secondary px-2 py-1 rounded">VS</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{game.awayTeam.name}</span>
                        <img 
                          src={game.awayTeam.logo} 
                          alt={game.awayTeam.name} 
                          className="w-8 h-8 object-contain" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-center mt-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>{game.date.toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{game.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/games">View All Games</Link>
            </Button>
          </section>
          
          {/* Popular Tags */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(({ tag, count }) => (
                <Button key={tag} variant="secondary" size="sm" className="rounded-full">
                  #{tag} <span className="ml-1 text-xs">({count})</span>
                </Button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
