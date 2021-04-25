import { ErrorMapper } from "utils/ErrorMapper";
import { roleHarvester } from "./role.harvester";
import { roleUpgrader } from "./role.upgrader";
import { roleBuilder } from "./role.builder";
import { roleRepairer } from "./role.repairer";
import 'memory';

const clearOldNames = (): void => {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep from memory:", name);
    }
  }
};

const creepCount = (role: Role): number => {
  const creeps = _.filter(Game.creeps, creep => creep.memory.role === role.name);
  role.currentAmount = creeps.length;
  return creeps.length
};

const spawnCreep = (role: Role) => {
  if (creepCount(role) < role.maxAmount) {
    const newName = `${_.capitalize(role.name)} ${Game.time}`;
    console.log(`Spawning new ${role.name}: ${newName}`);
    try {
      Game.spawns["Spawn1"].spawnCreep(role.bodyParts, newName, {
        memory: { role: role.name, working: false, room: Room.name }
      });
    } catch(err) {
      console.error(err)
    }
  }
};

const calculateBodyPartsCost = (partsArr: BodyPartConstant[]): number => {
  let total = 0
  for (const [key, value] of bodyPartCostMap) {
    partsArr.map((part: BodyPartConstant) => {
      if (part === key) total += value;
    } )
  }
  return total
}

const bodyPartCostMap = new Map([
  [MOVE, 50],
  [WORK, 100],
  [CARRY, 50],
  [ATTACK, 80],
  [RANGED_ATTACK, 150],
  [HEAL, 250],
  [CLAIM, 600],
  [TOUGH, 10],
])

export const loop = ErrorMapper.wrapLoop(() => {
  clearOldNames();
  for (const name in Game.rooms) {
    for (const role in Memory.state.creepRoles) {
      const r = Memory.state.creepRoles[role];
      r.cost = calculateBodyPartsCost(r.bodyParts)
      if (r.cost < Game.rooms[name].energyAvailable) spawnCreep(r)
    }
  }

  if (Game.spawns["Spawn1"].spawning) {
    const spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    switch (creep.memory.role) {
      case "harvester":
        roleHarvester.run(creep);
        break;
      case "upgrader":
        roleUpgrader.run(creep);
        break;
      case "builder":
        roleBuilder.run(creep);
        break;
      case "repairer":
        roleRepairer.run(creep);
        break;
      default:
        break;
    }
  }
});

// TODO break down role files into functions to extract to a base class
