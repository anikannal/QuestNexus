const quests = [
  {
    id: 1,
    title: "The Lightning Thief",
    description: "Zeus's master lightning bolt has been stolen, and you must help recover it before war breaks out among the gods.",
    recommendedLevel: 1,
    estimatedTime: "20 min",
    icon: "bolt",
    status: "available",
    startingSceneId: "lightning-thief-intro",
    requiredQuestIds: []
  },
  {
    id: 2,
    title: "The Sea of Monsters",
    description: "Camp Half-Blood's protective barriers are failing. You must retrieve the Golden Fleece to restore them.",
    recommendedLevel: 2,
    estimatedTime: "25 min",
    icon: "water",
    status: "locked",
    startingSceneId: "sea-of-monsters-intro",
    requiredQuestIds: [1],
    requiredQuestTitle: "The Lightning Thief"
  },
  {
    id: 3,
    title: "The Titan's Curse",
    description: "Artemis has gone missing. You must find her and free her from the Titan's curse.",
    recommendedLevel: 3,
    estimatedTime: "30 min",
    icon: "hourglass_empty",
    status: "locked",
    startingSceneId: "titans-curse-intro",
    requiredQuestIds: [2],
    requiredQuestTitle: "The Sea of Monsters"
  }
];

export default quests;
