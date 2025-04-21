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
import quests from "@/data/quests";

export default function GameContainer() {
  const { gameState, startQuest } = useGameContext();
  const [showInventory, setShowInventory] = useState(false);
  
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleInventory={toggleInventory} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div id="gameView" className="relative">
          {gameState.quests.current !== null && <PlayerDashboard onToggleInventory={toggleInventory} />}
          {renderCurrentScene()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
