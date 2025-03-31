
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUpcomingGames, getFinishedGames, sports, leagues } from "@/data/mockData";
import { Game as GameType, League, Sport } from "@/types";
import { CalendarDays, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Games = () => {
  const [sportFilter, setSportFilter] = useState<string | null>(null);
  const [leagueFilter, setLeagueFilter] = useState<string | null>(null);
  
  const upcomingGames = getUpcomingGames();
  const finishedGames = getFinishedGames();
  
  const filteredUpcomingGames = filterGames(upcomingGames);
  const filteredFinishedGames = filterGames(finishedGames);
  
  function filterGames(games: GameType[]): GameType[] {
    return games.filter(game => {
      const matchesSport = !sportFilter || game.sport.id === sportFilter;
      const matchesLeague = !leagueFilter || game.league.id === leagueFilter;
      return matchesSport && matchesLeague;
    });
  }
  
  const resetFilters = () => {
    setSportFilter(null);
    setLeagueFilter(null);
  };

  const GameCard = ({ game }: { game: GameType }) => (
    <Card key={game.id} className="sport-card">
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
              {game.status === 'finished' && (
                <div className="text-lg font-bold">{game.homeScore}</div>
              )}
            </div>
          </div>
          
          <div className="px-4">
            {game.status === 'upcoming' ? (
              <span className="text-xs font-semibold bg-secondary px-3 py-1 rounded-full">
                VS
              </span>
            ) : (
              <span className="text-xs font-semibold">-</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-medium">{game.awayTeam.name}</div>
              {game.status === 'finished' && (
                <div className="text-lg font-bold">{game.awayScore}</div>
              )}
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
        
        {game.status === 'finished' ? (
          <Button variant="outline" className="w-full mt-4">
            View Reviews
          </Button>
        ) : (
          <Button variant="outline" className="w-full mt-4">
            Add to Watchlist
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Games</h1>
        
        <div className="flex items-center gap-4">
          {(sportFilter || leagueFilter) && (
            <Button variant="ghost" onClick={resetFilters}>
              Clear Filters
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Games</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">Sports</DropdownMenuLabel>
                {sports.map((sport) => (
                  <DropdownMenuItem 
                    key={sport.id}
                    className={sportFilter === sport.id ? "bg-secondary" : ""}
                    onClick={() => setSportFilter(sport.id)}
                  >
                    {sport.icon} {sport.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">Leagues</DropdownMenuLabel>
                {leagues.map((league) => (
                  <DropdownMenuItem 
                    key={league.id}
                    className={leagueFilter === league.id ? "bg-secondary" : ""}
                    onClick={() => setLeagueFilter(league.id)}
                  >
                    {league.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Games</TabsTrigger>
          <TabsTrigger value="finished">Finished Games</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {filteredUpcomingGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpcomingGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No upcoming games found</h3>
              <p className="text-muted-foreground">
                {sportFilter || leagueFilter 
                  ? "Try changing or clearing your filters" 
                  : "Check back later for upcoming games"}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="finished">
          {filteredFinishedGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFinishedGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No finished games found</h3>
              <p className="text-muted-foreground">
                {sportFilter || leagueFilter 
                  ? "Try changing or clearing your filters" 
                  : "Games will appear here once they're completed"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Games;
