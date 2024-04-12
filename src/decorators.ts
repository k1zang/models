import Model from "./abstracts/Model";

export function relationOneToOne(relative: typeof Model) {
  return function (model: any, property: any) {
    model.constructor.relations[property] = relative;
  };
}

export function relationOneToMany(relative: typeof Model) {
  return function (model: any, property: any) {
    model.constructor.relations[property] = relative;
  };
}