import { describe, expect, test, beforeEach } from "vitest";
import AModel from "./models/AModel";
import BModel from "./models/BModel";
import CModel from "./models/CModel";

describe("Model", () => {
  test("passed attributes are set on attributes bag", () => {
    let a = new AModel(AModel.definition());
    expect(a.attributes).toEqual(AModel.definition());
  });

  test("can access the attrs bag and relations directly", () => {
    let a = new AModel({
      ...AModel.definition(),
      bModel: BModel.definition(),
    });
    expect(a.firstname).toEqual("firstname");
    expect(a.bModel.attributes).toEqual(BModel.definition());
  });

  test("passing attributes under 'attribute' key is not necessary", () => {
    let a = new AModel(AModel.definition());
    expect(a.attributes).toEqual(AModel.definition());
  });

  test("relation auto resolution with array", () => {
    let a = new AModel({
      ...AModel.definition(),
      bModel: BModel.definition(),
      cModels: [CModel.definition(), CModel.definition()],
    });
    expect(a.bModel).toBeInstanceOf(BModel);
    expect(a.cModels[0]).toBeInstanceOf(CModel);
  });

  test("passed json relations get converted to native object models", () => {
    let a = new AModel({
      attributes: AModel.definition(),
      bModel: BModel.definition(),
      cModels: [CModel.definition(), CModel.definition()],
    });
    expect(a.bModel.attributes).toEqual(BModel.definition());
    expect(a.bModel).toBeInstanceOf(BModel);
    expect(a.cModels[0].attributes).toEqual(CModel.definition());
    expect(a.cModels[0]).toBeInstanceOf(CModel);
  });

  test("getting skeleton", () => {
    expect(AModel.skeleton()).toEqual({});
  });

  // test("fetching all models", async () => {
  //   const all = await AModel.all();
  //   expect(all).toBeInstanceOf(Array);
  //   expect(all[0]).toBeInstanceOf(AModel);
  // });

  test("getting one model", async () => {
    expect(await AModel.first()).toBeInstanceOf(AModel);
  });

  // test("getting certain model by attributes", async () => {
  //   const resources = [
  //     { firstname: "firstname1", name: "name", nickname: "x" },
  //     { firstname: "firstname2", name: "name", nickname: "y" },
  //     { firstname: "firstname3", name: "name", nickname: "z" },
  //   ];
  //   AModel.resources = () => resources;
  //   expect(
  //     (await AModel.first({ where: { name: "name" } })).attributes
  //   ).toMatchObject(resources[0]);
  //   expect(
  //     (await AModel.first({ where: resources[1] })).attributes
  //   ).toMatchObject(resources[1]);
  //   expect(
  //     (await AModel.first({ where: resources[2] })).attributes
  //   ).toMatchObject(resources[2]);
  // });

  test("using attributes containing resolved relation", () => {
    let bDef = BModel.definition(),
      cDef = CModel.definition();
    let a = new AModel({
      ...AModel.definition(),
      bModel: new BModel(bDef),
      cModels: [CModel.definition(), new CModel(cDef)],
    });
    checkProperty(a.bModel, "nickname", bDef.nickname);
    checkProperty(a.cModels[0], "lastname", cDef.lastname);
    checkProperty(a.cModels[1], "lastname", cDef.lastname);
  });
});

function checkProperty(obj, prop, value) {
  expect(obj[prop]).toBeDefined();
  expect(obj[prop]).toBe(value);
}
