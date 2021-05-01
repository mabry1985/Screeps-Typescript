export const roleRepairer = {
  run: function (creep: Creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.working = false;
      creep.say("🔄 harvest");
    } else if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
      creep.say("🔨 repair")
    }
    if (creep.memory.working) {
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s: Structure) =>
          s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
      });
      if (structure != undefined) {
        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      }
    } else {
      var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (creep.harvest(source!) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source!);
      }
    }
  }
};
