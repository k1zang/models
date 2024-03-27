"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@apollo/client/core");
const core_2 = require("@apollo/client/core");
class GraphqlResource {
    constructor(apiUri) {
        this.client = this.constructor.provider(apiUri);
    }
    execute(method, args, query = "") {
        return this.client[method]({
            [{
                query: "query",
                mutate: "mutation",
            }[method]]: (0, core_1.gql)(query),
            ...Object.assign({}, ...args),
        });
    }
    async index(queries) { }
    async update(attributes, id = null) {
        return this;
    }
    async destroy(id = null) {
        return this;
    }
    async query(queries) {
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
    static provider(uri) {
        return new core_2.ApolloClient({
            uri,
            cache: new core_2.InMemoryCache({
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
exports.default = GraphqlResource;
//# sourceMappingURL=Graphql.js.map