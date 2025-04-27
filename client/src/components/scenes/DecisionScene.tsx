import { useState, useEffect } from "react";
import { useGameContext } from "@/context/GameContext";

export default function DecisionScene() {
  const { gameState, completeScene } = useGameContext();
  const [scene, setScene] = useState<any>(null);
  
  useEffect(() => {
    // Find the current scene data
    const currentSceneId = gameState.currentScene.id;
    
    // In a real implementation, this would fetch from the API
    import("@/data/scenes").then(module => {
      const sceneData = module.default.find((s: any) => s.id === currentSceneId);
      if (sceneData) {
        setScene(sceneData);
      }
    });
  }, [gameState.currentScene]);
  
  if (!scene) {
    return <div className="text-center p-8">Loading decision scene...</div>;
  }
  
  const handleChoice = (choiceId: string) => {
    // Record the player's choice
    completeScene(choiceId);
  };
  
  return (
    <div id="decisionScene" className="bg-white/90 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mb-6">
      <div className="border-b border-stone/20 pb-2 mb-4 flex justify-between items-center">
        <h2 className="font-heading text-xl text-primary">{scene.title}</h2>
        <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">Decision</span>
      </div>
      
      <div className="panel bg-parchment rounded-lg overflow-hidden shadow">
        <div className="h-96 w-full flex items-center justify-center bg-parchment">
          <img
            src={`/${scene.imageName}.png`}
            alt={scene.imageName}
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="font-accent text-lg">{scene.dialogue}</p>
            {scene.narration && (
              <p className="italic text-stone mt-3">{scene.narration}</p>
            )}
            {scene.followupDialogue && (
              <p className="font-accent mt-3">{scene.followupDialogue}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {scene.choices.map((choice: any) => (
              <div 
                key={choice.id}
                className="choice-box bg-white/70 border border-stone/30 rounded-lg p-4 cursor-pointer hover:border-primary"
                onClick={() => handleChoice(choice.id)}
              >
                <h3 className="font-heading text-lg text-primary mb-2">{choice.title}</h3>
                <p className="text-sm text-stone mb-3">{choice.description}</p>
                <div className="text-xs text-stone/70 italic">
                  <span className="material-icons inline-block" style={{ fontSize: "14px" }}>psychology</span>
                  {choice.hint}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
