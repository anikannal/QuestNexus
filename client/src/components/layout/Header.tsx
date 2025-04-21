import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onToggleInventory: () => void;
}

export default function Header({ onToggleInventory }: HeaderProps) {
  const { saveGame } = useGameContext();
  const { toast } = useToast();
  
  const handleSave = () => {
    saveGame();
    toast({
      title: "Game Saved",
      description: "Your progress has been saved successfully.",
      duration: 3000,
    });
  };
  
  return (
    <header className="bg-primary shadow-md p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-heading text-2xl md:text-3xl">Percy Jackson's Quests</h1>
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
