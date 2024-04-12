import { test, expect, describe } from "vitest";
import Abstract from "../src/abstracts/Model";
import { relationOneToMany, relationOneToOne } from "../src/decorators";

class BModel extends Abstract {}

class CModel extends Abstract {}

class AModel extends Abstract {
  @relationOneToOne(BModel)
  bModel: BModel;

  @relationOneToMany(CModel)
  cModels: CModel[];
}

describe("AModel should have correct relations", () => {
  const aModelInstance = new AModel();
  const relations = (aModelInstance.constructor as any).relations;

  test("bModel should be a one-to-one relation with BModel", () => {
    expect(relations.bModel).toBe(BModel);
  });

  test("cModels should be a one-to-many relation with CModel", () => {
    expect(relations.cModels).toBe(CModel);
  });
});
