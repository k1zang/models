import Model from "./abstracts/Model";

function oneToOne(relative: typeof Model) {
  // if (aeg2 is context) handle legacy or check for experimental option
  // else handle proposal stage 3
  return function (target: any, property: any) {
    if (!target.constructor.relations) target.constructor.relations = {};
    target.constructor.relations[property] = relative;
  };
}

const relation = {
  oneToOne,
  oneToMany: oneToOne,
};

export default relation;
