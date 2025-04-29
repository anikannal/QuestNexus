import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGameContext } from "@/context/GameContext";
import quests from "@/data/quests";

export default function QuestOverview() {
  const { gameState, startQuest } = useGameContext();
  const [location, navigate] = useLocation();

  // Start quest handler
  const handleStartQuest = async (questId: number) => {
    try {
      await startQuest(questId);
      navigate("/game");
    } catch (error) {
      console.error("Failed to start quest:", error);
    }
  };

  // Continue quest handler
  const handleContinueQuest = () => {
    navigate("/game");
  };

  // Check if quest is completed
  const isQuestCompleted = (questId: number) => {
    return gameState.quests.completed.includes(questId);
  };

  // Check if quest is in progress
  const isQuestInProgress = (questId: number) => {
    return gameState.quests.current === questId;
  };

  // Check if quest is available to start
  const isQuestAvailable = (questId: number) => {
    return gameState.quests.available.some(q => q.id === questId && q.status === "available");
  };

  // Determine appropriate button text and state for each quest
  const getQuestButtonProps = (questId: number) => {
    if (isQuestInProgress(questId)) {
      return {
        text: "Continue Journey",
        disabled: false,
        action: () => handleContinueQuest(),
        className: "bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
      };
    } else if (isQuestCompleted(questId)) {
      return {
        text: "Travel Again",
        disabled: false,
        action: () => handleStartQuest(questId),
        className: "bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
      };
    } else if (isQuestAvailable(questId)) {
      return {
        text: "Begin Adventure",
        disabled: false,
        action: () => handleStartQuest(questId),
        className: "bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center gap-2"
      };
    } else {
      return {
        text: "Path Blocked",
        disabled: true,
        action: () => {},
        className: "bg-gray-400 text-white cursor-not-allowed flex items-center justify-center gap-2"
      };
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-amber-50 relative">
      {/* Background texture - faded old map with subtle pattern */}
      <div 
        className="absolute inset-0 z-0 bg-amber-50"
        style={{
          backgroundImage: `
            radial-gradient(circle, transparent 20%, rgba(246, 224, 194, 0.6) 20%, rgba(246, 224, 194, 0.6) 80%, transparent 80%, transparent),
            radial-gradient(circle, transparent 20%, rgba(246, 224, 194, 0.6) 20%, rgba(246, 224, 194, 0.6) 80%, transparent 80%, transparent)
          `,
          backgroundPosition: `0 0, 50px 50px`,
          backgroundSize: `100px 100px`,
          opacity: 0.3
        }}
      ></div>
      
      {/* Subtle paper texture overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      ></div>
      
      <div className="z-10 text-center mb-8 bg-amber-100/80 p-5 rounded-lg border-2 border-amber-900/20 shadow-md backdrop-blur-sm">
        <h1 className="text-3xl font-heading text-amber-900 mb-2">The Journey Ahead</h1>
        <p className="text-amber-800 font-accent">Follow the path on this ancient map to discover your destiny</p>
      </div>

      {/* Journey path with quest stops */}
      <div className="w-full max-w-4xl z-10 relative mx-auto">
        {/* The zigzag path - slightly away from cards */}
        <div className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-amber-800/30 transform -translate-x-1/2 z-0 hidden md:block"></div>
        
        {/* Dotted path for mobile view - moved further left */}
        <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 border-l border-dashed border-amber-800/30 z-0"></div>
        
        <div className="space-y-28 relative"> {/* Increased vertical spacing between quests */}
          {quests.map((quest, index) => {
            const buttonProps = getQuestButtonProps(quest.id);
            const questState = gameState.quests.available.find(q => q.id === quest.id);
            const isEven = index % 2 === 0;
            
            // Different positions for desktop zigzag effect - added more spacing from central line
            const positionClasses = isEven 
              ? "md:ml-auto md:mr-12 md:text-right" 
              : "md:mr-auto md:ml-12 md:text-left";
            
            return (
              <div 
                key={quest.id} 
                className={`flex flex-col relative ${positionClasses} w-full md:w-[calc(50%-4rem)] transition-all duration-300`}
              >
                {/* The connection line from card to center path - horizontal connector */}
                <div className="hidden md:block absolute top-12 h-0.5 bg-amber-800/30 z-10" 
                     style={{ 
                       width: isEven ? '12%' : '12%', 
                       left: isEven ? 'auto' : '0', 
                       right: isEven ? '0' : 'auto' 
                     }}>
                </div>
                
                {/* Circle marker right on top of the path */}
                <div className="hidden md:block absolute top-12 w-4 h-4 rounded-full bg-amber-700 shadow-sm z-30"
                     style={{
                       left: '50%',
                       transform: 'translateX(-50%)',
                       marginLeft: '0'
                     }}>
                </div>
                
                {/* Mobile view circle and connector - positioned on the path */}
                <div className="md:hidden absolute left-4 top-12 w-3 h-3 rounded-full bg-amber-700 shadow-sm z-30" 
                     style={{ transform: 'translateX(-50%)' }}>
                </div>
                <div className="md:hidden absolute top-12 h-0.5 bg-amber-800/30 z-10" 
                     style={{ width: '30px', left: '4px' }}>
                </div>
                
                <Card 
                  className={`overflow-hidden border-2 ${
                    isQuestCompleted(quest.id) 
                      ? "border-green-800/30 bg-green-50/80" 
                      : isQuestInProgress(quest.id) 
                        ? "border-blue-800/30 bg-blue-50/80" 
                        : questState?.status === "locked" 
                          ? "border-gray-400/30 bg-gray-100/80" 
                          : "border-amber-800/30 bg-amber-100/80"
                  } hover:shadow-xl transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-1`}
                >
                  <CardHeader className={`${
                    isQuestCompleted(quest.id) 
                      ? "bg-green-100/60" 
                      : isQuestInProgress(quest.id) 
                        ? "bg-blue-100/60" 
                        : questState?.status === "locked" 
                          ? "bg-gray-200/60" 
                          : "bg-amber-200/60"
                  } pb-2 relative overflow-hidden`}>
                    
                    {/* Map icon in the background */}
                    <div className="absolute right-3 top-3 opacity-10 text-amber-900">
                      <span className="material-icons text-5xl">
                        {isQuestCompleted(quest.id) 
                          ? "check_circle"
                          : isQuestInProgress(quest.id) 
                            ? "explore" 
                            : questState?.status === "locked"
                              ? "lock"
                              : "place"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <CardTitle className={`text-xl font-heading ${
                        isQuestCompleted(quest.id) 
                          ? "text-green-800" 
                          : isQuestInProgress(quest.id) 
                            ? "text-blue-800" 
                            : questState?.status === "locked" 
                              ? "text-gray-500" 
                              : "text-amber-900"
                      }`}>
                        {quest.title}
                      </CardTitle>
                      
                      {isQuestInProgress(quest.id) && (
                        <Badge variant="outline" className="bg-blue-100 border-blue-500 text-blue-800">
                          <span className="material-icons text-xs mr-1">sailing</span> In Progress
                        </Badge>
                      )}
                      {isQuestCompleted(quest.id) && (
                        <Badge variant="outline" className="bg-green-100 border-green-500 text-green-800">
                          <span className="material-icons text-xs mr-1">verified</span> Completed
                        </Badge>
                      )}
                      {!isQuestInProgress(quest.id) && !isQuestCompleted(quest.id) && questState?.status === "locked" && (
                        <Badge variant="outline" className="bg-gray-200 border-gray-400 text-gray-600">
                          <span className="material-icons text-xs mr-1">lock</span> Locked
                        </Badge>
                      )}
                    </div>
                    
                    <CardDescription className={`mt-1 ${
                      isQuestCompleted(quest.id) 
                        ? "text-green-700" 
                        : isQuestInProgress(quest.id) 
                          ? "text-blue-700" 
                          : questState?.status === "locked" 
                            ? "text-gray-500" 
                            : "text-amber-800"
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="material-icons text-sm mr-1">fitness_center</span>
                          <span>Level {quest.recommendedLevel}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="material-icons text-sm mr-1">hourglass_bottom</span>
                          <span>{quest.estimatedTime}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="py-4">
                    <p className={`mb-4 ${
                      isQuestCompleted(quest.id) 
                        ? "text-green-800" 
                        : isQuestInProgress(quest.id) 
                          ? "text-blue-800" 
                          : questState?.status === "locked" 
                            ? "text-gray-500" 
                            : "text-amber-900"
                    }`}>
                      {quest.description}
                    </p>
                    
                    {questState?.status === "locked" && quest.requiredQuestTitle && (
                      <div className="bg-amber-50 rounded p-3 text-sm mb-2 border border-amber-200">
                        <div className="flex items-center text-amber-800">
                          <span className="material-icons text-amber-600 mr-2">route</span>
                          <span>You must complete "{quest.requiredQuestTitle}" before traveling here</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className={`pt-2 ${
                    isQuestCompleted(quest.id) 
                      ? "bg-green-100/40" 
                      : isQuestInProgress(quest.id) 
                        ? "bg-blue-100/40" 
                        : questState?.status === "locked" 
                          ? "bg-gray-100/40" 
                          : "bg-amber-100/40"
                  }`}>
                    <Button 
                      className={`w-full ${buttonProps.className} ${
                        questState?.status === "locked" ? "" : "hover:shadow-lg transition-shadow"
                      }`}
                      disabled={buttonProps.disabled}
                      onClick={buttonProps.action}
                    >
                      <span className="material-icons text-base">
                        {isQuestCompleted(quest.id) 
                          ? "replay"
                          : isQuestInProgress(quest.id) 
                            ? "directions_boat" 
                            : questState?.status === "locked"
                              ? "block"
                              : "hiking"}
                      </span>
                      {buttonProps.text}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-12 mb-8 z-10">
        <Button 
          variant="outline"
          onClick={() => navigate("/")}
          className="border-amber-900 text-amber-900 hover:bg-amber-100"
        >
          <span className="material-icons mr-2 text-base">arrow_back</span>
          Return to Camp
        </Button>
      </div>
    </div>
  );
}