
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUpcomingGames } from "@/data/mockData";
import { useState } from "react";
import { CalendarDays, Clock, X } from "lucide-react";
import { Game } from "@/types";

const Watchlist = () => {
  // For demo purposes, we'll use upcoming games as the watchlist
  const upcomingGames = getUpcomingGames();
  const [watchlist, setWatchlist] = useState<Game[]>(upcomingGames);
  
  const removeFromWatchlist = (gameId: string) => {
    setWatchlist(watchlist.filter(game => game.id !== gameId));
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        
        <Button variant="outline">
          Add Games
        </Button>
      </div>
      
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map(game => (
            <Card key={game.id} className="sport-card relative group">
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => removeFromWatchlist(game.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">{game.league.name}</span>
                  <img 
                    src={game.league.logo} 
                    alt={game.league.name} 
                    className="h-6 object-contain" 
                  />
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={game.homeTeam.logo} 
                      alt={game.homeTeam.name} 
                      className="w-10 h-10 object-contain" 
                    />
                    <div className="text-left">
                      <div className="font-medium">{game.homeTeam.name}</div>
                    </div>
                  </div>
                  
                  <div className="px-4">
                    <span className="text-xs font-semibold bg-secondary px-3 py-1 rounded-full">
                      VS
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium">{game.awayTeam.name}</div>
                    </div>
                    <img 
                      src={game.awayTeam.logo} 
                      alt={game.awayTeam.name} 
                      className="w-10 h-10 object-contain" 
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 justify-center mt-3 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{game.date.toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{game.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                {game.venue && (
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    <span>{game.venue}</span>
                  </div>
                )}
                
                <Button variant="default" className="w-full mt-4">
                  Set Reminder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg">
          <h3 className="text-xl font-medium mb-2">Your watchlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Add games to your watchlist to keep track of matches you want to watch
          </p>
          <Button>
            Browse Games
          </Button>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
