
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  favoriteTeams?: Team[];
  favoriteSports?: Sport[];
  followers?: number;
  following?: number;
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  sport: Sport;
  country: string;
}

export interface Sport {
  id: string;
  name: string;
  icon?: string;
}

export interface League {
  id: string;
  name: string;
  logo: string;
  sport: Sport;
  country?: string;
}

export interface Game {
  id: string;
  sport: Sport;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  date: Date;
  venue?: string;
  status: 'upcoming' | 'live' | 'finished';
  highlights?: string;
}

export interface Review {
  id: string;
  user: User;
  game: Game;
  rating: number; // 0-5
  content: string;
  likes: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  user: User;
  review: Review;
  content: string;
  likes: number;
  createdAt: Date;
}

export interface Watchlist {
  id: string;
  user: User;
  games: Game[];
  createdAt: Date;
  updatedAt: Date;
}
