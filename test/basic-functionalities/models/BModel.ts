import Model from "./Model";

export default class BModel extends Model {
  nickname: string;

  static definition() {
    return { nickname: "nickname" };
  }

  static schema() {
    return {
      definitions: {
        main: {
          type: "object",
          properties: {
            nickname: { type: "string" },
          },
        },
      },
      $ref: "#/definitions/main",
    };
  }
}
