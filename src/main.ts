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
  Object.keys(Game.spawns).forEach((spawnName: any) => {
    spawnVisualizer(spawnName);
    placeExtensions(spawnName);
  });
};

const runCreeps = () => {
  Object.values(Game.creeps).forEach(c => {
    const creep = new CreepBrain(c);
    creep.run();
  });
};

const manageCreeps = (name: string) => {
  if (!Game.rooms[name].controller) return;

  const era = Game.rooms[name].memory.era;

  Object.entries(Memory.creepRoles).forEach(creepRole => {
    const harvester: Role = Memory.creepRoles["harvester"];
    const [type, role] = creepRole;
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
  let era = 0;

  if (maxCapacity >= 800) {
    era = 3;
  } else if (maxCapacity >= 550) {
    era = 2;
  } else if (maxCapacity < 550 && maxCapacity > 300) {
    era = 1;
  } else if (room.controller!.level === 2) {
    era = 1;
  }

  return era;
};

const manageRoomsAndCreeps = () => {
  Object.entries(Game.rooms).forEach(r => {
    const roomName = r[0];
    const room = r[1];
    if (!room.controller || !room.controller.my) {
      console.log("not my house");
    } else {
      room.memory.era = manageEra(roomName);
      // sets timer and tracks time in room memory to place functions that need to run infrequently
      room.memory.timer = 300;
      const timePassed = Game.time - room.memory.timeStamp;
      if (!room.memory.timeStamp || timePassed > room.memory.timer) {
        room.memory.timeStamp = Game.time;
        clearOldNames();
      }
      checkForRoad(roomName);
      manageCreeps(roomName);
    }
  });
};

const main = () => {
  manageSpawners();
  manageRoomsAndCreeps();
  runCreeps();
};

export const loop = ErrorMapper.wrapLoop(() => {
  main();
});
