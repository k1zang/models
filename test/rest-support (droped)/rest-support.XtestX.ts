import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from "vitest";
import { http, HttpResponse } from "msw";
import BaseModel from "./src/models/Model";
import { setupServer } from "msw/node";

class BModel extends BaseModel {
  static definition() {
    return {
      id: Math.round(Math.random() * 1000),
      attr: "attr",
    };
  }

  static schema() {
    return {
      type: "object",
      reqired: ["id", "attr"],
      properties: {
        id: { type: "number" },
        attr: { type: "string" },
      },
    };
  }
}

class AModel extends BaseModel {
  static relations = {
    bModels: BModel,
  };

  static definition() {
    return {
      id: Math.round(Math.random() * 1000),
      prop: "prop",
    };
  }

  static schema() {
    return {
      type: "object",
      properties: {
        id: { type: "number" },
        prop: { type: "string" },
      },
    };
  }
}

const rs: any = [
  {
    ...AModel.definition(),
    bModels: [BModel.definition(), BModel.definition()],
  },
  AModel.definition(),
  AModel.definition(),
  AModel.definition(),
];

const server = setupServer(
  http.get(AModel.getResourceUri(), () => HttpResponse.json(rs))
);

describe("From api", () => {
  beforeAll(() => server.listen());
  beforeEach(() => AModel.reset());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("fetches data from mocked API", async () => {
    const response = await fetch(AModel.getResourceUri());
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    expect(await response.json()).toEqual(rs);
  });

  test("getting all rs", async () => {
    let all = await AModel.all();
    expect(all[0].id).toBe(rs[0].id);
    expect(all[1].id).toBe(rs[1].id);
  });

  test("getting first resource", async () => {
    expect(AModel.resourceManager.stack).toEqual([]);
    let model = await AModel.first();
    expect(model.id).toBe(rs[0].id);
  });

  test("getting first resource which specific id", async () => {
    expect((await AModel.first(rs[1].id)).id).toBe(rs[1].id);
    expect((await AModel.first(rs[0].id)).id).toBe(rs[0].id);
    expect((await AModel.first(rs[2].id)).id).toBe(rs[2].id);
  });

  test("getting resource that has one to many relation", async () => {
    let aModel = await AModel.first();
    expect(aModel.bModels[0]).toBeInstanceOf(BModel);
    expect(aModel.bModels[1].attributes).toMatchObject(rs[0].bModels[1]);
  });
});
