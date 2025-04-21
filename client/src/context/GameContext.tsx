import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import quests from "@/data/quests";
import { GameStateData, Player, QuestProgress, SceneState } from "@shared/schema";

// Initial player state
const initialPlayer: Player = {
  name: "Alex",
  godParent: "Apollo",
  level: 1,
  xp: 0,
  health: 100,
  maxHealth: 100,
  energy: 100,
  maxEnergy: 100,
  drachmas: 10,
  inventory: {
    weapons: [
      { 
        id: "celestial-bronze-sword", 
        name: "Celestial Bronze Sword", 
        attack: 15, 
        durability: 95,
        description: "Standard issue for Camp Half-Blood heroes.",
        cost: 2,
        type: "weapon"
      }
    ],
    powers: [
      { 
        id: "apollo-light-arrow", 
        name: "Apollo's Light Arrow", 
        damage: 25, 
        energyCost: 4,
        description: "Summon a bolt of divine light to strike your enemy.",
        type: "power"
      }
    ],
    items: [
      { 
        id: "ambrosia", 
        name: "Ambrosia", 
        heal: 20, 
        quantity: 2,
        description: "Food of the gods that heals demigods.",
        type: "item"
      }
    ]
  }
};

// Initial quest progress
const initialQuestProgress: QuestProgress = {
  completed: [],
  current: null,
  available: quests.map(quest => ({
    id: quest.id,
    title: quest.title,
    status: quest.id === 1 ? "available" : "locked"
  }))
};

// Initial game state
const initialGameState: GameStateData = {
  player: initialPlayer,
  quests: initialQuestProgress,
  currentScene: {
    type: "story",
    id: "",
    questId: 0,
    currentPanel: 1,
    totalPanels: 1
  }
};

// Context interface
interface GameContextProps {
  gameState: GameStateData;
  initializeNewGame: () => void;
  loadGame: () => void;
  saveGame: () => void;
  startQuest: (questId: number) => void;
  completeScene: (outcome: string) => void;
  updateSceneProgress: (progress: Partial<SceneState>) => void;
  updatePlayerStats: (stats: Partial<Player>) => void;
}

// Create context
const GameContext = createContext<GameContextProps>({
  gameState: initialGameState,
  initializeNewGame: () => {},
  loadGame: () => {},
  saveGame: () => {},
  startQuest: () => {},
  completeScene: () => {},
  updateSceneProgress: () => {},
  updatePlayerStats: () => {}
});

// Provider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // Initialize a new game
  const initializeNewGame = () => {
    console.log("Initializing new game with state:", initialGameState);
    setGameState({...initialGameState});
    console.log("After setting game state");
    navigate("/game");
    console.log("Navigated to game page");
  };

  // Load a saved game from localStorage
  const loadGame = () => {
    try {
      const savedGame = localStorage.getItem('percyJacksonGameState');
      if (savedGame) {
        const parsedGame = JSON.parse(savedGame) as GameStateData;
        setGameState(parsedGame);
        navigate("/game");
      } else {
        initializeNewGame();
      }
    } catch (error) {
      console.error("Error loading game:", error);
      toast({
        title: "Error Loading Game",
        description: "There was a problem loading your saved game. Starting a new game instead.",
        variant: "destructive"
      });
      initializeNewGame();
    }
  };

  // Save the current game state
  const saveGame = () => {
    if (!gameState) return;
    
    try {
      localStorage.setItem('percyJacksonGameState', JSON.stringify(gameState));
      
      // In a real implementation, this would save to the server as well
      // This is commented out since we don't have a real backend setup yet
      // apiRequest('POST', '/api/game-state', {
      //   userId: 1, // This would be the actual user ID in a real app
      //   gameStateData: gameState
      // });
    } catch (error) {
      console.error("Error saving game:", error);
      toast({
        title: "Error Saving Game",
        description: "There was a problem saving your game progress.",
        variant: "destructive"
      });
    }
  };

  // Start a new quest
  const startQuest = (questId: number) => {
    if (!gameState) {
      console.error("Cannot start quest: gameState is null");
      return;
    }
    
    // Find the quest
    const quest = quests.find(q => q.id === questId);
    if (!quest) {
      console.error("Cannot start quest: quest not found with ID", questId);
      return;
    }
    
    console.log("Starting quest:", quest.title);
    console.log("Starting scene ID:", quest.startingSceneId);
    
    // Import scenes dynamically to get the first scene type
    import("@/data/scenes").then(module => {
      const scenes = module.default;
      const firstScene = scenes.find((s: any) => s.id === quest.startingSceneId);
      
      if (!firstScene) {
        console.error("First scene not found:", quest.startingSceneId);
        return;
      }
      
      // Update game state with correct scene type
      setGameState(prev => {
        if (!prev) return prev;
        
        const updatedState = {
          ...prev,
          quests: {
            ...prev.quests,
            current: questId
          },
          currentScene: {
            type: firstScene.type || "story",
            id: quest.startingSceneId,
            questId: questId,
            currentPanel: 1,
            totalPanels: firstScene.panels?.length || 1
          }
        };
        
        console.log("Updated game state:", updatedState);
        return updatedState;
      });
    });
  };

  // Complete a scene and determine the next scene
  const completeScene = (outcome: string) => {
    if (!gameState) return;
    
    // Find the current scene
    import("@/data/scenes").then(module => {
      const scenes = module.default;
      const currentScene = scenes.find((s: any) => s.id === gameState.currentScene.id);
      
      if (!currentScene) return;
      
      // Determine the next scene ID based on outcome
      let nextSceneId = "";
      
      if (currentScene.type === "story") {
        nextSceneId = currentScene.nextScene;
      } else if (currentScene.type === "puzzle") {
        nextSceneId = outcome === "success" ? currentScene.successScene : currentScene.failureScene;
      } else if (currentScene.type === "battle") {
        nextSceneId = outcome === "success" ? currentScene.victoryScene : currentScene.defeatScene;
      } else if (currentScene.type === "decision") {
        const selectedChoice = currentScene.choices.find((c: any) => c.id === outcome);
        nextSceneId = selectedChoice ? selectedChoice.nextScene : currentScene.defaultNextScene;
      }
      
      // If we reached the end of the quest
      if (!nextSceneId || nextSceneId === "end") {
        // Complete the quest
        const questId = gameState.currentScene.questId;
        
        setGameState(prev => {
          if (!prev) return prev;
          
          // Unlock the next quest if applicable
          const updatedAvailable = prev.quests.available.map(q => {
            if (q.id === questId + 1) {
              return { ...q, status: "available" };
            }
            return q;
          });
          
          return {
            ...prev,
            quests: {
              ...prev.quests,
              completed: [...prev.quests.completed, questId],
              current: null,
              available: updatedAvailable
            }
          };
        });
        
        toast({
          title: "Quest Completed!",
          description: "You have successfully completed the quest.",
          variant: "success"
        });
        
        return;
      }
      
      // Find the next scene
      const nextScene = scenes.find((s: any) => s.id === nextSceneId);
      
      if (!nextScene) return;
      
      // Update game state with the next scene
      setGameState(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          currentScene: {
            type: nextScene.type,
            id: nextSceneId,
            questId: prev.currentScene.questId,
            currentPanel: 1
          }
        };
      });
    });
  };

  // Update scene progress (e.g., current panel in a story scene)
  const updateSceneProgress = (progress: Partial<SceneState>) => {
    if (!gameState) return;
    
    setGameState(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        currentScene: {
          ...prev.currentScene,
          ...progress
        }
      };
    });
  };

  // Update player stats
  const updatePlayerStats = (stats: Partial<Player>) => {
    if (!gameState) return;
    
    setGameState(prev => {
      if (!prev) return prev;
      
      const updatedPlayer = {
        ...prev.player,
        ...stats
      };
      
      // Check if player has enough XP to level up
      const xpThreshold = updatedPlayer.level * 100;
      if (updatedPlayer.xp >= xpThreshold) {
        updatedPlayer.level += 1;
        updatedPlayer.xp -= xpThreshold;
        updatedPlayer.maxHealth += 10;
        updatedPlayer.health = updatedPlayer.maxHealth;
        updatedPlayer.maxEnergy += 5;
        updatedPlayer.energy = updatedPlayer.maxEnergy;
        
        toast({
          title: "Level Up!",
          description: `You are now level ${updatedPlayer.level}. Your health and energy have increased!`,
          variant: "success"
        });
      }
      
      return {
        ...prev,
        player: updatedPlayer
      };
    });
  };

  // Context value
  const contextValue: GameContextProps = {
    gameState: gameState || initialGameState,
    initializeNewGame,
    loadGame,
    saveGame,
    startQuest,
    completeScene,
    updateSceneProgress,
    updatePlayerStats
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

// Custom hook for using the game context
export const useGameContext = () => useContext(GameContext);
