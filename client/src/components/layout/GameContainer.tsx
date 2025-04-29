import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import QuestSelection from "@/components/scenes/QuestSelection";
import StoryScene from "@/components/scenes/StoryScene";
import PuzzleScene from "@/components/scenes/PuzzleScene";
import BattleScene from "@/components/scenes/BattleScene";
import DecisionScene from "@/components/scenes/DecisionScene";
import PlayerDashboard from "@/components/player/PlayerDashboard";
import InventoryScreen from "@/components/inventory/InventoryScreen";
import { useGameContext } from "@/context/GameContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import quests from "@/data/quests";
// Import initialPlayer for reset functionality
import { initialPlayer } from "@/context/GameContext";

export default function GameContainer() {
  const { gameState, startQuest, initializeNewGame, updatePlayerStats } = useGameContext();
  const [showInventory, setShowInventory] = useState(false);
  const { toast } = useToast();
  
  // Handle hard reset for development/debugging
  const handleHardReset = () => {
    console.log("Performing hard reset of game state");
    localStorage.clear();
    toast({
      title: "Game Reset",
      description: "All game progress has been cleared. Starting a fresh game.",
      variant: "default"
    });
    // Initialize a new game with fresh state
    initializeNewGame();
  };

  // Load game state from localStorage on initial render
  const handleResetGame = () => {
    console.log("Resetting the entire game");
    initializeNewGame();
    toast({
      title: "Game Reset",
      description: "The game has been reset to the beginning.",
      variant: "default"
    });
  };

  // Reset the current quest
  // This function resets the current quest and player stats to their initial values
  const handleResetQuest = () => {
    if (!gameState || !gameState.quests.current) {
      console.error("No current quest to reset");
      return;
    }

    const currentQuestId = gameState.quests.current;
    console.log("Resetting current quest:", currentQuestId);

    // Reset player stats to initial values
    updatePlayerStats({
      health: initialPlayer.maxHealth,
      energy: initialPlayer.maxEnergy,
      level: initialPlayer.level,
      xp: initialPlayer.xp
    });

    // Restart the current quest
    startQuest(currentQuestId);

    toast({
      title: "Quest Reset",
      description: "The current quest has been reset.",
      variant: "default"
    });
  };
  
  // Automatically start the first quest if none is selected
  useEffect(() => {
    if (gameState && gameState.quests.current === null) {
      console.log("No quest is selected, checking for available quests");
      const firstAvailableQuest = gameState.quests.available.find(q => q.status === "available");
      if (firstAvailableQuest) {
        console.log("Auto-starting first available quest:", firstAvailableQuest.id);
        startQuest(firstAvailableQuest.id);
      }
    }
  }, [gameState?.quests.current]);

  const toggleInventory = () => {
    setShowInventory(!showInventory);
  };

  // Function to find the starting scene for a quest
  const getStartingSceneForQuest = (questId: number) => {
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      return quest.startingSceneId;
    }
    return null;
  };

  const renderCurrentScene = () => {
    console.log("Rendering current scene, gameState:", gameState);
    
    // If inventory is open, show that instead of the current scene
    if (showInventory) {
      return <InventoryScreen onClose={() => setShowInventory(false)} />;
    }

    // If no quest is selected yet, show quest selection screen
    if (gameState.quests.current === null) {
      console.log("No quest selected, showing quest selection");
      return <QuestSelection />;
    }

    // Check if we have an issue with mismatched quest ID and scene ID
    const currentQuestId = gameState.quests.current;
    console.log("Current quest ID:", currentQuestId);
    console.log("Current scene questId:", gameState.currentScene.questId);
    console.log("Current scene ID:", gameState.currentScene.id);
    
    // CRITICAL FIX: If questId is still 0 but a quest is selected, try to update manually
    if (gameState.currentScene.questId === 0 && currentQuestId > 0) {
      console.log("CRITICAL ISSUE: questId is still 0 despite quest being selected");
      console.log("Attempt emergency fix by getting the scene data directly");
      
      // Try to force the correct scene based on the quests data
      try {
        // Import the scenes data to find the correct questId
        import("@/data/scenes").then(({ default: scenes }) => {
          console.log("Loaded scenes data:", scenes);
          // Find the first scene for this quest to get the correct questId
          const matchingScene = scenes.find(s => s.questId === currentQuestId);
          
          if (matchingScene) {
            console.log("Found matching scene with correct questId:", matchingScene);
            // Try to force update via startQuest
            startQuest(currentQuestId, {
              id: matchingScene.id,
              questId: matchingScene.questId
            });
          }
        });
      } catch (error) {
        console.error("Failed to perform emergency scene fix:", error);
      }
      
      // Display an error message but don't block rendering
      toast({
        title: "Scene Loading Error",
        description: "There was an issue starting the quest. Try resetting the game if scenes don't load correctly.",
        variant: "destructive"
      });
    }
    
    // If the scene ID is empty but we have a quest selected, try to find the starting scene
    if ((!gameState.currentScene.id || gameState.currentScene.id === "") && currentQuestId > 0) {
      console.log("Scene ID is empty but quest is selected, trying to find starting scene");
      
      // Force update of the game state to use the proper starting scene
      const startingSceneId = getStartingSceneForQuest(currentQuestId);
      if (startingSceneId) {
        console.log("Found starting scene ID:", startingSceneId);
        console.log("Redirecting to proper scene...");
        
        // Update the scene using startQuest again
        startQuest(currentQuestId);
        
        // Show loading state while scene is being updated
        return (
          <div className="bg-white/90 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl text-primary mb-6">Loading Scene...</h2>
            <p className="text-center">Starting quest: {
              quests.find(q => q.id === currentQuestId)?.title || "Unknown Quest"
            }</p>
          </div>
        );
      }
    }

    console.log("Quest selected, current scene type:", gameState.currentScene.type);
    
    // Otherwise show the appropriate scene type based on current scene
    switch (gameState.currentScene.type) {
      case "story":
        return <StoryScene />;
      case "puzzle":
        return <PuzzleScene />;
      case "battle":
        return <BattleScene />;
      case "decision":
        return <DecisionScene />;
      default:
        console.log("Unknown scene type, defaulting to quest selection");
        return <QuestSelection />;
    }
  };

  // Detect the problematic state where questId is still 0 but quest is selected
  const hasQuestIdError = gameState.quests.current !== null && gameState.currentScene.questId === 0;
  
  // Error message for quest starting error
  const renderQuestStartError = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4 max-w-3xl mx-auto">
      <h3 className="text-red-600 text-lg font-bold mb-2">Game State Error Detected</h3>
      <p className="mb-4 text-gray-700">
        The quest was started but the scene data is in an inconsistent state (questId is still 0).
        This is a known issue that we're working to fix. Please reset your game to start fresh.
      </p>
      <Button 
        onClick={handleHardReset}
        variant="destructive"
      >
        Reset Game Data
      </Button>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleInventory={toggleInventory} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Show error message if we detect the problematic questId=0 state */}
        {hasQuestIdError && renderQuestStartError()}
        
        <div id="gameView" className="relative">
          {gameState.quests.current !== null && <PlayerDashboard onToggleInventory={toggleInventory} />}
          {renderCurrentScene()}
        </div>
        

      </main>
      
      <Footer />
    </div>
  );
}
