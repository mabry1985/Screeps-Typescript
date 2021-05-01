const structureFilter = (structure: any) => {
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

const depositEnergy = (creep: Creep) => {
  var targets = creep.room.find(FIND_STRUCTURES, {
    filter: structure => structureFilter(structure)
  });
  if (targets.length > 0) {
    let target = targets.filter(
      i => i.structureType === "spawn" || i.structureType === "extension"
    )[0];
    if (!target) target = targets[0];
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: { stroke: "#ffffff" }
      });
    }
  }
};

const harvestEnergy = (creep: Creep) => {
  var sources = creep.room.find(FIND_SOURCES);
  if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
    creep.moveTo(sources[0], {
      visualizePathStyle: { stroke: "#ffaa00" }
    });
  }
};

export const roleHarvester: any = {
  /** @param {Creep} creep **/
  run: function (creep: Creep) {
    if (creep.store.getFreeCapacity() > 0) {
      harvestEnergy(creep);
    } else {
      depositEnergy(creep);
    }
  }
};
