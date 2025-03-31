
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [selectedSport, setSelectedSport] = useState<string>("football");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Form for football searches
  const footballForm = useForm({
    defaultValues: {
      competition: "",
      date: undefined as Date | undefined,
      round: "",
    },
  });

  // Form for basketball searches
  const basketballForm = useForm({
    defaultValues: {
      season: "",
      team: "",
    },
  });

  // Mock football competitions
  const footballCompetitions = [
    { id: "cl", name: "UEFA Champions League" },
    { id: "pl", name: "Premier League" },
    { id: "laliga", name: "La Liga" },
    { id: "seriea", name: "Serie A" },
    { id: "bundesliga", name: "Bundesliga" },
    { id: "ligue1", name: "Ligue 1" },
  ];

  // Mock football rounds
  const footballRounds = [
    { id: "regular_1", name: "Matchday 1" },
    { id: "regular_2", name: "Matchday 2" },
    { id: "regular_3", name: "Matchday 3" },
    { id: "round_16", name: "Round of 16" },
    { id: "quarter", name: "Quarterfinals" },
    { id: "semi", name: "Semifinals" },
    { id: "final", name: "Final" },
  ];

  // Mock basketball seasons
  const basketballSeasons = [
    { id: "2023", name: "2023-2024" },
    { id: "2022", name: "2022-2023" },
    { id: "2021", name: "2021-2022" },
  ];

  // Mock basketball teams
  const basketballTeams = [
    { id: "lakers", name: "Los Angeles Lakers" },
    { id: "celtics", name: "Boston Celtics" },
    { id: "warriors", name: "Golden State Warriors" },
    { id: "bucks", name: "Milwaukee Bucks" },
    { id: "heat", name: "Miami Heat" },
    { id: "nuggets", name: "Denver Nuggets" },
  ];

  const handleFootballSearch = (data: any) => {
    console.log("Football search:", data);
    setIsLoading(true);
    // Here you would call the API Football endpoint
    // For now, just simulate a search with a timeout
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          competition: "UEFA Champions League",
          homeTeam: "Real Madrid",
          awayTeam: "Manchester City",
          date: "2023-04-10",
          time: "20:00",
          status: "Upcoming",
        },
        {
          id: 2,
          competition: "UEFA Champions League",
          homeTeam: "Bayern Munich",
          awayTeam: "PSG",
          date: "2023-04-11",
          time: "20:00",
          status: "Upcoming",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleBasketballSearch = (data: any) => {
    console.log("Basketball search:", data);
    setIsLoading(true);
    // Here you would call the API Basketball endpoint
    // For now, just simulate a search with a timeout
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          league: "NBA",
          homeTeam: "Los Angeles Lakers",
          awayTeam: "Boston Celtics",
          date: "2023-04-08",
          time: "19:30",
          status: "Upcoming",
        },
        {
          id: 2,
          league: "NBA",
          homeTeam: "Golden State Warriors",
          awayTeam: "Milwaukee Bucks",
          date: "2023-04-09",
          time: "20:00",
          status: "Upcoming",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Matches</h1>
      
      <Tabs 
        defaultValue="football" 
        onValueChange={(value) => setSelectedSport(value)}
        className="mb-8"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="football">Football</TabsTrigger>
          <TabsTrigger value="basketball">Basketball</TabsTrigger>
        </TabsList>
        
        <TabsContent value="football" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Football Match Search</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...footballForm}>
                <form 
                  onSubmit={footballForm.handleSubmit(handleFootballSearch)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={footballForm.control}
                      name="competition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Competition</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select competition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {footballCompetitions.map((competition) => (
                                <SelectItem 
                                  key={competition.id} 
                                  value={competition.id}
                                >
                                  {competition.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={footballForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={footballForm.control}
                      name="round"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Round/Phase</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select round" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {footballRounds.map((round) => (
                                <SelectItem 
                                  key={round.id} 
                                  value={round.id}
                                >
                                  {round.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search Matches
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="basketball" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basketball Match Search</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...basketballForm}>
                <form 
                  onSubmit={basketballForm.handleSubmit(handleBasketballSearch)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={basketballForm.control}
                      name="season"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Season</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select season" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {basketballSeasons.map((season) => (
                                <SelectItem 
                                  key={season.id} 
                                  value={season.id}
                                >
                                  {season.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={basketballForm.control}
                      name="team"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select team" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {basketballTeams.map((team) => (
                                <SelectItem 
                                  key={team.id} 
                                  value={team.id}
                                >
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search Matches
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((game) => (
              <Card key={game.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      {game.competition || game.league}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="text-left">
                      <div className="font-medium">{game.homeTeam}</div>
                    </div>
                    
                    <div className="px-4">
                      <span className="text-xs font-semibold bg-secondary px-3 py-1 rounded-full">
                        VS
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{game.awayTeam}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 justify-center mt-3 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{game.date}</span>
                    <span className="ml-2">{game.time}</span>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Search;
