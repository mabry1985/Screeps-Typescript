Memory.state = {
  creepRoles: [
    {
      name: "harvester",
      currentAmount: 0,
      maxAmount: 2,
      bodyParts: [WORK, CARRY, MOVE],
      cost: 0,
      buildsRoads: false // whether or not creep will attempt to lay road on current path
    },
    {
      name: "builder",
      currentAmount: 0,
      maxAmount: 0,
      bodyParts: [WORK, CARRY, MOVE],
      cost: 0,
      buildsRoads: false
    },
    {
      name: "upgrader",
      currentAmount: 0,
      maxAmount: 0,
      bodyParts: [WORK, CARRY, MOVE],
      cost: 0,
      buildsRoads: false
    },
    {
      name: "repairer",
      currentAmount: 0,
      maxAmount:0,
      bodyParts: [WORK, CARRY, MOVE],
      cost: 0,
      buildsRoads: false
    }
  ]
};
