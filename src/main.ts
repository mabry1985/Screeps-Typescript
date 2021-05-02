import { ErrorMapper } from "utils/ErrorMapper";
import { CreepBrain } from "CreepBrain";
import {
  clearOldNames,
  spawnVisualizer,
  placeExtensions,
  checkForRoad,
  calculateBodyPartsCost,
  setCreepCount,
  spawnCreep
} from "./utils/utils";
import "memory";

const manageSpawners = () => {
  Object.entries(Game.spawns).forEach((entry: any) => {
    spawnVisualizer(entry[0]);
    placeExtensions(entry[0]);
  });
};

const runCreeps = () => {
  Object.keys(Game.creeps).forEach(name => {
    const creep = new CreepBrain(Game.creeps[name]);
    creep.run();
  });
};

const manageCreeps = (name: string) => {
  if (!Game.rooms[name].controller) return;

  const era = Game.rooms[name].memory.era;

  Object.entries(Memory.creepRoles).forEach(entry => {
    const harvester: Role = Memory.creepRoles["harvester"];
    const [type, role] = entry;
    role.cost = calculateBodyPartsCost(role.bodyParts[era]);
    if (role.cost <= Game.rooms[name].energyAvailable) {
      role.currentAmount = setCreepCount(type);
      if (harvester.currentAmount < harvester.maxAmount[era]) {
        spawnCreep(harvester, "harvester", era!, name);
      } else if (role.currentAmount < role.maxAmount[era]) {
        spawnCreep(role, type, era!, name);
      }
    }
  });
};

const manageEra = (roomName: string): number => {
  const room = Game.rooms[roomName];
  const maxCapacity = room.energyCapacityAvailable;
  const controllerLevel = room.controller?.level;
  let era = 0

  if (controllerLevel === 2) {
    era = 1;
  } else if (controllerLevel === 3 || maxCapacity >= 550) {
    era = 2
  } else if (controllerLevel === 4 || maxCapacity >= 700) {
    era = 3
  }

  return era
};

const main = () => {

  manageSpawners();
  Object.entries(Game.rooms).forEach(r => {
    const roomName = r[0]
    const room = r[1]
    room.memory.era = manageEra(roomName);

    // sets timer and tracks time in room memory to place functions that need to run infrequently
    room.memory.timer = 300
    if (!room.memory.timeStamp || (Game.time - room.memory.timeStamp) > room.memory.timer) {
      room.memory.timeStamp = Game.time
      clearOldNames();
    }
    checkForRoad(roomName);
    manageCreeps(roomName);
  });
  runCreeps();
};

export const loop = ErrorMapper.wrapLoop(() => {
  main();
});
