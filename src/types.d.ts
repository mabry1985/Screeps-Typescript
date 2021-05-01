// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room: string;
  working: boolean;
  buildsRoads: boolean
}

interface Memory {
  uuid: number;
  log: any;
  creepRoles: Roles;
  showActions: boolean
}

interface Roles {
  [key: string] : Role
}

interface Role {
  currentAmount: number;
  maxAmount: number[];
  bodyParts: BodyPartConstant[][];
  cost: number;
}

interface SpawnMemory {
  extensions: STRUCTURE_EXTENSION[]
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
