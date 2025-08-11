import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "rental", label: "Rental" },
  { id: "order", label: "Order" },
  { id: "products", label: "Products" },
  { id: "reporting", label: "Reporting" },
  { id: "setting", label: "Setting" }
];

export function TopNavigation({ 
  activeTab = "rental", 
  username = "John Smith",
  onTabChange 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-surface border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => onTabChange?.(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {username}
            </span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt={username} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-sm font-medium",
                    activeTab === tab.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onTabChange?.(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
