import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/GameContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { gameState, loadGame, initializeNewGame } = useGameContext();
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    // Check if there's a saved game
    const savedGame = localStorage.getItem('percyJacksonGameState');
    setHasSavedGame(!!savedGame);
  }, []);

  const handleContinue = () => {
    loadGame();
  };

  const handleNewGame = () => {
    initializeNewGame();
    navigate("/game");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-parchment bg-opacity-80">
      <Card className="w-full max-w-lg bg-white/90 shadow-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-heading text-4xl text-primary">Percy Jackson's Quests</CardTitle>
          <CardDescription className="font-accent text-lg">An Interactive Adventure</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="w-full h-48 bg-stone/10 flex items-center justify-center mb-6 rounded-md overflow-hidden">
            <div className="text-center text-stone/60">
              <span className="material-icons text-5xl">public</span>
              <p className="font-accent text-xl mt-2">Welcome to Camp Half-Blood</p>
            </div>
          </div>
          <p className="text-stone font-accent text-lg text-center mb-6">
            Embark on a journey as a demigod at Camp Half-Blood. Discover your powers, complete quests, and fulfill your destiny.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full bg-primary hover:bg-primary-light text-white font-heading py-6 text-lg"
            onClick={handleNewGame}
          >
            Begin New Quest
          </Button>
          
          {hasSavedGame && (
            <Button 
              className="w-full bg-secondary hover:bg-secondary-light text-white font-heading py-6 text-lg"
              onClick={handleContinue}
            >
              Continue Adventure
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-white bg-primary/80 px-6 py-2 rounded-full">
        <p>Based on the world of Percy Jackson & The Olympians</p>
      </div>
    </div>
  );
}
