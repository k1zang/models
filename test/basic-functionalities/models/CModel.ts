import Model from "./Model";

export default class CModel extends Model {
  lastname: string;

  static definition() {
    return { lastname: "lastname" };
  }

  schema() {
    return {
      definitions: {
        main: {
          type: "object",
          properties: {
            lastname: { type: "string" },
          },
        },
      },
      $ref: "#/definitions/main",
    };
  }
}
