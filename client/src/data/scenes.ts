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
        imageName: "camp_half_blood_entrance",
        dialogue: "Welcome to Camp Half-Blood, a safe haven for demigods like yourself. I am Chiron, activities director here at camp.",
        narration: "Chiron, a centaur with a kind face, approaches you as you cross the camp boundary."
      },
      {
        imageDescription: "Thunder crackling in the sky above Camp Half-Blood",
        imageName: "thunderstorm",
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
        imageName: "campfire_gathering",
        dialogue: "Young heroes, we need a brave volunteer to undertake a quest to find the lightning bolt and return it to Zeus before the summer solstice.",
        narration: "The flames of the campfire seem to grow higher as Chiron speaks, casting long shadows across the faces of the gathered demigods."
      },
      {
        imageDescription: "Close up of the player character looking determined",
        imageName: "player_determined",
        dialogue: "I'll accept this quest. The peace between the gods must be preserved.",
        narration: "Your fellow campers look at you with a mixture of relief and concern. This is a dangerous mission, but someone has to do it."
      },
      {
        imageDescription: "Chiron smiling with pride at the player",
        imageName: "chiron_proud",
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
    imageName: "oracle_delphi",
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
    imageName: "crossroads",
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
    imageName: "stone_door",
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
    imageName: "minotaur_appearance",
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
    victoryImageName: "minotaur_victory",
    victoryText: "You've defeated the Minotaur! As it crumbles to dust, you notice something gleaming on the ground.",
    defeatImageDescription: "The player being knocked down by the Minotaur",
    defeatImageName: "minotaur_defeat",
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
        imageName: "underworld_entrance",
        dialogue: "This is it - the entrance to the Underworld. Hades will know who took the lightning bolt.",
        narration: "The air feels unnaturally cold, and a sense of dread washes over you as you approach the entrance."
      },
      {
        imageDescription: "Charon the ferryman waiting by the River Styx",
        imageName: "charon_ferryman",
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
    imageName: "hades_throne",
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
        imageName: "camp_infirmary",
        dialogue: "You were lucky to escape with your lives. The Minotaur is one of the most dangerous creatures in Greek mythology.",
        narration: "Chiron tends to your wounds while explaining that you'll need to rest before trying again."
      },
      {
        imageDescription: "Annabeth showing a map with an alternative route",
        imageName: "annabeth_map",
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
        imageName: "hades_surprised",
        dialogue: "My helm of darkness! It's gone! I've been robbed as well!",
        narration: "Hades' face contorts with rage as blue flames erupt around him."
      },
      {
        imageDescription: "The player and friends backing away from the angry god",
        imageName: "friends_backing_away",
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
        imageName: "luke_betrayal",
        dialogue: "I see you've made it out of the Underworld. Impressive for a novice.",
        narration: "Luke, son of Hermes, stands before you with a familiar gleam in his hand - Zeus's lightning bolt."
      },
      {
        imageDescription: "Close-up of Luke's face with a scar and bitter expression",
        imageName: "luke_closeup",
        dialogue: "The gods have ruled for too long. It's time for a new age. Kronos is rising, and I serve him now.",
        narration: "You suddenly understand that Luke was the thief all along, working to start a war between the gods."
      },
      {
        imageDescription: "Luke summoning monsters from the ground",
        imageName: "luke_summoning",
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
    imageName: "luke_ready",
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
    victoryImageName: "victory_lightning_bolt",
    victoryText: "You've defeated the monsters! Luke has fled, but dropped the lightning bolt in his haste. The quest is nearly complete - you must return to Olympus!",
    defeatImageDescription: "The player collapsed on the sand as the scorpion looms over them",
    defeatImageName: "defeat_scorpion",
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
    defeatScene: ""
  },
  
  {
    id: "olympus-return",
    type: "story",
    title: "Return to Olympus",
    questId: 1,
    panels: [
      {
        imageDescription: "The player ascending to Mount Olympus through magical elevator",
        imageName: "olympus_elevator",
        dialogue: "It's the summer solstice. We've made it just in time.",
        narration: "The magical elevator in the Empire State Building rises to the 600th floor, taking you to Mount Olympus."
      },
      {
        imageDescription: "The grand throne room of the gods with Zeus sitting on his central throne",
        imageName: "zeus_throne",
        dialogue: "So, young demigod, you claim my brother's son is innocent of the theft?",
        narration: "Zeus's voice booms throughout the hall as all the Olympian gods watch you intently."
      },
      {
        imageDescription: "The player kneeling before Zeus and presenting the lightning bolt",
        imageName: "player_kneeling",
        dialogue: "It was Luke, son of Hermes, who stole both your bolt and Hades' helm. He serves Kronos now.",
        narration: "A murmur runs through the gods as you mention the name of the fallen Titan lord."
      },
      {
        imageDescription: "Zeus raising the bolt, causing thunder to boom across the sky",
        imageName: "zeus_lightning",
        dialogue: "You have done Olympus a great service. For now, at least, war is averted.",
        narration: "Zeus accepts the bolt, and electricity courses through the air as he reclaims his symbol of power."
      }
    ],
    nextScene: "end"
  },
  
    // STORY - Arriving at Camp Half-Blood after attack
    {
      id: "sea-of-monsters-intro",
      type: "story",
      title: "The Sea of Monsters - Camp Under Siege",
      questId: 2,
      panels: [
        {
          imageDescription: "Camp Half-Blood borders smoldering, smoke in the air",
          dialogue: "Camp's magical borders have been broken. Something terrible is happening.",
          narration: "You rush to Camp Half-Blood only to find chaos and destruction. Trees are burning and satyrs are injured."
        },
        {
          imageDescription: "Colchis Bull stomping into the clearing with fire trailing its steps",
          dialogue: "It’s a Colchis Bull! Everyone get back!",
          narration: "The ground shakes as the massive metal creature charges through, flames licking its bronze hide."
        }
      ],
      nextScene: "colchis-bull-battle"
    },

    // BATTLE - Colchis Bull
    {
      id: "colchis-bull-battle",
      type: "battle",
      title: "Battle with the Colchis Bull",
      questId: 2,
      imageDescription: "The Colchis Bull breathing fire as campers prepare to fight",
      introText: "The Colchis Bull is tearing through Camp! You must help stop it before it destroys everything!",
      enemy: {
        name: "Colchis Bull",
        level: 4,
        health: 120,
        baseDamage: 25,
        initialRage: 30,
        description: "A fire-breathing mechanical bull crafted by Hephaestus. Extremely tough and dangerous."
      },
      victoryImageDescription: "The bull crumbling into molten metal",
      victoryText: "You've defeated the Colchis Bull! The camp is saved, but the damage is great.",
      defeatImageDescription: "The bull knocks the player back, fire everywhere",
      defeatText: "You’re overwhelmed, but Tyson jumps in to save you at the last second. The bull retreats.",
      rewards: {
        drachmas: 10,
        xp: 70,
        items: [
          {
            id: "bull-gear",
            name: "Molten Bull Gear",
            description: "Still warm from the Colchis Bull's body. Could be useful later.",
            type: "collectible"
          }
        ]
      },
      victoryScene: "chiron-explains-fleece",
      defeatScene: "chiron-explains-fleece"
    },

    // STORY - Chiron explains about the Fleece
    {
      id: "chiron-explains-fleece",
      type: "story",
      title: "The Golden Fleece",
      questId: 2,
      panels: [
        {
          imageDescription: "Campers gathered around Chiron in the Big House",
          dialogue: "The borders failed because Thalia’s tree is dying. Only the Golden Fleece can save it.",
          narration: "Chiron’s voice is grim. You’ve never seen him so worried."
        },
        {
          imageDescription: "Map showing the Sea of Monsters",
          dialogue: "The Fleece is located on Polyphemus’s island in the Sea of Monsters. You must retrieve it.",
          narration: "The quest is dangerous, but necessary. If the Fleece isn’t recovered, the camp is doomed."
        }
      ],
      nextScene: "ship-departure"
    },

    // STORY - Setting out on the Quest
    {
      id: "ship-departure",
      type: "story",
      title: "Journey Begins",
      questId: 2,
      panels: [
        {
          imageDescription: "The Princess Andromeda ship at sea",
          dialogue: "This ship belongs to Luke. Be careful. He’s up to something.",
          narration: "The journey begins, but trouble is already brewing beneath the surface."
        }
      ],
      nextScene: "sirens-choice"
    },

    // DECISION - Sirens or Hydra
    {
      id: "sirens-choice",
      type: "decision",
      title: "A Fork in the Ocean",
      questId: 2,
      imageDescription: "The ocean ahead splitting into two currents",
      dialogue: "One way leads past the Sirens. The other past the Hydra.",
      narration: "Annabeth and Tyson argue over which path is safer.",
      followupDialogue: "You must choose quickly. The currents are strong.",
      choices: [
        {
          id: "sirens",
          title: "Face the Sirens",
          description: "Temptation lies ahead. But so might knowledge.",
          hint: "Puzzle-focused path.",
          nextScene: "sirens-riddle"
        },
        {
          id: "hydra",
          title: "Face the Hydra",
          description: "A deadly multi-headed beast awaits.",
          hint: "Combat-focused path.",
          nextScene: "hydra-battle"
        }
      ],
      defaultNextScene: "sirens-riddle"
    },

    // PUZZLE - Sirens Riddle
    {
      id: "sirens-riddle",
      type: "puzzle",
      title: "Lure of the Sirens",
      questId: 2,
      imageDescription: "Beautiful Sirens singing on rocky shores",
      riddle: "I whisper truths, reveal your fate,\nBut listen close and risk the gate.\nWhat am I?",
      hint: "Temptation can be dangerous.",
      correctAnswer: "sirensong",
      successMessage: "You resist their call and uncover a clue to Polyphemus’s lair.",
      failureMessage: "You almost drown but are rescued in time. You lose precious time.",
      successScene: "approach-island",
      failureScene: "approach-island"
    },

    // BATTLE - Hydra
    {
      id: "hydra-battle",
      type: "battle",
      title: "Hydra Battle",
      questId: 2,
      imageDescription: "The Hydra rising from the sea with many heads",
      introText: "A monstrous Hydra blocks your path. Every head you cut grows back two more!",
      enemy: {
        name: "Hydra",
        level: 5,
        health: 140,
        baseDamage: 18,
        initialRage: 25,
        description: "A regenerating sea monster. It requires strategy to defeat."
      },
      victoryImageDescription: "Hydra collapsing into the sea",
      victoryText: "The Hydra sinks beneath the waves. You move on toward the island.",
      defeatImageDescription: "Player caught by Hydra tendrils",
      defeatText: "You’re knocked out but saved by Tyson. You continue, shaken but alive.",
      rewards: {
        drachmas: 15,
        xp: 80,
        items: [
          {
            id: "hydra-scale",
            name: "Hydra Scale",
            description: "A rare scale from the sea beast. Magical properties unknown.",
            type: "collectible"
          }
        ]
      },
      victoryScene: "approach-island",
      defeatScene: "approach-island"
    },

    // STORY - Nearing Polyphemus’s Island
    {
      id: "approach-island",
      type: "story",
      title: "The Island of the Cyclops",
      questId: 2,
      panels: [
        {
          imageDescription: "The island in the distance with storm clouds above",
          dialogue: "That’s it. Polyphemus’s island. The Fleece is in there.",
          narration: "You feel a chill as the island looms closer. The final challenge awaits."
        }
      ],
      nextScene: "polyphemus-battle"
    },

    // BATTLE - Polyphemus
    {
      id: "polyphemus-battle",
      type: "battle",
      title: "Battle with Polyphemus",
      questId: 2,
      imageDescription: "Polyphemus stomping through jungle, holding a tree as a club",
      introText: "The Cyclops roars in fury. He guards the Fleece with everything he’s got.",
      enemy: {
        name: "Polyphemus",
        level: 6,
        health: 150,
        baseDamage: 30,
        initialRage: 20,
        description: "A huge and cunning Cyclops. Not easy to beat with brute strength alone."
      },
      victoryImageDescription: "Polyphemus falling backward, stunned",
      victoryText: "Polyphemus collapses! You snatch the Golden Fleece from its perch.",
      defeatImageDescription: "Polyphemus roaring triumphantly with the player pinned",
      defeatText: "You’re captured, but Grover deceives Polyphemus with a trick. You escape with the Fleece!",
      rewards: {
        drachmas: 20,
        xp: 120,
        items: [
          {
            id: "golden-fleece",
            name: "Golden Fleece",
            description: "Glows with healing energy. The only hope to save Camp Half-Blood.",
            type: "quest-item"
          }
        ]
      },
      victoryScene: "fleece-return",
      defeatScene: "fleece-return"
    },

    // STORY - Return with the Fleece
    {
      id: "fleece-return",
      type: "story",
      title: "Return of the Fleece",
      questId: 2,
      panels: [
        {
          imageDescription: "Thalia’s tree glowing as the Fleece is placed on it",
          dialogue: "It’s working. The magic is restoring the tree!",
          narration: "The air shimmers as the power of the Fleece pulses through Camp Half-Blood."
        }
      ],
      nextScene: "thalia-awakens"
    },

    // STORY - Thalia Awakens
    {
      id: "thalia-awakens",
      type: "story",
      title: "Daughter of Zeus",
      questId: 2,
      panels: [
        {
          imageDescription: "A bolt of lightning striking the tree",
          dialogue: "What just happened?!",
          narration: "A shape steps out of the lightning. It’s a girl about your age with fierce eyes."
        },
        {
          imageDescription: "Thalia standing tall under the branches",
          dialogue: "I’m... Thalia. What year is it?",
          narration: "Zeus’s daughter, once turned into a tree, has returned. The prophecy just changed."
        }
      ],
      nextScene: "titan-curse-tease"
    },

    // CLIFFHANGER - Tease Titan's Curse
    {
      id: "titan-curse-tease",
      type: "story",
      title: "A New Prophecy",
      questId: 2,
      panels: [
        {
          imageDescription: "Oracle’s eyes glowing green",
          dialogue: "The prophecy has shifted. Two children of the Big Three now stand.",
          narration: "The Oracle speaks cryptically. You realize the war isn’t over—it’s just beginning."
        },
        {
          imageDescription: "A dark figure in the shadows holding a scythe",
          dialogue: "Kronos stirs...",
          narration: "Somewhere far away, the Titan Lord opens a single glowing eye."
        }
      ],
      nextScene: "end"
    }
];

export default scenes;
