import Ajv from "ajv";
// import Request from "@k1/requests";
import { types } from "../../..";
import Query from "../Query";

export default class LocalResource {
  schema: object;
  stack: types.query.Stack = [];

  constructor(src: Array<object>, schema: object) {
    this.schema = schema;
    this.setResources(src);
  }

  async index(queries?: types.Query) {
    return queries ? this.query(queries) : this.stack;
  }

  // async update(attributes: object, id = null) {
  //   // asign all models id to in stack to identify them
  //   const index = this.stack.indexOf((r: Request) => r.id === id);
  //   // if (index >= 0) this.stack[index] = response;
  //   return this;
  // }

  async destroy(id = null) {
    if (id) this.stack[id] = this.stack.filter((r: any) => r.id !== id);

    return this;
  }

  addToResources(r: object[] | object) {
    this.stack.push(
      ...(r instanceof Array ? r : [r]).map((r) => this.validateSchema(r))
    );
    return this;
  }

  setResources(rs: object[]) {
    if (!(rs instanceof Array))
      throw new Error(`resources expected to be an array, got ${typeof rs}`);
    this.stack = rs.map((r) => this.validateSchema(r));
    return this;
  }

  /**
   * Validates the schema of the model
   * against the given attributes
   * @param {object} attributes
   * @returns {this}
   * @throws {Error}
   */
  protected validateSchema(attributes: any): any {
    const ajv = new Ajv();
    const validate = ajv.compile(this.schema);
    if (!validate(attributes)) throw new Error(ajv.errorsText(validate.errors));
    return attributes;
  }

  query(queries: types.Query): types.query.Stack {
    return new Query(this.stack).do(queries);
  }
}
