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
        text: "Continue Quest",
        disabled: false,
        action: () => handleContinueQuest(),
        className: "bg-accent hover:bg-accent/90 text-white"
      };
    } else if (isQuestCompleted(questId)) {
      return {
        text: "Completed",
        disabled: true,
        action: () => {},
        className: "bg-secondary/70 text-white cursor-not-allowed"
      };
    } else if (isQuestAvailable(questId)) {
      return {
        text: "Start Quest",
        disabled: false,
        action: () => handleStartQuest(questId),
        className: "bg-primary hover:bg-primary/90 text-white"
      };
    } else {
      return {
        text: "Locked",
        disabled: true,
        action: () => {},
        className: "bg-gray-400 text-white cursor-not-allowed"
      };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading text-primary mb-2">Quests at Camp Half-Blood</h1>
        <p className="text-stone font-accent">Choose your next adventure from the available quests below</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => {
          const buttonProps = getQuestButtonProps(quest.id);
          const questState = gameState.quests.available.find(q => q.id === quest.id);
          
          return (
            <Card key={quest.id} className="overflow-hidden border-2 border-stone/20 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-heading text-primary">{quest.title}</CardTitle>
                  {isQuestInProgress(quest.id) && (
                    <Badge variant="outline" className="bg-accent/20 border-accent text-accent">
                      In Progress
                    </Badge>
                  )}
                  {isQuestCompleted(quest.id) && (
                    <Badge variant="outline" className="bg-secondary/20 border-secondary text-secondary">
                      Completed
                    </Badge>
                  )}
                  {!isQuestInProgress(quest.id) && !isQuestCompleted(quest.id) && questState?.status === "locked" && (
                    <Badge variant="outline" className="bg-gray-200 border-gray-400 text-gray-600">
                      Locked
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-stone mt-1">
                  Recommended Level: {quest.recommendedLevel} | Time: {quest.estimatedTime}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="py-4">
                <p className="text-stone mb-4">{quest.description}</p>
                
                {questState?.status === "locked" && quest.requiredQuestTitle && (
                  <div className="bg-stone/10 rounded p-2 text-sm mb-2">
                    <span className="material-icons text-warning inline-block mr-1" style={{ fontSize: "16px" }}>lock</span>
                    <span>Complete "{quest.requiredQuestTitle}" to unlock</span>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="bg-stone/5 pt-2">
                <Button 
                  className={`w-full ${buttonProps.className}`}
                  disabled={buttonProps.disabled}
                  onClick={buttonProps.action}
                >
                  {buttonProps.text}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button 
          variant="outline"
          onClick={() => navigate("/")}
          className="border-primary text-primary"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}