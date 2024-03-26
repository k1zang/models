import Ajv from "ajv";
import Request from "@k1/requests";
import { types } from "../../../..";
import Query from "../Query";
import Local from "./Local";

export default class Resource {
  uri?: string;
  schema: object;
  stack: types.query.Stack = [];
  hasMore?: boolean;
  latestRequest?: Request;
  isSilent: boolean = false;

  constructor(src: string | Array<object>, schema: object) {
    // when the data was retrieved from the server
    // validate and cache it!
    // TODO: validate schema of the data in and outing from this object
    this.schema = schema;

    if (typeof src === "string") this.uri = src;
    else this.setResources(src);
  }

  /**
   * INDEX RESOURCE
   * -------------------------------------------------------------
   * This is the index of the controller what ever was passed there
   * will be reflected here.
   *
   * note: index is REQUIRED to return a non-associative array.
   *
   * @param {object} queries
   * @returns
   */
  async index(queries?: types.Query) {
    // keep everything so generic, also here always fetch from the server
    // so no auto caching here
    if (!this.stack.length) this.stack = await this.newRequest().get(queries);
    return queries ? this.query(queries) : this.stack;
    // return this.unpackData(await this.newRequest().get(queries));
  }

  /**
   * STORE A NEW RESOURCE
   * -------------------------------------------------------------
   *
   * @param {*} attributes
   * @returns
   * @throws {Error}
   */
  async store(attrs: object): Promise<any> {
    return await (
      await this.newRequest().post(this.validateSchema(attrs))
    ).response.json();
  }

  /**
   * UPDATE OR MODIFY A RESOURCE
   * -------------------------------------------------------------
   *
   * @param {*} attributes
   * @param {*} id
   * @returns
   */
  async update(attributes: object, id = null) {
    const response = (await this.newRequest().patch(attributes)).response;

    if (response && id) {
      const index = this.stack.indexOf((r: Request) => r.id === id);
      if (index >= 0) this.stack[index] = response;
    }

    return this;
  }

  /**
   * DESTROY A RESOURCE
   * -------------------------------------------------------------
   * will also remove the intended record from data object.
   *
   * @param {*} id
   * @returns
   */
  async destroy(id = null) {
    let response = (await this.newRequest().delete()).response;

    if (id && response)
      this.stack[id] = this.stack.filter((r: any) => r.id !== id);

    return this;
  }

  /**
   *
   * fetch more resource from index based on last id
   * available on data array.
   *
   * @param  {...any} params
   */
  async more(queries: object) {
    return await this.newRequest()
      .silently()
      .query({ from: this.stack.length, ...queries })
      .get();
  }

  baseRequest(): Request {
    return new Request(this.uri).silently(this.isSilent);
  }

  newRequest() {
    return (this.latestRequest = this.baseRequest());
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

  setHasMore(value: boolean) {
    // if (this.data.length && this.hasMore && !value)
    //   new Notice("that's it, there were no more!");

    this.hasMore = value;
    return this;
  }

  silently() {
    this.isSilent = true;
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
