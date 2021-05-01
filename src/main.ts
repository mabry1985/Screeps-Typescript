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

  const era = Game.rooms[name].controller?.level;

  Object.entries(Memory.creepRoles).forEach(entry => {
    const harvester: Role = Memory.creepRoles["harvester"];
    const [type, role] = entry;
    role.cost = calculateBodyPartsCost(role.bodyParts[era! - 1]);
    if (role.cost <= Game.rooms[name].energyAvailable) {
      role.currentAmount = setCreepCount(role, type);
      if (harvester.currentAmount < harvester.maxAmount[era! - 1]) {
        spawnCreep(harvester, "harvester", era!, name);
      } else if (role.currentAmount < role.maxAmount[era! - 1]) {
        spawnCreep(role, type, era!, name);
      }
    }
  });
};

const main = () => {
  clearOldNames();
  manageSpawners();
  Object.keys(Game.rooms).forEach(name => {
    checkForRoad(name);
    manageCreeps(name);
  });
  runCreeps();
};

export const loop = ErrorMapper.wrapLoop(() => {
  main();
});
