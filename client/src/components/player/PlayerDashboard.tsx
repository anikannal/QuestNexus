import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGameContext } from "@/context/GameContext";
import { useLocation } from "wouter";
import quests from "@/data/quests";

interface PlayerDashboardProps {
  onToggleInventory: () => void;
}

export default function PlayerDashboard({ onToggleInventory }: PlayerDashboardProps) {
  const { gameState, startQuest } = useGameContext();
  const player = gameState.player;
  const [_, navigate] = useLocation();
  
  // Calculate percentage values for progress bars
  const xpPercentage = Math.min((player.xp / (player.level * 100)) * 100, 100);
  const healthPercentage = Math.min((player.health / player.maxHealth) * 100, 100);
  const energyPercentage = Math.min((player.energy / player.maxEnergy) * 100, 100);
  
  // Quest handling functions
  const handleStartQuest = async (questId: number) => {
    try {
      await startQuest(questId);
    } catch (error) {
      console.error("Failed to start quest:", error);
    }
  };
  
  // Check if quest is completed
  const isQuestCompleted = (questId: number) => {
    return gameState.quests.completed.includes(questId);
  };

  // Check if quest is in progress
  const isQuestInProgress = (questId: number) => {
    return gameState.quests.current === questId;
  };

  // Check if quest is available to start
  const isQuestAvailable = (questId: number) => {
    return gameState.quests.available.some(q => q.id === questId && q.status === "available");
  };

  // Determine appropriate button text and state for each quest
  const getQuestButtonProps = (questId: number) => {
    if (isQuestInProgress(questId)) {
      return {
        text: "Continue Quest",
        disabled: false,
        action: () => handleStartQuest(questId),
        className: "bg-accent hover:bg-accent/90 text-white"
      };
    } else if (isQuestCompleted(questId)) {
      return {
        text: "Replay Quest",
        disabled: false,
        action: () => handleStartQuest(questId),
        className: "bg-secondary hover:bg-secondary/90 text-white"
      };
    } else if (isQuestAvailable(questId)) {
      return {
        text: "Start Quest",
        disabled: false,
        action: () => handleStartQuest(questId),
        className: "bg-primary hover:bg-primary/90 text-white"
      };
    } else {
      return {
        text: "Locked",
        disabled: true,
        action: () => {},
        className: "bg-gray-400 text-white cursor-not-allowed"
      };
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Player stats dashboard */}
      <div id="playerDashboard" className="bg-white/90 rounded-lg shadow-lg p-4 max-w-4xl mx-auto">
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
      
      {/* Quest overview section */}
      <div className="quest-overview bg-white/90 rounded-lg shadow-lg p-4 max-w-4xl mx-auto">
        <h2 className="font-heading text-2xl text-primary mb-4 border-b border-stone/20 pb-2">
          Available Quests
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {quests.map((quest) => {
            const buttonProps = getQuestButtonProps(quest.id);
            const questState = gameState.quests.available.find(q => q.id === quest.id);
            
            return (
              <Card key={quest.id} className="overflow-hidden border border-stone/20 hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-heading text-primary">{quest.title}</CardTitle>
                    {isQuestInProgress(quest.id) && (
                      <Badge variant="outline" className="bg-accent/20 border-accent text-accent">
                        Active
                      </Badge>
                    )}
                    {isQuestCompleted(quest.id) && (
                      <Badge variant="outline" className="bg-secondary/20 border-secondary text-secondary">
                        Completed
                      </Badge>
                    )}
                    {!isQuestInProgress(quest.id) && !isQuestCompleted(quest.id) && questState?.status === "locked" && (
                      <Badge variant="outline" className="bg-gray-200 border-gray-400 text-gray-600">
                        Locked
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-stone mt-1 text-xs">
                    Level {quest.recommendedLevel} | {quest.estimatedTime}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="py-3">
                  <p className="text-stone text-sm">{quest.description}</p>
                  
                  {questState?.status === "locked" && quest.requiredQuestTitle && (
                    <div className="bg-stone/10 rounded p-2 text-xs mt-2">
                      <span className="material-icons text-warning inline-block mr-1" style={{ fontSize: "12px" }}>lock</span>
                      <span>Complete "{quest.requiredQuestTitle}" to unlock</span>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="bg-stone/5 pt-2">
                  <Button 
                    className={`w-full ${buttonProps.className}`}
                    disabled={buttonProps.disabled}
                    onClick={buttonProps.action}
                    size="sm"
                  >
                    {buttonProps.text}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Bottom navigation */}
      <div className="mt-8 flex justify-center">
        <Button 
          variant="outline"
          onClick={() => navigate("/")}
          className="border-primary text-primary"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
