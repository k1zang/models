import Model from "./Model";
import BModel from "./BModel";
import CModel from "./CModel";
export default class AModel extends Model {
  firstname: string;
  bModel: BModel;
  cModels: CModel[];

  static relations = {
    bModel: BModel,
    cModels: CModel,
  };

  static definition() {
    return { firstname: "firstname" };
  }

  static resources() {
    return [this.definition(), this.definition()];
  }

  static schema() {
    return {
      type: "object",
      properties: {
        firstname: { type: "string" },
        bModel: { type: "object" },
        cModels: { type: "array" },
      },
    };
  }
}
