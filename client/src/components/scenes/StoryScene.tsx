import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";

export default function StoryScene() {
  const { gameState, completeScene, updateSceneProgress } = useGameContext();
  const [currentPanel, setCurrentPanel] = useState(1);
  const [scene, setScene] = useState<any>(null);
  
  useEffect(() => {
    // Find the current scene data
    const currentSceneId = gameState.currentScene.id;
    
    // In a real implementation, this would fetch from the API
    // For now, we'll use the scenes data directly
    import("@/data/scenes").then(module => {
      const sceneData = module.default.find((s: any) => s.id === currentSceneId);
      if (sceneData) {
        setScene(sceneData);
        setCurrentPanel(gameState.currentScene.currentPanel || 1);
      }
    });
  }, [gameState.currentScene]);
  
  if (!scene) {
    return <div className="text-center p-8">Loading scene...</div>;
  }
  
  const handlePrevPanel = () => {
    if (currentPanel > 1) {
      const newPanel = currentPanel - 1;
      setCurrentPanel(newPanel);
      updateSceneProgress({ currentPanel: newPanel });
    }
  };
  
  const handleNextPanel = () => {
    if (currentPanel < scene.panels.length) {
      const newPanel = currentPanel + 1;
      setCurrentPanel(newPanel);
      updateSceneProgress({ currentPanel: newPanel });
    } else {
      // Move to the next scene
      completeScene("success");
    }
  };
  
  const currentPanelData = scene.panels[currentPanel - 1];
  
  return (
    <>
    <div id="storyScene" className="bg-white/90 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mb-6">
      <div className="border-b border-stone/20 pb-2 mb-4 flex justify-between items-center">
        <h2 className="font-heading text-xl text-primary">{scene.title}</h2>
        <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">Story</span>
      </div>
      
      <div className="story-panels">
        <div className="panel mb-8 bg-parchment rounded-lg overflow-hidden shadow">
          <div className="h-96 w-full flex items-center justify-center bg-stone-100">
            <img
              src={`/${currentPanelData.imageName}.png`}
              alt={currentPanelData.imageName}
              className="w-full h-full object-contain"
            />
    </div>
            <div className="text-center text-stone/60">
              <p>{currentPanelData.imageDescription}</p>
            </div>
          </div>
          <div className="p-4">
            <p className="mb-3 font-accent text-lg">{currentPanelData.dialogue}</p>
            {currentPanelData.narration && (
              <p className="italic text-stone">{currentPanelData.narration}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          className="px-4 py-2 bg-stone/20 text-stone rounded-lg hover:bg-stone/30 flex items-center"
          onClick={handlePrevPanel}
          disabled={currentPanel === 1}
        >
          <span className="material-icons mr-1">arrow_back</span>
          Previous
        </Button>
        <Button
          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-light flex items-center"
          onClick={handleNextPanel}
        >
          {currentPanel < scene.panels.length ? "Next" : "Continue"}
          <span className="material-icons ml-1">arrow_forward</span>
        </Button>
      </div>
    </> 
    
  );
}
