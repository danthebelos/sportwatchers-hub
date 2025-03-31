
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Game as GameType } from "@/types";
import { CalendarDays, Clock, Filter, Loader2 } from "lucide-react";
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
import { fetchFootballGames, fetchBasketballGames, fetchFootballLeagues, fetchBasketballLeagues } from "@/services/apiService";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Games = () => {
  const [activeTab, setActiveTab] = useState<string>("basketball"); // Default to basketball since football API limit is exhausted
  const [leagueFilter, setLeagueFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [seasonFilter, setSeasonFilter] = useState<string | null>("2023"); // Set default season
  
  const [games, setGames] = useState<GameType[]>([]);
  const [leagues, setLeagues] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch leagues when tab changes
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        if (activeTab === "football") {
          const footballLeagues = await fetchFootballLeagues();
          setLeagues(footballLeagues);
        } else {
          const basketballLeagues = await fetchBasketballLeagues();
          setLeagues(basketballLeagues);
        }
      } catch (err) {
        console.error("Error fetching leagues:", err);
        setError("Failed to load leagues. Please try again.");
      }
    };
    
    fetchLeagues();
    resetFilters();
  }, [activeTab]);
  
  // Fetch games based on filters
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let params: Record<string, string> = {};
        
        if (activeTab === "football") {
          // Football parameters
          if (leagueFilter) {
            params.league = leagueFilter;
          }
          
          if (dateFilter) {
            params.date = dateFilter;
          } else {
            // Default: today's date
            params.date = format(new Date(), 'yyyy-MM-dd');
          }
          
          const footballGames = await fetchFootballGames(params);
          setGames(footballGames);
          
          if (footballGames.length === 0) {
            toast.info("No football games found. This might be due to API rate limits.");
          }
        } else {
          // Basketball parameters
          if (leagueFilter) {
            params.league = leagueFilter;
          }
          
          if (seasonFilter) {
            params.season = seasonFilter;
          } else {
            // Current year as default season
            const currentYear = new Date().getFullYear();
            params.season = currentYear.toString();
          }
          
          if (dateFilter) {
            params.date = dateFilter;
          } else {
            // Default: today's date
            params.date = format(new Date(), 'yyyy-MM-dd');
          }
          
          const basketballGames = await fetchBasketballGames(params);
          setGames(basketballGames);
          
          if (basketballGames.length === 0) {
            toast.info("Try changing the season or date to find basketball games.");
          }
        }
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGames();
  }, [activeTab, leagueFilter, dateFilter, seasonFilter]);
  
  const resetFilters = () => {
    setLeagueFilter(null);
    setDateFilter(null);
    if (activeTab === "basketball") {
      setSeasonFilter("2023"); // Reset to default season for basketball
    } else {
      setSeasonFilter(null);
    }
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
              {game.status !== 'upcoming' && (
                <div className="text-lg font-bold">{game.homeScore ?? '-'}</div>
              )}
            </div>
          </div>
          
          <div className="px-4">
            {game.status === 'upcoming' ? (
              <span className="text-xs font-semibold bg-secondary px-3 py-1 rounded-full">
                VS
              </span>
            ) : game.status === 'live' ? (
              <span className="text-xs font-semibold bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                LIVE
              </span>
            ) : (
              <span className="text-xs font-semibold">-</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-medium">{game.awayTeam.name}</div>
              {game.status !== 'upcoming' && (
                <div className="text-lg font-bold">{game.awayScore ?? '-'}</div>
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
          <span>{format(game.date, 'dd MMM yyyy')}</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{format(game.date, 'HH:mm')}</span>
        </div>
        
        {game.venue && (
          <div className="mt-2 text-center text-sm text-muted-foreground">
            <span>{game.venue}</span>
          </div>
        )}
        
        {game.status === 'finished' ? (
          <Link to={`/reviews?gameId=${game.id}`}>
            <Button variant="outline" className="w-full mt-4">
              View Reviews
            </Button>
          </Link>
        ) : (
          <Link to={`/watchlist?gameId=${game.id}`}>
            <Button variant="outline" className="w-full mt-4">
              Add to Watchlist
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Games</h1>
        
        <div className="flex items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="football">Football ⚽</TabsTrigger>
              <TabsTrigger value="basketball">Basketball 🏀</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {(leagueFilter || dateFilter || seasonFilter) && (
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
              
              {activeTab === "football" ? (
                <>
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
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Date</DropdownMenuLabel>
                    <DropdownMenuItem 
                      className={dateFilter === format(new Date(), 'yyyy-MM-dd') ? "bg-secondary" : ""}
                      onClick={() => setDateFilter(format(new Date(), 'yyyy-MM-dd'))}
                    >
                      Today
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={dateFilter === format(new Date(Date.now() + 86400000), 'yyyy-MM-dd') ? "bg-secondary" : ""}
                      onClick={() => setDateFilter(format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'))}
                    >
                      Tomorrow
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={dateFilter === format(new Date(Date.now() - 86400000), 'yyyy-MM-dd') ? "bg-secondary" : ""}
                      onClick={() => setDateFilter(format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'))}
                    >
                      Yesterday
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              ) : (
                <>
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
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Season</DropdownMenuLabel>
                    {[2023, 2022, 2021, 2020].map((year) => (
                      <DropdownMenuItem 
                        key={year}
                        className={seasonFilter === year.toString() ? "bg-secondary" : ""}
                        onClick={() => setSeasonFilter(year.toString())}
                      >
                        {year}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Date</DropdownMenuLabel>
                    <DropdownMenuItem 
                      className={dateFilter === format(new Date(), 'yyyy-MM-dd') ? "bg-secondary" : ""}
                      onClick={() => setDateFilter(format(new Date(), 'yyyy-MM-dd'))}
                    >
                      Today
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={dateFilter === format(new Date(Date.now() + 86400000), 'yyyy-MM-dd') ? "bg-secondary" : ""}
                      onClick={() => setDateFilter(format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'))}
                    >
                      Tomorrow
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={dateFilter === format(new Date(Date.now() - 86400000), 'yyyy-MM-dd') ? "bg-secondary" : ""}
                      onClick={() => setDateFilter(format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'))}
                    >
                      Yesterday
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading games...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2 text-destructive">{error}</h3>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No games found</h3>
          <p className="text-muted-foreground mb-4">
            {activeTab === "football" 
              ? "You've reached your daily API limit for football data. Try basketball instead."
              : "Try changing your filters or season to find basketball games."}
          </p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      )}
    </div>
  );
};

export default Games;
