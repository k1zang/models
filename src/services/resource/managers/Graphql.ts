import { gql } from "@apollo/client/core";
import { types } from "../../..";
import Query from "../Query";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";

export default class GraphqlResource {
  client: ApolloClient<any>;

  constructor(apiUri: string) {
    this.client = (this.constructor as any).provider(apiUri);
  }

  execute(
    method: string,
    args: any,
    query: string | TemplateStringsArray = ""
  ) {
    return (this.client as any)[method]({
      [{
        query: "query",
        mutate: "mutation",
      }[method] as string]: gql(query),
      ...Object.assign({}, ...args),
    });
  }

  async index(queries?: types.Query) {}

  async update(attributes: object, id = null) {
    return this;
  }

  async destroy(id = null) {
    return this;
  }

  async query(queries: types.Query) {
    // return (
    //   await (
    //     await fetch(url, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ query }),
    //     })
    //   ).json()
    // ).data;
  }

  static provider(uri: string) {
    return new ApolloClient({
      uri,
      cache: new InMemoryCache({
        typePolicies: {
          // Query: {
          //   fields: {
          //     aModel(existingData) {
          //       console.log("XXXX");
          //     },
          //   },
          // },
        },
      }),
    });
  }
}
