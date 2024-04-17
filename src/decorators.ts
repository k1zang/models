import Model from "./abstracts/Model";

export function relationOneToOne(relative: typeof Model) {
  return function (model: any, property: any) {
    if (!model.constructor.relations) model.constructor.relations = {};
    model.constructor.relations[property] = relative;
  };
}

export function relationOneToMany(relative: typeof Model) {
  return function (model: any, property: any) {
    if (!model.constructor.relations) model.constructor.relations = {};
    model.constructor.relations[property] = relative;
  };
}
