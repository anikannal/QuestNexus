import { useEffect } from "react";
import { useLocation } from "wouter";
import GameContainer from "@/components/layout/GameContainer";
import { useGameContext } from "@/context/GameContext";

export default function Game() {
  const { gameState } = useGameContext();
  const [location, navigate] = useLocation();

  // Check if game has been initialized
  useEffect(() => {
    if (!gameState) {
      navigate("/");
    }
  }, [gameState, navigate]);

  if (!gameState) return null;

  return <GameContainer />;
}
