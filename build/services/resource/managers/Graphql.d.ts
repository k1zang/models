import { types } from "../../..";
import { ApolloClient } from "@apollo/client/core";
export default class GraphqlResource {
    client: ApolloClient<any>;
    constructor(apiUri: string);
    execute(method: string, args: any, query?: string | TemplateStringsArray): any;
    index(queries?: types.Query): Promise<void>;
    update(attributes: object, id?: null): Promise<this>;
    destroy(id?: null): Promise<this>;
    query(queries: types.Query): Promise<void>;
    static provider(uri: string): ApolloClient<import("@apollo/client/core").NormalizedCacheObject>;
}
