import { types } from "..";
import GqlManager from "../services/resource/managers/Graphql";
export default abstract class Model {
    [key: string]: any;
    /**
     * Define the relations of the model
     * @type {object}
     */
    static relations: {
        [ket: string]: typeof Model;
    };
    /**
     * The base uri for the model
     * @type {string}
     * @static
     * @public
     * @memberof Resource
     */
    static apiUri: string;
    /**
     * The fetch mode of the model
     * @type {string}
     * @static
     * @public
     * @memberof Resource
     * @default "graphql"
     */
    static mode: "rest" | "graphql" | "local";
    /**
     * The attribute bag of the model
     * @type {Record<string, any>}
     */
    _attributes: Record<string, any>;
    /**
     * The resource manager for the model
     * @type {types.ResourceManager}
     * @protected
     * @memberof Resource
     */
    protected static _resourceManager?: types.ResourceManager;
    /**
     * The managers for the model
     * @type {object}
     * @static
     * @protected
     * @memberof Resource
     * @default { graphql: GqlManager, local: LocalManager }
     */
    protected static managers: {
        graphql: typeof GqlManager;
    };
    /**
     * Returns the skeleton for the model
     * used for visually representing the model
     * before it was fetched from the server
     * @returns {object}
     */
    static skeleton(): Model;
    /**
     * Returns the definition for the model
     * must be implemented by the subclass
     * @returns {object}
     */
    static definition(): object;
    /**
     * Returns the json/graphql schema for the model and
     * must be overridden by the subclass
     * @returns {object|string|TemplateStringsArray}
     */
    static schema(): object | string | TemplateStringsArray;
    /**
     * Returns the resource source for the model
     * @returns {array}
     */
    static resources(): undefined | Array<object>;
    /**
     * Returns the type of the model
     * @returns {string}
     */
    static typeName(): string;
    /**
     * Returns the resource REST name for the model
     * @returns {string}
     */
    static restName(): string;
    /**
     * @param {object} attributes
     */
    constructor(attributes?: {
        [key: string]: any;
    });
    static index(query?: types.Query): Promise<void> | Promise<types.query.Stack>;
    /**
     * Creates a new model from the given object
     * @param {object} attrs
     * @returns {Model}
     * @throws {Error}
     */
    /**
     * Fetches all the models from the server
     * @returns {Promise<Model[]>}
     */
    /**
     * Get the first model based on the given
     * queries from available resources
     * @param {object} query
     * @returns {Promise<Model>}
     */
    /**
     * Builds the model with the given model name
     * and object to build to the model
     * @param {object} resource
     * @param {Model} model
     * @returns {Model}
     * @throws {Error}
     */
    static build(resource: object, model?: typeof Model | any): Model;
    /**
     * Builds the given array of objects to the
     * model and returns an array of build models
     * @param {object[]} resources
     * @param {Model} model
     * @returns {Model[]}
     * @throws {Error}
     */
    static buildMany(resources: object[], model?: typeof Model): Model[];
    /**
     * Automatically builds the model(s)
     * based on the given resource(s)
     * as given object or array
     * @param {object | object[]} r as resource(s)
     * @param {typeof Model} m as model
     * @returns {Model | Model[]}
     */
    static autoBuild(r: any, m: typeof Model): Model | Model[];
    static gql(query?: string | TemplateStringsArray): {
        query: (options?: import("@apollo/client/core").QueryOptions<import("@apollo/client/core").OperationVariables, unknown> | undefined) => types.QueryReturnType;
    };
    /**
     * Returns the resource manager for the model
     * @returns {types.ResourceManager}
     */
    static get resourceManager(): types.ResourceManager;
    /**
     * Resolves the models for relations from the
     * given attributes and returns the resolved object
     * @param {object} attrs
     * @returns {object}
     */
    protected resolveRelations(attrs: any): object;
    /**
     * Returns the relation model for the given key
     * @param {string} key
     * @returns {Model}
     */
    protected getRelation(key: string): typeof Model;
    /**
     * Resets the static state of the model
     * @returns {void}
     */
    static reset(): void;
    /**
     * Sets the attributes of the model
     * @param {object} attributes
     * @returns {RelationalModel}
     */
    setAttributes(attributes: {
        [key: string]: any;
    }): this;
    get attributes(): any;
    set attributes(attrs: any);
    get static(): Model;
    /**
     * Returns the model as a proxy
     * to allow accessing the attributes and
     * relations directly
     * @returns {Proxy}
     */
    protected asProxy(): any;
}
