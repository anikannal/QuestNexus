import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface HeaderProps {
  onToggleInventory: () => void;
}

export default function Header({ onToggleInventory }: HeaderProps) {
  const { saveGame, gameState } = useGameContext();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  const handleSave = () => {
    saveGame();
    toast({
      title: "Game Saved",
      description: "Your progress has been saved successfully.",
      duration: 3000,
    });
  };
  
  const handleBackToCamp = () => {
    // Save current progress before navigating
    saveGame();
    // Navigate to the quests overview page
    navigate("/quests");
  };

  // Check if we're in a quest to show the back button
  const isInQuest = gameState.quests.current !== null;
  
  return (
    <header className="bg-primary shadow-md p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="font-heading text-2xl md:text-3xl">Percy Jackson's Quests</h1>
          {isInQuest && (
            <Button 
              variant="ghost" 
              className="ml-4 p-2 rounded-full hover:bg-primary-light flex items-center text-sm"
              onClick={handleBackToCamp}
              title="Return to Camp Half-Blood"
            >
              <span className="material-icons mr-1 text-sm">home</span>
              <span className="hidden sm:inline">Back to Camp</span>
            </Button>
          )}
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            className="p-2 rounded hover:bg-primary-light"
            title="Settings"
          >
            <span className="material-icons">settings</span>
          </Button>
          <Button 
            variant="ghost" 
            className="p-2 rounded hover:bg-primary-light"
            onClick={handleSave}
            title="Save Game"
          >
            <span className="material-icons">save</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
