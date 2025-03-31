
import { Game, League, Review, Sport, Team, User } from "@/types";

// Sports
export const sports: Sport[] = [
  { id: "1", name: "Football", icon: "⚽" },
  { id: "2", name: "Basketball", icon: "🏀" },
];

// Leagues
export const leagues: League[] = [
  { 
    id: "1", 
    name: "Premier League", 
    logo: "https://media.api-sports.io/football/leagues/39.png", 
    sport: sports[0],
    country: "England" 
  },
  { 
    id: "2", 
    name: "La Liga", 
    logo: "https://media.api-sports.io/football/leagues/140.png", 
    sport: sports[0],
    country: "Spain" 
  },
  { 
    id: "3", 
    name: "NBA", 
    logo: "https://media.api-sports.io/basketball/leagues/12.png", 
    sport: sports[1],
    country: "USA" 
  },
];

// Teams
export const teams: Team[] = [
  { 
    id: "1", 
    name: "Arsenal", 
    logo: "https://media.api-sports.io/football/teams/42.png",
    sport: sports[0],
    country: "England" 
  },
  { 
    id: "2", 
    name: "Chelsea", 
    logo: "https://media.api-sports.io/football/teams/49.png",
    sport: sports[0],
    country: "England" 
  },
  { 
    id: "3", 
    name: "Barcelona", 
    logo: "https://media.api-sports.io/football/teams/529.png",
    sport: sports[0],
    country: "Spain" 
  },
  { 
    id: "4", 
    name: "Real Madrid", 
    logo: "https://media.api-sports.io/football/teams/541.png",
    sport: sports[0],
    country: "Spain" 
  },
  { 
    id: "5", 
    name: "Los Angeles Lakers", 
    logo: "https://media.api-sports.io/basketball/teams/139.png",
    sport: sports[1],
    country: "USA" 
  },
  { 
    id: "6", 
    name: "Boston Celtics", 
    logo: "https://media.api-sports.io/basketball/teams/133.png",
    sport: sports[1],
    country: "USA" 
  },
];

// Mock users
export const users: User[] = [
  {
    id: "1",
    name: "João Silva",
    username: "joaosilva",
    email: "joao@example.com",
    bio: "Sports fanatic, especially football and NBA basketball",
    avatar: "https://i.pravatar.cc/150?img=1",
    favoriteTeams: [teams[0], teams[4]],
    favoriteSports: [sports[0], sports[1]],
    followers: 120,
    following: 84,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Maria Santos",
    username: "mariasantos",
    email: "maria@example.com",
    bio: "Love watching Premier League matches!",
    avatar: "https://i.pravatar.cc/150?img=5",
    favoriteTeams: [teams[1]],
    favoriteSports: [sports[0]],
    followers: 95,
    following: 102,
    createdAt: new Date("2023-03-20"),
  },
];

// Games
export const games: Game[] = [
  {
    id: "1",
    sport: sports[0],
    league: leagues[0],
    homeTeam: teams[0],
    awayTeam: teams[1],
    homeScore: 2,
    awayScore: 1,
    date: new Date("2023-11-15T15:00:00"),
    venue: "Emirates Stadium",
    status: "finished",
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "2",
    sport: sports[0],
    league: leagues[1],
    homeTeam: teams[2],
    awayTeam: teams[3],
    homeScore: 3,
    awayScore: 3,
    date: new Date("2023-11-18T20:00:00"),
    venue: "Camp Nou",
    status: "finished",
  },
  {
    id: "3",
    sport: sports[1],
    league: leagues[2],
    homeTeam: teams[4],
    awayTeam: teams[5],
    homeScore: 108,
    awayScore: 115,
    date: new Date("2023-11-20T18:30:00"),
    venue: "Crypto.com Arena",
    status: "finished",
  },
  {
    id: "4",
    sport: sports[0],
    league: leagues[0],
    homeTeam: teams[1],
    awayTeam: teams[0],
    date: new Date(Date.now() + 86400000 * 3), // 3 days in the future
    venue: "Stamford Bridge",
    status: "upcoming",
  },
  {
    id: "5",
    sport: sports[1],
    league: leagues[2],
    homeTeam: teams[5],
    awayTeam: teams[4],
    date: new Date(Date.now() + 86400000 * 5), // 5 days in the future
    venue: "TD Garden",
    status: "upcoming",
  },
];

// Reviews
export const reviews: Review[] = [
  {
    id: "1",
    user: users[0],
    game: games[0],
    rating: 4.5,
    content: "What a match! Arsenal played brilliantly in the first half. Chelsea made a good comeback attempt but it wasn't enough.",
    likes: 24,
    tags: ["thriller", "derby", "comeback"],
    createdAt: new Date("2023-11-15T18:30:00"),
    updatedAt: new Date("2023-11-15T18:30:00"),
  },
  {
    id: "2",
    user: users[1],
    game: games[0],
    rating: 3.5,
    content: "Decent match, but I've seen better derbies. The referee made some questionable calls.",
    likes: 8,
    tags: ["derby", "controversial"],
    createdAt: new Date("2023-11-15T19:15:00"),
    updatedAt: new Date("2023-11-15T19:15:00"),
  },
  {
    id: "3",
    user: users[0],
    game: games[2],
    rating: 5,
    content: "One of the best NBA games I've watched this season! Boston's defense in the fourth quarter was spectacular.",
    likes: 32,
    tags: ["classic", "defense", "clutch"],
    createdAt: new Date("2023-11-20T21:45:00"),
    updatedAt: new Date("2023-11-20T21:45:00"),
  },
];

// Function to get recent reviews
export const getRecentReviews = (): Review[] => {
  return [...reviews].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Function to get upcoming games
export const getUpcomingGames = (): Game[] => {
  return games.filter(game => game.status === 'upcoming')
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Function to get finished games
export const getFinishedGames = (): Game[] => {
  return games.filter(game => game.status === 'finished')
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Function to get popular tags
export const getPopularTags = (): {tag: string, count: number}[] => {
  const tags: {[key: string]: number} = {};
  
  reviews.forEach(review => {
    review.tags.forEach(tag => {
      if (!tags[tag]) tags[tag] = 0;
      tags[tag]++;
    });
  });
  
  return Object.entries(tags)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
};
