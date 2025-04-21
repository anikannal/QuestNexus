import { useEffect } from "react";
import { useLocation } from "wouter";
import GameContainer from "@/components/layout/GameContainer";
import { useGameContext } from "@/context/GameContext";

export default function Game() {
  const { gameState } = useGameContext();
  const [location, navigate] = useLocation();

  // Check if game has been initialized
  useEffect(() => {
    console.log("Game component mounted, gameState:", gameState);
  }, [gameState]);

  // We should NOT redirect or return null since we're using initialGameState as fallback

  return <GameContainer />;
}
