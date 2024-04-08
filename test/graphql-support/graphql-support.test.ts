import { gql } from "@apollo/client/core";
import { client, query, AModel } from ".";
import { describe, test, expect, beforeEach } from "vitest";

describe("From api", () => {
  beforeEach(() => AModel.reset());

  test("(graphql server) ready", async () => {
    const response = await query("{ aModels { id, prop } }");
    expect(response.aModels[0].prop).toBe("prop");
  });

  test("(graphql server) query a specific record by id", async () => {
    const response = await query("{ aModel(id: 1) { id, prop } }");
    if (response.aModel) expect(response.aModel.id).toBe(1);
    else throw new Error("GraphQL server did not return expected data");
  });

  test("(graphql client) ready", async () => {
    let result = await client.query({
      query: gql`query { aModel { id prop } }`, // prettier-ignore
    });
    expect(result.data.aModel.prop).toBe("prop");
  });

  test("(graphql client) query a specific record by id", async () => {
    const result = await client.query({
      query: gql`{ aModel(id: 1) { id, prop } }`, // prettier-ignore
    });
    if (result.data.aModel) expect(result.data.aModel.id).toBe(1);
  });

  test("passing graphql query to model", async () => {
    let model = await AModel.gql(`query { aModel { id prop } }`).query(); // prettier-ignore
    expect(model).toBeInstanceOf(AModel);
    expect(model.prop).toBe("prop");
  });

  test("querying a specific record by id", async () => {
    let id = 2;
    let model = await AModel.gql(`query { aModel(id: ${id}) { id prop } }`).query(); // prettier-ignore
    expect(model.id).toBe(id);
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
