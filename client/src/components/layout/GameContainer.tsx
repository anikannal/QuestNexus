import { useState } from "react";
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

export default function GameContainer() {
  const { gameState } = useGameContext();
  const [showInventory, setShowInventory] = useState(false);

  const toggleInventory = () => {
    setShowInventory(!showInventory);
  };

  const renderCurrentScene = () => {
    // If inventory is open, show that instead of the current scene
    if (showInventory) {
      return <InventoryScreen onClose={() => setShowInventory(false)} />;
    }

    // If no quest is selected yet, show quest selection screen
    if (gameState.quests.current === null) {
      return <QuestSelection />;
    }

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
