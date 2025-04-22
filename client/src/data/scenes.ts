const scenes = [
  // STORY SCENES
  {
    id: "lightning-thief-intro",
    type: "story",
    title: "The Lightning Thief - Chapter 1",
    questId: 1,
    panels: [
      {
        imageDescription: "Camp Half-Blood entrance with Chiron greeting new campers",
        dialogue: "Welcome to Camp Half-Blood, a safe haven for demigods like yourself. I am Chiron, activities director here at camp.",
        narration: "Chiron, a centaur with a kind face, approaches you as you cross the camp boundary."
      },
      {
        imageDescription: "Thunder crackling in the sky above Camp Half-Blood",
        dialogue: "I'm afraid you've arrived at a troubled time. Zeus's master lightning bolt has been stolen, and he blames Poseidon's offspring. War among the gods is brewing.",
        narration: "Thunder rumbles ominously in the distance, despite the clear sky."
      }
    ],
    nextScene: "lightning-thief-quest-announcement"
  },
  {
    id: "lightning-thief-quest-announcement",
    type: "story",
    title: "The Lightning Thief - The Quest",
    questId: 1,
    panels: [
      {
        imageDescription: "Campers gathered around campfire, with Chiron standing before them",
        dialogue: "Young heroes, we need a brave volunteer to undertake a quest to find the lightning bolt and return it to Zeus before the summer solstice.",
        narration: "The flames of the campfire seem to grow higher as Chiron speaks, casting long shadows across the faces of the gathered demigods."
      },
      {
        imageDescription: "Close up of the player character looking determined",
        dialogue: "I'll accept this quest. The peace between the gods must be preserved.",
        narration: "Your fellow campers look at you with a mixture of relief and concern. This is a dangerous mission, but someone has to do it."
      },
      {
        imageDescription: "Chiron smiling with pride at the player",
        dialogue: "Very well. You should consult the Oracle before you leave. She resides in the attic of the Big House.",
        narration: "Chiron places a hand on your shoulder, his eyes conveying both pride and worry."
      }
    ],
    nextScene: "oracle-riddle"
  },
  
  // PUZZLE SCENE
  {
    id: "oracle-riddle",
    type: "puzzle",
    title: "The Oracle's Riddle",
    questId: 1,
    imageDescription: "The Oracle of Delphi shrouded in mysterious green mist",
    riddle: "I am the son of sea and shore, \nYet never wet behind my door. \nI hold the strength of ocean's roar, \nYet stay on land forevermore. \nWhat am I?",
    hint: "Think about what creatures might be connected to Poseidon but live on land.",
    correctAnswer: "cyclops",
    successMessage: "The Oracle nods approvingly. 'Seek the Cyclops in the west. He knows of the bolt's theft.'",
    failureMessage: "The Oracle frowns. 'Perhaps another path would serve you better...'",
    successScene: "journey-west-decision",
    failureScene: "journey-west-decision"
  },
  
  // DECISION SCENE
  {
    id: "journey-west-decision",
    type: "decision",
    title: "A Fateful Decision",
    questId: 1,
    imageDescription: "A crossroads with Annabeth pointing to different paths",
    dialogue: "We need to find the entrance to the Underworld. There are two possible routes from here.",
    narration: "She points to a dark tunnel on your left and a dangerous mountain path on your right.",
    followupDialogue: "Which way should we go? We don't have time to try both.",
    choices: [
      {
        id: "tunnel",
        title: "Take the Dark Tunnel",
        description: "It looks treacherous, but might be a direct route to the Underworld. Grover mentions detecting strange scents down there.",
        hint: "You sense this path will test your puzzle-solving abilities.",
        nextScene: "tunnel-riddle"
      },
      {
        id: "mountain",
        title: "Climb the Mountain Path",
        description: "It's exposed and dangerous, but Annabeth thinks she remembers this route from old legends. It might lead to a back entrance.",
        hint: "This path likely involves combat with creatures guarding the way.",
        nextScene: "minotaur-battle"
      }
    ],
    defaultNextScene: "tunnel-riddle"
  },
  
  // ANOTHER PUZZLE
  {
    id: "tunnel-riddle",
    type: "puzzle",
    title: "The Guardian's Test",
    questId: 1,
    imageDescription: "A stone door with ancient Greek inscriptions glowing faintly",
    riddle: "To pass this gate of ancient stone,\nThree words you seek, but speak as one.\nFirst, what falls but never breaks?\nSecond, what breaks but never falls?\nThird, what's always old but newly born each day?",
    hint: "Think of things in nature that follow these patterns.",
    correctAnswer: "night day dawn",
    successMessage: "The door rumbles and slides open, revealing a passage deeper into the mountain.",
    failureMessage: "The door remains shut, and you hear distant growling from behind you...",
    successScene: "underworld-entrance",
    failureScene: "minotaur-battle"
  },
  
  // BATTLE SCENE
  {
    id: "minotaur-battle",
    type: "battle",
    title: "Battle with the Minotaur",
    questId: 1,
    imageDescription: "The Minotaur appears, blocking your path in a dark labyrinth",
    introText: "The ground shakes as the Minotaur emerges from the shadows. Its massive form blocks your path, and there's no way around it. You must fight!",
    enemy: {
      name: "Minotaur",
      level: 3,
      health: 100,
      baseDamage: 15,
      initialRage: 20,
      description: "A fearsome creature with the head of a bull and the body of a man. It's incredibly strong but not very agile."
    },
    victoryImageDescription: "Victory scene with defeated Minotaur",
    victoryText: "You've defeated the Minotaur! As it crumbles to dust, you notice something gleaming on the ground.",
    defeatImageDescription: "The player being knocked down by the Minotaur",
    defeatText: "The Minotaur overpowers you, but Annabeth creates a diversion allowing you to escape. You've lost valuable time and resources.",
    rewards: {
      drachmas: 5,
      xp: 50,
      items: [
        {
          id: "minotaur-horn",
          name: "Minotaur Horn",
          description: "A trophy from your victory over the Minotaur. Perhaps it has some use?",
          type: "collectible"
        }
      ]
    },
    victoryScene: "underworld-entrance",
    defeatScene: "recovery-camp"
  },
  
  // STORY SCENE
  {
    id: "underworld-entrance",
    type: "story",
    title: "The Gates of the Underworld",
    questId: 1,
    panels: [
      {
        imageDescription: "A dark cavern entrance with ghostly wisps of fog flowing outward",
        dialogue: "This is it - the entrance to the Underworld. Hades will know who took the lightning bolt.",
        narration: "The air feels unnaturally cold, and a sense of dread washes over you as you approach the entrance."
      },
      {
        imageDescription: "Charon the ferryman waiting by the River Styx",
        dialogue: "The living do not cross these waters without payment. Each soul must pay one coin to the ferryman.",
        narration: "Charon eyes your group expectantly, his skeletal hand outstretched."
      }
    ],
    nextScene: "hades-confrontation"
  },
  
  // DECISION SCENE
  {
    id: "hades-confrontation",
    type: "decision",
    title: "Confronting the Lord of the Dead",
    questId: 1,
    imageDescription: "Hades on his throne of bones, surrounded by darkness and blue flames",
    dialogue: "So, the children of the Olympians come to accuse me of theft? Why would I want war? I have enough subjects already.",
    narration: "Hades' voice echoes throughout the cavernous throne room, causing small rocks to crumble from the ceiling.",
    followupDialogue: "But since you're here, perhaps we can make a deal. Your mother's soul for information about the bolt.",
    choices: [
      {
        id: "accept-deal",
        title: "Accept Hades' Deal",
        description: "Give up your quest in exchange for your mother's freedom. Hades claims he knows who the real thief is.",
        hint: "This path prioritizes family over the greater mission.",
        nextScene: "betrayal-revealed"
      },
      {
        id: "refuse-deal",
        title: "Refuse the Deal",
        description: "Your quest is too important. War between the gods would cause countless deaths. There must be another way.",
        hint: "Standing firm might reveal more about the situation.",
        nextScene: "helmet-discovery"
      }
    ],
    defaultNextScene: "betrayal-revealed"
  },
  
  // Story scene for recovery at camp (failure path)
  {
    id: "recovery-camp",
    type: "story",
    title: "Recovery at Camp",
    questId: 1,
    panels: [
      {
        imageDescription: "The infirmary at Camp Half-Blood with the player resting in bed",
        dialogue: "You were lucky to escape with your lives. The Minotaur is one of the most dangerous creatures in Greek mythology.",
        narration: "Chiron tends to your wounds while explaining that you'll need to rest before trying again."
      },
      {
        imageDescription: "Annabeth showing a map with an alternative route",
        dialogue: "I've been studying the maps. There's another way we can try to reach the Underworld, but we'll need to move quickly.",
        narration: "The deadline of the summer solstice is drawing closer. You don't have much time left."
      }
    ],
    nextScene: "underworld-entrance"
  },
  
  // More scenes would be defined for the rest of the quest...
  {
    id: "helmet-discovery",
    type: "story",
    title: "A Hidden Truth",
    questId: 1,
    panels: [
      {
        imageDescription: "Hades looking surprised as he searches his throne area",
        dialogue: "My helm of darkness! It's gone! I've been robbed as well!",
        narration: "Hades' face contorts with rage as blue flames erupt around him."
      },
      {
        imageDescription: "The player and friends backing away from the angry god",
        dialogue: "Someone has stolen from both Zeus and me. Find my helm along with the bolt, and I will release your mother.",
        narration: "You realize there's a bigger conspiracy at work than you initially thought."
      }
    ],
    nextScene: "beach-battle"
  },
  
  {
    id: "betrayal-revealed",
    type: "story",
    title: "The True Thief",
    questId: 1,
    panels: [
      {
        imageDescription: "Luke standing on a beach with a lightning bolt in hand",
        dialogue: "I see you've made it out of the Underworld. Impressive for a novice.",
        narration: "Luke, son of Hermes, stands before you with a familiar gleam in his hand - Zeus's lightning bolt."
      },
      {
        imageDescription: "Close-up of Luke's face with a scar and bitter expression",
        dialogue: "The gods have ruled for too long. It's time for a new age. Kronos is rising, and I serve him now.",
        narration: "You suddenly understand that Luke was the thief all along, working to start a war between the gods."
      },
      {
        imageDescription: "Luke summoning monsters from the ground",
        dialogue: "I can't let you return that bolt to Olympus. Sorry, old friend.",
        narration: "Luke raises his hand, and the ground begins to shake as monsters emerge."
      }
    ],
    nextScene: "beach-battle"
  },
  
  {
    id: "beach-battle",
    type: "battle",
    title: "Battle at the Beach",
    questId: 1,
    imageDescription: "Luke standing with his sword Backbiter drawn, ready to fight",
    introText: "Luke summons scorpion-like monsters to attack you while he escapes. You must defeat them to recover the bolt!",
    enemy: {
      name: "Pit Scorpion",
      level: 4,
      health: 120,
      baseDamage: 20,
      initialRage: 10,
      description: "A deadly creature from the depths of Tartarus. Its sting contains venom that can kill even a demigod."
    },
    victoryImageDescription: "The player holding the recovered lightning bolt triumphantly",
    victoryText: "You've defeated the monsters! Luke has fled, but dropped the lightning bolt in his haste. The quest is nearly complete - you must return to Olympus!",
    defeatImageDescription: "The player collapsed on the sand as the scorpion looms over them",
    defeatText: "The venom courses through your veins, but Annabeth manages to use some emergency nectar to save you. Luke has escaped with the bolt.",
    rewards: {
      drachmas: 10,
      xp: 100,
      items: [
        {
          id: "lightning-bolt",
          name: "Master Lightning Bolt",
          description: "Zeus's symbol of power. It crackles with immense energy.",
          type: "quest-item"
        }
      ]
    },
    victoryScene: "olympus-return",
    defeatScene: "olympus-return"
  },
  
  {
    id: "olympus-return",
    type: "story",
    title: "Return to Olympus",
    questId: 1,
    panels: [
      {
        imageDescription: "The player ascending to Mount Olympus through magical elevator",
        dialogue: "It's the summer solstice. We've made it just in time.",
        narration: "The magical elevator in the Empire State Building rises to the 600th floor, taking you to Mount Olympus."
      },
      {
        imageDescription: "The grand throne room of the gods with Zeus sitting on his central throne",
        dialogue: "So, young demigod, you claim my brother's son is innocent of the theft?",
        narration: "Zeus's voice booms throughout the hall as all the Olympian gods watch you intently."
      },
      {
        imageDescription: "The player kneeling before Zeus and presenting the lightning bolt",
        dialogue: "It was Luke, son of Hermes, who stole both your bolt and Hades' helm. He serves Kronos now.",
        narration: "A murmur runs through the gods as you mention the name of the fallen Titan lord."
      },
      {
        imageDescription: "Zeus raising the bolt, causing thunder to boom across the sky",
        dialogue: "You have done Olympus a great service. For now, at least, war is averted.",
        narration: "Zeus accepts the bolt, and electricity courses through the air as he reclaims his symbol of power."
      }
    ],
    nextScene: "end"
  }
];

export default scenes;
