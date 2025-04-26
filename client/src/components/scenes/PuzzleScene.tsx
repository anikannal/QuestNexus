import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useGameContext } from "@/context/GameContext";

export default function PuzzleScene() {
  const { gameState, completeScene, updateSceneProgress } = useGameContext();
  const [puzzleAnswer, setPuzzleAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [scene, setScene] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Find the current scene data
    const currentSceneId = gameState.currentScene.id;
    
    // In a real implementation, this would fetch from the API
    import("@/data/scenes").then(module => {
      const sceneData = module.default.find((s: any) => s.id === currentSceneId);
      if (sceneData) {
        setScene(sceneData);
        // If we have stored attempt count, use it
        if (gameState.currentScene.attempted !== undefined) {
          setAttempts(gameState.currentScene.attempted);
        }
      }
    });
  }, [gameState.currentScene]);
  
  if (!scene) {
    return <div className="text-center p-8">Loading puzzle...</div>;
  }
  
  const handleSubmitAnswer = (e: FormEvent) => {
    e.preventDefault();
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    updateSceneProgress({ attempted: newAttempts });
    
    // Check if answer is correct (case-insensitive)
    if (puzzleAnswer.toLowerCase().trim() === scene.correctAnswer.toLowerCase()) {
      toast({
        title: "Correct!",
        description: scene.successMessage,
        variant: "success",
      });
      completeScene("success");
    } else if (newAttempts >= 3) {
      // Failed after 3 attempts
      toast({
        title: "Puzzle Failed",
        description: scene.failureMessage,
        variant: "destructive",
      });
      completeScene("failure");
    } else {
      // Wrong answer but more attempts available
      toast({
        title: "Incorrect",
        description: `Try again. Attempts remaining: ${3 - newAttempts}`,
        variant: "warning",
      });
    }
  };
  
  return (
    <div id="puzzleScene" className="bg-white/90 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mb-6">
      <div className="border-b border-stone/20 pb-2 mb-4 flex justify-between items-center">
        <h2 className="font-heading text-xl text-primary">{scene.title}</h2>
        <span className="px-3 py-1 bg-accent text-white text-sm rounded-full">Puzzle</span>
      </div>
      
      <div className="panel bg-parchment rounded-lg overflow-hidden shadow">
        <div className="h-96 w-full flex items-center justify-center bg-stone-100">
          <img
            src={`/${scene.imageName}.png`}
            alt={scene.imageName}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="bg-stone/10 flex items-center justify-center">
          <div className="text-center text-stone/60">
            <p>{scene.imageDescription}</p>
          </div>
        </div>
        <div className="p-6">
          <p className="font-accent text-lg mb-4 text-center italic">{scene.riddle}</p>
          
          <form id="puzzleForm" className="mt-8" onSubmit={handleSubmitAnswer}>
            <div className="mb-4">
              <label htmlFor="puzzleAnswer" className="block text-stone mb-2">Your Answer:</label>
              <Input
                id="puzzleAnswer"
                className="w-full border border-stone/30 rounded-lg p-3 bg-white/80 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Type your answer here..."
                value={puzzleAnswer}
                onChange={(e) => setPuzzleAnswer(e.target.value)}
                required
              />
            </div>
            <div className="text-center">
              <Button 
                type="submit" 
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light"
              >
                Submit Answer
              </Button>
            </div>
          </form>
          
          {scene.hint && (
            <div className="mt-6 p-3 border border-warning/30 bg-warning/10 rounded-lg">
              <details>
                <summary className="font-accent cursor-pointer">Need a hint?</summary>
                <p className="mt-2 text-stone/80">{scene.hint}</p>
              </details>
            </div>
          )}
          
          <div className="text-center mt-4 text-sm text-stone/70">
            <span>Attempts: {attempts}/3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
