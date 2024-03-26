import { gql } from "@apollo/client/core";
import { client, query, AModel } from ".";
import { describe, test, expect, beforeEach } from "vitest";

describe("From api", () => {
  beforeEach(() => AModel.reset());

  test("mocked graphql server ready", async () => {
    const response = await query("{ aModels { id, prop } }");
    expect(response.aModels[0].prop).toBe("prop");
  });

  test("graphql client ready", async () => {
    let result = await client.query({
      query: gql`query { aModel { id prop } }`, // prettier-ignore
    });
    expect(result.data.aModel.prop).toBe("prop");
  });

  test("passing graphql query to model", async () => {
    let model = await AModel.gql(`query { aModel { id prop } }`).query(); // prettier-ignore
    expect(model).toBeInstanceOf(AModel);
    expect(model.prop).toBe("prop");
  });

  // test("getting first resource", async () => {
  //   // expect(AModel.resourceManager.stack).toEqual([]);
  //   let model = await AModel.first();
  //   expect(model.prop).toBe("prop");
  // });

  // test("getting first resource which specific id", async () => {
  //   expect((await AModel.first(rs[1].id)).id).toBe(rs[1].id);
  //   expect((await AModel.first(rs[0].id)).id).toBe(rs[0].id);
  //   expect((await AModel.first(rs[2].id)).id).toBe(rs[2].id);
  // });

  // test("getting resource that has one to many relation", async () => {
  //   let aModel = await AModel.first();
  //   expect(aModel.bModels[0]).toBeInstanceOf(BModel);
  //   expect(aModel.bModels[1].attributes).toMatchObject(rs[0].bModels[1]);
  // });
});
