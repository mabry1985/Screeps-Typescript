// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room: string;
  working: boolean;
}

interface Memory {
  uuid: number;
  log: any;
  state: any;
}

interface Role {
  name: string;
  currentAmount: number;
  maxAmount: number;
  bodyParts: BodyPartConstant[];
  cost: number;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
