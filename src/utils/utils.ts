export const depotStructureFilter = (structure: any) => {
  let bool = false;
  if (structure.store && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    bool = true;
  } else {
    return false;
  }

  switch (structure) {
    case STRUCTURE_SPAWN:
      bool = true;
      break;
    case STRUCTURE_EXTENSION:
      bool = true;
      break;
    case STRUCTURE_CONTAINER:
      bool = true;
      break;
    default:
      break;
  }
  return bool;
};

/**
 * Removes names of dead creeps from memory
 */
export const clearOldNames = (): void => {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing old creep from memory:", name);
    }
  }
};

/**
 * Returns number of creeps from input creep role type
 * @param type creep role type
 * @returns number of creeps
 */
export const setCreepCount = (type: string): number => {
  const creeps = _.filter(Game.creeps, creep => creep.memory.role === type);
  return creeps.length;
};

export const spawnCreep = (
  role: Role,
  type: string,
  era: number,
  roomName: string
) => {
  const newName = `${_.capitalize(type)} ${Game.time}`;
  const buildsRoads = era > 0 && (type === "harvester" || type === "upgrader");
  // console.log(`Spawning new ${type}: ${newName}`);
  const [spawnName] = Object.entries(Game.spawns).filter(
    spawn => spawn[1].pos.roomName === roomName
  )[0];
  Game.spawns[spawnName].spawnCreep(role.bodyParts[era], newName, {
    memory: {
      role: type,
      working: false,
      room: Room.name,
      buildsRoads: buildsRoads
    }
  });
};

/**
 * Attempts to build a road at the POS of each creep with memory.buildRoad set to true
 * @param roomName
 */
export const checkForRoad = (roomName: string) => {
  for (const i in Game.creeps) {
    if (Game.creeps[i].memory.buildsRoads === true) {
      const x = Game.creeps[i].pos.x;
      const y = Game.creeps[i].pos.y;
      Game.rooms[roomName].createConstructionSite(x, y, STRUCTURE_ROAD);
    }
  }
};

export const calculateBodyPartsCost = (
  partsArr: BodyPartConstant[]
): number => {
  let total = 0;
  for (const [key, value] of bodyPartCostMap) {
    partsArr.map((part: BodyPartConstant) => {
      if (part === key) total += value;
    });
  }
  return total;
};

const bodyPartCostMap = new Map([
  [MOVE, 50],
  [WORK, 100],
  [CARRY, 50],
  [ATTACK, 80],
  [RANGED_ATTACK, 150],
  [HEAL, 250],
  [CLAIM, 600],
  [TOUGH, 10]
]);

/**
 * Creates a text box at pos of spawn if spawning a creep
 * @param spawnName name of spawn
 */
export const spawnVisualizer = (spawnName: STRUCTURE_SPAWN) => {
  const spawn = Game.spawns[spawnName];
  if (spawn.spawning) {
    const spawningCreep = Game.creeps[spawn.spawning!.name];
    spawn.room.visual.text(
      "???????" + spawningCreep.memory.role,
      spawn.pos.x + 1,
      spawn.pos.y,
      { align: "left", opacity: 0.8 }
    );
  }
};

/**
 * TODO: Refactor to place extensions using a loop
 * Places extensions in a star shape around placed spawn
 * @param spawnName name of spawn
 */
export const placeExtensions = (spawnName: STRUCTURE_SPAWN) => {
  const spawn = Game.spawns[spawnName];
  const extensions = spawn.room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_EXTENSION
  });
  const extensionConstruct = spawn.room.find(FIND_CONSTRUCTION_SITES, {
    filter: structure => structure.structureType === STRUCTURE_EXTENSION
  });
  if (!extensions.length && !extensionConstruct.length) {
    const x = spawn.pos.x;
    const y = spawn.pos.y;

    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x + 1,
      y + 1,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x - 1,
      y - 1,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x + 2,
      y + 2,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x - 2,
      y - 2,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x - 1,
      y + 1,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x + 1,
      y - 1,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x - 2,
      y + 2,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x + 2,
      y - 2,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x - 3,
      y,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x + 3,
      y,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x,
      y - 3,
      STRUCTURE_EXTENSION
    );
    Game.rooms[spawn.pos.roomName].createConstructionSite(
      x,
      y + 3,
      STRUCTURE_EXTENSION
    );
  }
};
