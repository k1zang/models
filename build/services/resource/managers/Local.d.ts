import { types } from "../../..";
export default class LocalResource {
    schema: object;
    stack: types.query.Stack;
    constructor(src: Array<object>, schema: object);
    index(queries?: types.Query): Promise<types.query.Stack>;
    destroy(id?: null): Promise<this>;
    addToResources(r: object[] | object): this;
    setResources(rs: object[]): this;
    /**
     * Validates the schema of the model
     * against the given attributes
     * @param {object} attributes
     * @returns {this}
     * @throws {Error}
     */
    protected validateSchema(attributes: any): any;
    query(queries: types.Query): types.query.Stack;
}
