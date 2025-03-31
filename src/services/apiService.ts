import { supabase } from "@/integrations/supabase/client";
import { Game, League, Sport, Team } from "@/types";
import { toast } from "sonner";

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

export const fetchFootballGames = async (params: Record<string, string>) => {
  try {
    console.log("Buscando jogos de futebol com parâmetros:", params);
    
    const { data, error } = await supabase.functions.invoke("football-api", {
      body: {
        sport: "football",
        endpoint: "fixtures",
        ...params
      }
    });

    if (error) {
      console.error("Erro na função do Supabase:", error);
      throw error;
    }
    
    // Verificar se a API retornou erros (ex. limite de taxa)
    if (!data.success) {
      console.warn("API retornou erros:", data.errors);
      
      if (data.errors && data.errors.requests) {
        toast.error("Limite de requisições da API Football atingido para dados de futebol.");
      } else {
        toast.error("Erro ao buscar dados de futebol.");
      }
      
      return [];
    }

    console.log("Resposta da API de futebol:", data);
    
    // Garantir que data.data.response existe e é um array
    if (!data.data || !data.data.response || !Array.isArray(data.data.response)) {
      console.warn("Resposta da API inválida:", data);
      return [];
    }

    return mapFootballFixturesToGames(data.data.response);
  } catch (error) {
    console.error("Erro ao buscar jogos de futebol:", error);
    toast.error("Falha ao carregar jogos de futebol.");
    return [];
  }
};

export const fetchBasketballGames = async (params: Record<string, string>) => {
  try {
    console.log("Buscando jogos de basquete com parâmetros:", params);
    
    const { data, error } = await supabase.functions.invoke("football-api", {
      body: {
        sport: "basketball",
        endpoint: "games",
        ...params
      }
    });

    if (error) {
      console.error("Erro na função do Supabase:", error);
      throw error;
    }
    
    // Verificar se a API retornou erros (ex. limite de taxa)
    if (!data.success) {
      console.warn("API retornou erros:", data.errors);
      
      if (data.errors && data.errors.requests) {
        toast.error("Limite de requisições da API Football atingido para dados de basquete.");
      } else {
        toast.error("Erro ao buscar dados de basquete.");
      }
      
      return [];
    }

    console.log("Resposta da API de basquete:", data);
    
    // Garantir que data.data.response existe e é um array
    if (!data.data || !data.data.response || !Array.isArray(data.data.response)) {
      console.warn("Resposta da API inválida:", data);
      return [];
    }

    return mapBasketballGamesToGames(data.data.response);
  } catch (error) {
    console.error("Erro ao buscar jogos de basquete:", error);
    toast.error("Falha ao carregar jogos de basquete.");
    return [];
  }
};

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
    
    // Check if the API returned errors (e.g., rate limit)
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.warn("API returned errors:", data.errors);
      
      if (data.errors.requests) {
        toast.error("API Football rate limit reached for football leagues.");
      }
      
      return [];
    }

    if (!data.response || !Array.isArray(data.response)) {
      return [];
    }

    return data.response.map((item: any) => ({
      id: String(item.league.id),
      name: item.league.name,
      logo: item.league.logo,
      sport: { id: "1", name: "Football", icon: "⚽" },
      country: item.country.name
    }));
  } catch (error) {
    console.error("Error fetching football leagues:", error);
    toast.error("Failed to load football leagues.");
    return [];
  }
};

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
    
    // Check if the API returned errors (e.g., rate limit)
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.warn("API returned errors:", data.errors);
      
      if (data.errors.requests) {
        toast.error("API Football rate limit reached for basketball leagues.");
      }
      
      return [];
    }

    if (!data.response || !Array.isArray(data.response)) {
      return [];
    }

    return data.response.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      logo: item.logo || "",
      sport: { id: "2", name: "Basketball", icon: "🏀" },
      country: item.country.name
    }));
  } catch (error) {
    console.error("Error fetching basketball leagues:", error);
    toast.error("Failed to load basketball leagues.");
    return [];
  }
};

const mapFootballFixturesToGames = (fixtures: FootballFixture[]): Game[] => {
  if (!fixtures || !Array.isArray(fixtures)) return [];
  
  return fixtures.map(fixture => {
    const sport: Sport = { id: "1", name: "Football", icon: "⚽" };
    
    const league: League = {
      id: String(fixture.league.id),
      name: fixture.league.name,
      logo: fixture.league.logo,
      sport,
      country: fixture.league.country
    };
    
    const homeTeam: Team = {
      id: String(fixture.teams.home.id),
      name: fixture.teams.home.name,
      logo: fixture.teams.home.logo,
      sport,
      country: fixture.league.country
    };
    
    const awayTeam: Team = {
      id: String(fixture.teams.away.id),
      name: fixture.teams.away.name,
      logo: fixture.teams.away.logo,
      sport,
      country: fixture.league.country
    };
    
    let status: 'upcoming' | 'live' | 'finished' = 'upcoming';
    if (fixture.fixture.status.short === 'FT' || fixture.fixture.status.short === 'AET' || 
        fixture.fixture.status.short === 'PEN') {
      status = 'finished';
    } else if (fixture.fixture.status.short === '1H' || fixture.fixture.status.short === '2H' || 
              fixture.fixture.status.short === 'HT') {
      status = 'live';
    }
    
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

const mapBasketballGamesToGames = (games: BasketballGame[]): Game[] => {
  if (!games || !Array.isArray(games)) {
    console.warn("Lista de jogos de basquete inválida:", games);
    return [];
  }
  
  console.log("Mapeando jogos de basquete:", games.length);
  
  return games.map(game => {
    const sport: Sport = { id: "2", name: "Basketball", icon: "🏀" };
    
    const league: League = {
      id: String(game.league.id),
      name: game.league.name,
      logo: game.league.logo || "",
      sport,
      country: game.country.name
    };
    
    const homeTeam: Team = {
      id: String(game.teams.home.id),
      name: game.teams.home.name,
      logo: game.teams.home.logo || "",
      sport,
      country: game.country.name
    };
    
    const awayTeam: Team = {
      id: String(game.teams.away.id),
      name: game.teams.away.name,
      logo: game.teams.away.logo || "",
      sport,
      country: game.country.name
    };
    
    let status: 'upcoming' | 'live' | 'finished' = 'upcoming';
    if (game.status.short === 'FT' || game.status.short === 'AOT') {
      status = 'finished';
    } else if (game.status.short === 'Q1' || game.status.short === 'Q2' || 
              game.status.short === 'Q3' || game.status.short === 'Q4' || 
              game.status.short === 'HT') {
      status = 'live';
    }
    
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
      venue: "",
      status
    };
  });
};
