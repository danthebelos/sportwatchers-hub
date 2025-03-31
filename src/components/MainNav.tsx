
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, User, Star, Clock, CalendarDays, Home } from "lucide-react";

const MainNav = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
    // Will implement search functionality later
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        isActive(to)
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-4 md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <NavLink to="/" icon={<Home className="h-5 w-5" />} label="Home" />
                <NavLink to="/games" icon={<CalendarDays className="h-5 w-5" />} label="Games" />
                <NavLink to="/reviews" icon={<Star className="h-5 w-5" />} label="Reviews" />
                <NavLink to="/watchlist" icon={<Clock className="h-5 w-5" />} label="Watchlist" />
                <NavLink to="/search" icon={<Search className="h-5 w-5" />} label="Search" />
                <NavLink to="/profile" icon={<User className="h-5 w-5" />} label="Profile" />
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-sport-blue to-sport-green">
                SportWatchers
              </div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <NavLink to="/" icon={<Home className="h-4 w-4" />} label="Home" />
            <NavLink to="/games" icon={<CalendarDays className="h-4 w-4" />} label="Games" />
            <NavLink to="/reviews" icon={<Star className="h-4 w-4" />} label="Reviews" />
            <NavLink to="/watchlist" icon={<Clock className="h-4 w-4" />} label="Watchlist" />
            <NavLink to="/search" icon={<Search className="h-4 w-4" />} label="Search" />
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Input
              type="search"
              placeholder="Search games..."
              className="w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MainNav;
