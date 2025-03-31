
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sports } from "@/data/mockData";
import { Game as GameType, League } from "@/types";
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
import { fetchFootballGames, fetchFootballLeagues, fetchBasketballGames, fetchBasketballLeagues } from "@/services/apiService";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Games = () => {
  const [activeTab, setActiveTab] = useState<string>("football");
  const [sportFilter, setSportFilter] = useState<string | null>(null);
  const [leagueFilter, setLeagueFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [seasonFilter, setSeasonFilter] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  
  const [upcomingGames, setUpcomingGames] = useState<GameType[]>([]);
  const [finishedGames, setFinishedGames] = useState<GameType[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  
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
        let upcomingParams: Record<string, string> = {};
        let finishedParams: Record<string, string> = {};
        
        if (activeTab === "football") {
          // Football parameters
          if (leagueFilter) {
            upcomingParams.league = leagueFilter;
            finishedParams.league = leagueFilter;
          }
          
          if (dateFilter) {
            upcomingParams.date = dateFilter;
            finishedParams.date = dateFilter;
          } else {
            // Default: next 7 days for upcoming
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            
            upcomingParams.from = format(tomorrow, 'yyyy-MM-dd');
            upcomingParams.to = format(nextWeek, 'yyyy-MM-dd');
            
            // Last 7 days for finished
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            finishedParams.from = format(lastWeek, 'yyyy-MM-dd');
            finishedParams.to = format(yesterday, 'yyyy-MM-dd');
          }
          
          const [upcomingData, finishedData] = await Promise.all([
            fetchFootballGames(upcomingParams),
            fetchFootballGames(finishedParams)
          ]);
          
          setUpcomingGames(upcomingData);
          setFinishedGames(finishedData);
        } else {
          // Basketball parameters
          if (leagueFilter) {
            upcomingParams.league = leagueFilter;
            finishedParams.league = leagueFilter;
          }
          
          if (seasonFilter) {
            upcomingParams.season = seasonFilter;
            finishedParams.season = seasonFilter;
          } else {
            // Current year as default season
            const currentYear = new Date().getFullYear();
            upcomingParams.season = currentYear.toString();
            finishedParams.season = currentYear.toString();
          }
          
          if (dateFilter) {
            upcomingParams.date = dateFilter;
            finishedParams.date = dateFilter;
          } else {
            // Default: next 7 days for upcoming
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            upcomingParams.date = format(tomorrow, 'yyyy-MM-dd');
            
            // Yesterday for finished
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            finishedParams.date = format(yesterday, 'yyyy-MM-dd');
          }
          
          const [upcomingData, finishedData] = await Promise.all([
            fetchBasketballGames(upcomingParams),
            fetchBasketballGames(finishedParams)
          ]);
          
          setUpcomingGames(upcomingData);
          setFinishedGames(finishedData);
        }
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGames();
  }, [activeTab, leagueFilter, dateFilter, seasonFilter, teamFilter]);
  
  const resetFilters = () => {
    setLeagueFilter(null);
    setDateFilter(null);
    setSeasonFilter(null);
    setTeamFilter(null);
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
          
          {(leagueFilter || dateFilter || seasonFilter || teamFilter) && (
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
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming Games</TabsTrigger>
            <TabsTrigger value="finished">Finished Games</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No upcoming games found</h3>
                <p className="text-muted-foreground">
                  {leagueFilter || dateFilter || seasonFilter || teamFilter 
                    ? "Try changing or clearing your filters" 
                    : "Check back later for upcoming games"}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="finished">
            {finishedGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {finishedGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No finished games found</h3>
                <p className="text-muted-foreground">
                  {leagueFilter || dateFilter || seasonFilter || teamFilter 
                    ? "Try changing or clearing your filters" 
                    : "Games will appear here once they're completed"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Games;
