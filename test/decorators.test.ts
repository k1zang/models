import { test, expect, describe } from "vitest";
import Abstract from "../src/abstracts/Model";
import relation from "../src/decorators";

class BModel extends Abstract {}

class CModel extends Abstract {}

class AModel extends Abstract {
  @relation.oneToOne(BModel)
  bModel: BModel;

  @relation.oneToMany(CModel)
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

  test("resolves deeply nested relation, single", () => {
    class DModel extends Abstract {
      @relation.oneToOne(AModel)
      aModel: AModel;
    }
    let d = new DModel({
      aModel: { ...{}, bModel: {}, cModels: [{}, {}] },
    });
    expect(d.aModel).toBeInstanceOf(AModel);
    expect(d.aModel.bModel).toBeInstanceOf(BModel);
    expect(d.aModel.cModels[0]).toBeInstanceOf(CModel);
  });

  test("relations-bags are isolated", () => {
    expect(Abstract.relations).toBe(undefined);
    class YModel extends Abstract {
      static relations = { aModel: AModel };
    }
    expect(YModel.relations).toStrictEqual({ aModel: AModel });
    expect(Abstract.relations).toBe(undefined);
    class XModel extends Abstract {
      @relation.oneToOne(YModel)
      yModel: YModel;
    }
    expect(XModel.relations).toStrictEqual({ yModel: YModel });
    expect(Abstract.relations).toBe(undefined);
    class ZModel extends Abstract {
      @relation.oneToOne(XModel)
      xModel: XModel;
    }
    expect(ZModel.relations).toStrictEqual({ xModel: XModel });
  });

  test("adds relation to relations bag with nested models", () => {
    expect(Abstract.relations).toStrictEqual(undefined);

    class DModel extends Abstract {
      @relation.oneToMany(AModel)
      aModels: AModel[];
    }

    expect(DModel.relations).toStrictEqual({ aModels: AModel });
  });

  test("resolves deeply nested relation, multiple", () => {
    class DModel extends Abstract {
      @relation.oneToMany(AModel)
      aModels: AModel[];
    }
    let d = new DModel({
      aModels: [{ ...{}, bModel: {}, cModels: [{}, {}] }],
    });
    expect(d.aModels[0]).toBeInstanceOf(AModel);
    expect(d.aModels[0].bModel).toBeInstanceOf(BModel);
    expect(d.aModels[0].cModels[0]).toBeInstanceOf(CModel);
  });
});
