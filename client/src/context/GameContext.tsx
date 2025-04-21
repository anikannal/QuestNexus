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
  startQuest: (questId: number, sceneData?: {id: string, questId: number}) => void;
  completeScene: (outcome: string) => void;
  updateSceneProgress: (progress: Partial<SceneState>) => void;
  updatePlayerStats: (stats: Partial<Player>) => void;
}

// Create context
//const GameContext = createContext<GameContextProps>({
//  gameState: initialGameState,
//  initializeNewGame: () => {},
//  loadGame: () => {},
//  saveGame: () => {},
//  startQuest: () => {},
//  completeScene: () => {},
//  updateSceneProgress: () => {},
//  updatePlayerStats: () => {}
//});

const GameContext = createContext<GameContextProps | null>(null);

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
    try {
      navigate("/game");
    } catch (error) {
      console.error("Navigation failed:", error);
      toast({
        title: "Error",
        description: "Could not navigate to the game page.",
        variant: "destructive"
      });
    }
    console.log("Navigated to game page");
  };

  // Load a saved game from localStorage
  const loadGame = () => {
    try {
      const savedGame = localStorage.getItem('percyJacksonGameState');
      if (savedGame) {
        const parsedGame = JSON.parse(savedGame) as GameStateData;
        setGameState(parsedGame);
        try {
          navigate("/game");
        } catch (error) {
          console.error("Navigation failed:", error);
          toast({
            title: "Error",
            description: "Could not navigate to the game page.",
            variant: "destructive"
          });
        }
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
    console.log("Inside startQuest! QuestID:", questId);
    
    setGameState(prevState => {
      if (!prevState) {
        console.error("Cannot start quest: gameState is null");
        return prevState;
      }

      const quest = quests.find(q => q.id === questId);
      if (!quest) {
        console.error("Cannot start quest: quest not found");
        return prevState;
      }

      const newState = {
        ...prevState,
        quests: {
          ...prevState.quests,
          current: questId,
          available: prevState.quests.available.map(q => ({
            ...q,
            status: q.id === questId ? "active" : q.status
          }))
        },
        currentScene: {
          type: "story",
          id: quest.startingSceneId,
          questId: questId,
          currentPanel: 1,
          totalPanels: 1
        }
      };

      // Log the new state for debugging
      console.log("New state in startQuest:", newState);

      // Save to localStorage inside the state update
      try {
        localStorage.setItem('percyJacksonGameState', JSON.stringify(newState));
      } catch (error) {
        console.error("Failed to save game state to localStorage:", error);
        toast({
          title: "Error",
          description: "Could not save your progress.",
          variant: "destructive"
        });
      }
      
      toast({
        title: "Quest Started",
        description: `You have begun: ${quest.title}`,
        variant: "default"
      });

      return newState;
    });
  };

  // Complete a scene and determine the next scene
  const completeScene = async (outcome: string) => {
    if (!gameState) {
      console.error("Cannot complete scene: gameState is null");
      return;
    }

    console.log("=== Complete Scene Debug ===");
    console.log("Completing scene with outcome:", outcome);
    console.log("Current scene ID:", gameState.currentScene.id);
    console.log("Current gameState before completing scene:", gameState);


    try {
      // Find the current scene
            let scenes;
      try {
        const module = await import("@/data/scenes");
        scenes = module.default;
      } catch (error) {
        console.error("Failed to load scenes:", error);
        toast({
          title: "Error",
          description: "Could not load scene data.",
          variant: "destructive"
        });
        return;
      }
      const currentScene = scenes.find((s: any) => s.id === gameState.currentScene.id);

      if (!currentScene) {
        console.error("Current scene not found:", gameState.currentScene.id);
        toast({
          title: "Error",
          description: "Could not find current scene data",
          variant: "destructive"
        });
        return;
      }

      console.log("Current scene data:", currentScene);

      // Determine the next scene ID based on outcome
      let nextSceneId = "";

      if (currentScene.type === "story") {
        nextSceneId = currentScene.nextScene || "";
      } else if (currentScene.type === "puzzle") {
        nextSceneId = outcome === "success" ? currentScene.successScene || "" : currentScene.failureScene || "";
      } else if (currentScene.type === "battle") {
        nextSceneId = outcome === "success" ? currentScene.victoryScene || "" : currentScene.defeatScene || "";
      } else if (currentScene.type === "decision") {
        const selectedChoice = currentScene.choices.find((c: any) => c.id === outcome);
        nextSceneId = selectedChoice?.nextScene || currentScene.defaultNextScene || "";
      }

      console.log("Next scene ID:", nextSceneId);

      // If we reached the end of the quest
      if (!nextSceneId || nextSceneId === "end") {
        console.log("End of quest reached");
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

          const updatedGameState = {
            ...prev,
            quests: {
              ...prev.quests,
              completed: [...prev.quests.completed, questId],
              current: null,
              available: updatedAvailable
            }
          };

          // Save to localStorage
          try {
            localStorage.setItem('percyJacksonGameState', JSON.stringify(updatedGameState));
          } catch (error) {
            console.error("Failed to save completed quest state to localStorage:", error);
          }
          console.log("Updated gameState after completing scene:", gameState);

          return updatedGameState;
        });

        toast({
          title: "Quest Completed!",
          description: "You have successfully completed the quest.",
          variant: "default"
        });

        return;
      }

      // Find the next scene
      const nextScene = scenes.find((s: any) => s.id === nextSceneId);

      if (!nextScene) {
        console.error("Next scene not found:", nextSceneId);
        toast({
          title: "Error",
          description: "Could not find next scene data",
          variant: "destructive"
        });
        return;
      }

      console.log("Next scene data:", nextScene);

      // Update game state with the next scene
      setGameState(prev => {
        if (!prev) return prev;

        const updatedGameState = {
          ...prev,
          currentScene: {
            type: nextScene.type,
            id: nextSceneId,
            questId: prev.currentScene.questId,
            currentPanel: 1,
            totalPanels: nextScene.panels?.length || 1
          }
        };

        // Save to localStorage
        try {
          localStorage.setItem('percyJacksonGameState', JSON.stringify(updatedGameState));
        } catch (error) {
          console.error("Failed to save updated scene state to localStorage:", error);
        }

        return updatedGameState;
      });

      console.log("Scene completed successfully");

    } catch (error) {
      console.error("Error completing scene:", error);
      toast({
        title: "Error",
        description: "An error occurred while advancing to the next scene",
        variant: "destructive"
      });
    }
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
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};