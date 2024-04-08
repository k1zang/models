import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { Model as Abstract } from "../..";
import typeDefs from "./types";

// UTILS

export const { url } = await startStandaloneServer(
  new ApolloServer({
    schema: addMocksToSchema({
      schema: makeExecutableSchema({ typeDefs }),
      mocks: {
        Query: () => ({
          aModel: (args) => AModel.definition(args?.id),
          bModel: (args) => BModel.definition(args?.id),
          aModels: () =>
            new Array(10).fill(null).map((args) => AModel.definition(args?.id)),
          bModels: () =>
            new Array(10).fill(null).map((args) => BModel.definition(args?.id)),
        }),
      },
    }),
  })
);

export const client = new ApolloClient({
  uri: url,
  cache: new InMemoryCache(),
});

export async function query(query: string) {
  return (
    await (
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
    ).json()
  ).data;
}

// MODELS

abstract class BaseModel extends Abstract {
  static apiUri = url;
  static mode: any = "graphql";
}

export class BModel extends BaseModel {
  static definition(id?: null | Number) {
    return {
      id: id ?? Math.round(Math.random() * 10),
      attr: "attr",
    };
  }
}

export class AModel extends BaseModel {
  static relations = {
    bModels: BModel,
  };

  static definition(id?: null | Number) {
    return {
      id: id ?? Math.round(Math.random() * 10),
      prop: "prop",
    };
  }
}
