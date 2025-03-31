
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRecentReviews, users } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays, Edit, Star, User as UserIcon } from "lucide-react";

const Profile = () => {
  // For demo purposes, we'll use the first user
  const user = users[0];
  const userReviews = getRecentReviews().filter(review => review.user.id === user.id);
  
  return (
    <div className="container py-8">
      <Card className="mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-sport-blue to-sport-green"></div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24 border-4 border-background -mt-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                <UserIcon className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pt-0 md:pt-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
              
              <p className="mb-4">{user.bio}</p>
              
              <div className="flex flex-wrap gap-6">
                <div>
                  <span className="text-muted-foreground text-sm">Joined</span>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{user.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground text-sm">Reviews</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>{userReviews.length}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground text-sm">Following</span>
                  <p className="font-medium">{user.following}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground text-sm">Followers</span>
                  <p className="font-medium">{user.followers}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="favorites">Favorite Teams</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews">
          {userReviews.length > 0 ? (
            <div className="grid gap-6">
              {userReviews.map(review => (
                <Card key={review.id} className="sport-card">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(review.rating) ? 'fill-sport-blue' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.rating}/5</span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <img 
                              src={review.game.homeTeam.logo} 
                              alt={review.game.homeTeam.name} 
                              className="w-6 h-6 object-contain" 
                            />
                            <span className="font-medium">{review.game.homeTeam.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm">{review.game.homeScore}</span>
                            <span className="text-sm">-</span>
                            <span className="font-semibold text-sm">{review.game.awayScore}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img 
                              src={review.game.awayTeam.logo} 
                              alt={review.game.awayTeam.name} 
                              className="w-6 h-6 object-contain" 
                            />
                            <span className="font-medium">{review.game.awayTeam.name}</span>
                          </div>
                        </div>
                        
                        <p className="text-foreground mb-3">{review.content}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {review.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't written any reviews yet
              </p>
              <Button>
                Write Your First Review
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.favoriteTeams?.map(team => (
              <Card key={team.id} className="sport-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={team.logo} 
                      alt={team.name} 
                      className="w-16 h-16 object-contain" 
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{team.name}</h3>
                      <p className="text-muted-foreground">{team.sport.name} • {team.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-4xl font-bold text-sport-blue">{userReviews.length}</h3>
                <p className="text-muted-foreground">Total Reviews</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-4xl font-bold text-sport-blue">
                  {userReviews.length > 0 
                    ? (userReviews.reduce((acc, review) => acc + review.rating, 0) / userReviews.length).toFixed(1)
                    : "-"}
                </h3>
                <p className="text-muted-foreground">Average Rating</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-4xl font-bold text-sport-blue">{user.favoriteTeams?.length || 0}</h3>
                <p className="text-muted-foreground">Favorite Teams</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-4xl font-bold text-sport-blue">{user.favoriteSports?.length || 0}</h3>
                <p className="text-muted-foreground">Favorite Sports</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
