
import { supabase } from "@/integrations/supabase/client";
import { Game, League, Sport, Team } from "@/types";

export type FootballFixture = {
  fixture: {
    id: number;
    date: string;
    venue: {
      name: string;
      city: string;
    };
    status: {
      short: string;
    };
  };
  league: {
    id: number;
    name: string;
    logo: string;
    round: string;
    country: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
};

export type BasketballGame = {
  id: number;
  date: string;
  time: string;
  status: {
    short: string;
  };
  country: {
    name: string;
  };
  league: {
    id: number;
    name: string;
    logo: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  scores: {
    home: {
      total: number | null;
    };
    away: {
      total: number | null;
    };
  };
};

// Function to fetch football games
export const fetchFootballGames = async (params: Record<string, string>) => {
  try {
    const { data, error } = await supabase.functions.invoke("football-api", {
      body: {
        sport: "football",
        endpoint: "fixtures",
        ...params
      }
    });

    if (error) throw error;

    return mapFootballFixturesToGames(data.response);
  } catch (error) {
    console.error("Error fetching football games:", error);
    throw error;
  }
};

// Function to fetch basketball games
export const fetchBasketballGames = async (params: Record<string, string>) => {
  try {
    const { data, error } = await supabase.functions.invoke("football-api", {
      body: {
        sport: "basketball",
        endpoint: "games",
        ...params
      }
    });

    if (error) throw error;

    return mapBasketballGamesToGames(data.response);
  } catch (error) {
    console.error("Error fetching basketball games:", error);
    throw error;
  }
};

// Function to fetch football leagues
export const fetchFootballLeagues = async (country?: string) => {
  try {
    const params: Record<string, string> = {};
    if (country) params.country = country;

    const { data, error } = await supabase.functions.invoke("football-api", {
      body: {
        sport: "football",
        endpoint: "leagues",
        ...params
      }
    });

    if (error) throw error;

    return data.response.map((item: any) => ({
      id: String(item.league.id),
      name: item.league.name,
      logo: item.league.logo,
      sport: { id: "1", name: "Football", icon: "⚽" },
      country: item.country.name
    }));
  } catch (error) {
    console.error("Error fetching football leagues:", error);
    throw error;
  }
};

// Function to fetch basketball leagues
export const fetchBasketballLeagues = async (country?: string) => {
  try {
    const params: Record<string, string> = {};
    if (country) params.country = country;

    const { data, error } = await supabase.functions.invoke("football-api", {
      body: {
        sport: "basketball",
        endpoint: "leagues",
        ...params
      }
    });

    if (error) throw error;

    return data.response.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      logo: item.logo || "",
      sport: { id: "2", name: "Basketball", icon: "🏀" },
      country: item.country.name
    }));
  } catch (error) {
    console.error("Error fetching basketball leagues:", error);
    throw error;
  }
};

// Helper function to map football fixtures to our Game type
const mapFootballFixturesToGames = (fixtures: FootballFixture[]): Game[] => {
  return fixtures.map(fixture => {
    // Define the sport
    const sport: Sport = { id: "1", name: "Football", icon: "⚽" };
    
    // Map the league
    const league: League = {
      id: String(fixture.league.id),
      name: fixture.league.name,
      logo: fixture.league.logo,
      sport,
      country: fixture.league.country
    };
    
    // Map the teams
    const homeTeam: Team = {
      id: String(fixture.teams.home.id),
      name: fixture.teams.home.name,
      logo: fixture.teams.home.logo,
      sport,
      country: fixture.league.country // Using league country as a fallback
    };
    
    const awayTeam: Team = {
      id: String(fixture.teams.away.id),
      name: fixture.teams.away.name,
      logo: fixture.teams.away.logo,
      sport,
      country: fixture.league.country // Using league country as a fallback
    };
    
    // Map the game status
    let status: 'upcoming' | 'live' | 'finished' = 'upcoming';
    if (fixture.fixture.status.short === 'FT' || fixture.fixture.status.short === 'AET' || 
        fixture.fixture.status.short === 'PEN') {
      status = 'finished';
    } else if (fixture.fixture.status.short === '1H' || fixture.fixture.status.short === '2H' || 
              fixture.fixture.status.short === 'HT') {
      status = 'live';
    }
    
    // Create and return the Game object
    return {
      id: String(fixture.fixture.id),
      sport,
      league,
      homeTeam,
      awayTeam,
      homeScore: fixture.goals.home,
      awayScore: fixture.goals.away,
      date: new Date(fixture.fixture.date),
      venue: fixture.fixture.venue.name,
      status
    };
  });
};

// Helper function to map basketball games to our Game type
const mapBasketballGamesToGames = (games: BasketballGame[]): Game[] => {
  return games.map(game => {
    // Define the sport
    const sport: Sport = { id: "2", name: "Basketball", icon: "🏀" };
    
    // Map the league
    const league: League = {
      id: String(game.league.id),
      name: game.league.name,
      logo: game.league.logo,
      sport,
      country: game.country.name
    };
    
    // Map the teams
    const homeTeam: Team = {
      id: String(game.teams.home.id),
      name: game.teams.home.name,
      logo: game.teams.home.logo,
      sport,
      country: game.country.name
    };
    
    const awayTeam: Team = {
      id: String(game.teams.away.id),
      name: game.teams.away.name,
      logo: game.teams.away.logo,
      sport,
      country: game.country.name
    };
    
    // Map the game status
    let status: 'upcoming' | 'live' | 'finished' = 'upcoming';
    if (game.status.short === 'FT' || game.status.short === 'AOT') {
      status = 'finished';
    } else if (game.status.short === 'Q1' || game.status.short === 'Q2' || 
              game.status.short === 'Q3' || game.status.short === 'Q4' || 
              game.status.short === 'HT') {
      status = 'live';
    }
    
    // Create and return the Game object
    const gameDate = new Date(`${game.date} ${game.time}`);
    
    return {
      id: String(game.id),
      sport,
      league,
      homeTeam,
      awayTeam,
      homeScore: game.scores.home.total,
      awayScore: game.scores.away.total,
      date: gameDate,
      venue: "", // API does not provide venue for basketball games
      status
    };
  });
};
