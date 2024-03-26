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
        AModel: () => AModel.definition(),
        BModel: () => BModel.definition(),
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
  static definition() {
    return {
      id: Math.round(Math.random() * 10),
      attr: "attr",
    };
  }
}

export class AModel extends BaseModel {
  static relations = {
    bModels: BModel,
  };

  static definition() {
    return {
      id: Math.round(Math.random() * 10),
      prop: "prop",
    };
  }
}
