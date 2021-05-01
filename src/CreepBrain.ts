import { depotStructureFilter } from './utils/utils'

export class CreepBrain {
  creep: Creep;
  constructor(c: Creep) {
    this.creep = c;
  }

  harvestEnergy = () => {
    const source = this.creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (source && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(source, {
        visualizePathStyle: { stroke: "#ffaa00" }
      });
    }
  };

  depositEnergy = () => {
    Memory.showActions && this.creep.say("🚛 depot");
    var targets = this.creep.room.find(FIND_STRUCTURES, {
      filter: structure => depotStructureFilter(structure)
    });
    if (targets.length > 0) {
      let target = targets.filter(
        i => i.structureType === "spawn" || i.structureType === "extension"
      )[0];
      if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target, {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    } else {
      this.upgrade()
    }
  };

  repair = () => {
     Memory.showActions && this.creep.say("🔨 repair");
     var structure = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
       filter: (s: Structure) =>
         s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
     });
     if (structure != undefined) {
       if (this.creep.repair(structure) == ERR_NOT_IN_RANGE) {
         this.creep.moveTo(structure);
       }
     } else {
       this.upgrade()
     }
  }

  upgrade = () => {
    Memory.showActions && this.creep.say("⚡ upgrade");
    if (this.creep.upgradeController(this.creep.room.controller!) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(this.creep.room.controller!, {
        visualizePathStyle: { stroke: "#ffffff" }
      });
    } else {
      this.creep.upgradeController(this.creep.room.controller!)
    }
  };

  build = () => {
    Memory.showActions && this.creep.say("🚧 build");
    const targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
      if (this.creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    } else {
      this.repair()
    }
  };

  work = (role: string) => {
    switch (role) {
      case "harvester":
        this.depositEnergy();
        break;
      case "builder":
        this.build();
        break;
      case "upgrader":
        this.upgrade()
        break;
      default:
        break;
    }
  };

  isWorkingCheck = () => {
    if (this.creep.memory.working && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.creep.memory.working = false;
    } else if (!this.creep.memory.working && this.creep.store.getFreeCapacity() === 0) {
      this.creep.memory.working = true;
    }
  };

  run = () => {
    this.isWorkingCheck();
    if (this.creep.memory.working) {
      this.work(this.creep.memory.role);
    } else {
      Memory.showActions && this.creep.say("🔄 harvest");
      this.harvestEnergy();
    }
  };
}
