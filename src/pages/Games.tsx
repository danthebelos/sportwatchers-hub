
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CalendarDays, Clock } from "lucide-react";
import { fetchBasketballGames } from "@/services/apiService";
import { toast } from "sonner";
import { Game } from "@/types";

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        // Carregar jogos de basquete por padrão com parâmetros específicos para garantir resultados
        const basketballParams = {
          league: "12", // NBA
          season: "2023-2024",
        };
        
        const basketballGames = await fetchBasketballGames(basketballParams);
        
        if (basketballGames.length > 0) {
          setGames(basketballGames);
          console.log("Jogos de basquete carregados:", basketballGames.length);
        } else {
          // Se não encontrar jogos da NBA, tente outros jogos de basquete
          const otherBasketballGames = await fetchBasketballGames({ season: "2023" });
          setGames(otherBasketballGames);
          console.log("Outros jogos de basquete carregados:", otherBasketballGames.length);
          
          if (otherBasketballGames.length === 0) {
            toast.warning("Nenhum jogo de basquete encontrado. Verifique os parâmetros da API.");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar jogos:", error);
        toast.error("Falha ao carregar os jogos. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando jogos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Jogos</h1>
      
      {games.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="sport-card overflow-hidden">
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
                      src={game.homeTeam.logo || "/placeholder.svg"}
                      alt={game.homeTeam.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div className="text-left">
                      <div className="font-medium">{game.homeTeam.name}</div>
                      {game.homeScore !== null && (
                        <div className="text-xl font-bold">{game.homeScore}</div>
                      )}
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
                      {game.awayScore !== null && (
                        <div className="text-xl font-bold">{game.awayScore}</div>
                      )}
                    </div>
                    <img
                      src={game.awayTeam.logo || "/placeholder.svg"}
                      alt={game.awayTeam.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-center mt-3 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{new Date(game.date).toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>
                    {new Date(game.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {game.venue && (
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    <span>{game.venue}</span>
                  </div>
                )}

                <div className="mt-2 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    game.status === "live" 
                      ? "bg-red-500 text-white" 
                      : game.status === "finished" 
                      ? "bg-gray-500 text-white" 
                      : "bg-green-500 text-white"
                  }`}>
                    {game.status === "live" ? "Ao vivo" : game.status === "finished" ? "Encerrado" : "Em breve"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg">
          <h3 className="text-xl font-medium mb-2">Nenhum jogo encontrado</h3>
          <p className="text-muted-foreground mb-6">
            Não encontramos jogos para exibir no momento. Tente novamente mais tarde.
          </p>
        </div>
      )}
    </div>
  );
};

export default Games;
