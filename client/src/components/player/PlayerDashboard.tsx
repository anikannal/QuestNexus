import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";

interface PlayerDashboardProps {
  onToggleInventory: () => void;
}

export default function PlayerDashboard({ onToggleInventory }: PlayerDashboardProps) {
  const { gameState } = useGameContext();
  const player = gameState.player;
  
  // Calculate percentage values for progress bars
  const xpPercentage = Math.min((player.xp / (player.level * 100)) * 100, 100);
  const healthPercentage = Math.min((player.health / player.maxHealth) * 100, 100);
  const energyPercentage = Math.min((player.energy / player.maxEnergy) * 100, 100);
  
  return (
    <div id="playerDashboard" className="bg-white/90 rounded-lg shadow-lg p-4 max-w-4xl mx-auto mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mr-4 border-2 border-secondary">
            <span className="material-icons text-white text-3xl">person</span>
          </div>
          <div>
            <h2 className="font-heading text-xl text-primary">
              {player.name} <span className="font-accent text-secondary">• Child of {player.godParent}</span>
            </h2>
            <div className="flex flex-wrap mt-1 w-full sm:w-auto">
              <div className="mr-4 mb-2 sm:mb-0 w-full sm:w-auto">
                <span className="text-sm text-stone">Level {player.level}</span>
                <div className="w-full sm:w-24 h-3 bg-stone/20 player-stats-bar mt-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-secondary h-full" 
                    style={{ width: `${xpPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="mr-4 mb-2 sm:mb-0 w-full sm:w-auto">
                <span className="text-sm text-stone">Health</span>
                <div className="w-full sm:w-24 h-3 bg-stone/20 player-stats-bar mt-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#4caf50] h-full" 
                    style={{ width: `${healthPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <span className="text-sm text-stone">Energy</span>
                <div className="w-full sm:w-24 h-3 bg-stone/20 player-stats-bar mt-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full" 
                    style={{ width: `${energyPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="bg-parchment rounded-lg p-2 flex items-center">
            <span className="material-icons text-secondary">toll</span>
            <span className="ml-1 font-heading">{player.drachmas} Drachmas</span>
          </div>
          <Button 
            onClick={onToggleInventory}
            className="bg-primary hover:bg-primary-light text-white rounded-lg px-3 py-2 flex items-center"
          >
            <span className="material-icons mr-1">inventory_2</span>
            <span>Inventory</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
