"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import RestManager from "../services/resource/managers/Rest";
const Graphql_1 = __importDefault(require("../services/resource/managers/Graphql"));
// import LocalManager from "../services/resource/managers/Local";
class Model {
    /**
     * Returns the skeleton for the model
     * used for visually representing the model
     * before it was fetched from the server
     * @returns {Model}
     */
    static skeleton() {
        // @ts-ignore
        return new this();
    }
    /**
     * Returns the definition for the model
     * must be implemented by the subclass
     * @returns {object}
     */
    static definition() {
        throw new Error("Must be implemented by subclass");
    }
    /**
     * Returns the json/graphql schema for the model and
     * must be overridden by the subclass
     * @returns {object|string|TemplateStringsArray}
     */
    static schema() {
        throw new Error(`Model "${this.name}" has no schema`);
    }
    /**
     * Returns the resource source for the model
     * @returns {array}
     */
    static resources() {
        return undefined;
    }
    /**
     * Returns the type of the model
     * @returns {string}
     */
    static typeName() {
        return this.name;
    }
    /**
     * Returns the resource REST name for the model
     * @returns {string}
     */
    static restName() {
        return this.typeName().toLowerCase() + "s";
    }
    /**
     * @param {object} attributes
     */
    constructor(attributes) {
        this.setAttributes({ ...attributes });
    }
    static index(query) {
        return this.resourceManager.index(query);
    }
    // static store(attrs: object) {
    //   return this.resourceManager.store(attrs);
    // }
    /**
     * Creates a new model from the given object
     * @param {object} attrs
     * @returns {Model}
     * @throws {Error}
     */
    // static async create(attrs: Record<string, any> = {}): Promise<Model> {
    //   return this.build((await this.store(attrs)) ?? attrs, this);
    // }
    /**
     * Fetches all the models from the server
     * @returns {Promise<Model[]>}
     */
    // static async all(query?: types.Query): Promise<Model[]> {
    //   return this.buildMany(await this.index(query));
    // }
    /**
     * Get the first model based on the given
     * queries from available resources
     * @param {object} query
     * @returns {Promise<Model>}
     */
    // static async first(query?: types.Query | number | string): Promise<Model> {
    //   let resource: any;
    //   if (typeof query === "string" || typeof query === "number")
    //     query = { where: { id: Number(query) } };
    //   try {
    //     resource = (await this.index(query))[0];
    //   } catch (e) {
    //     // try to fetch the resource from the server like .../models/{id}
    //   }
    //   return this.build(resource);
    // }
    /**
     * Builds the model with the given model name
     * and object to build to the model
     * @param {object} resource
     * @param {Model} model
     * @returns {Model}
     * @throws {Error}
     */
    static build(resource, model = this) {
        if (!this.name)
            throw new Error("Anonymous class cannot be instantiated!");
        return new (model !== null && model !== void 0 ? model : this)(resource);
    }
    /**
     * Builds the given array of objects to the
     * model and returns an array of build models
     * @param {object[]} resources
     * @param {Model} model
     * @returns {Model[]}
     * @throws {Error}
     */
    static buildMany(resources, model) {
        if (resources instanceof Array)
            return resources.map((c) => this.build(c, model));
        throw new Error(`Expected array of objects, got "${resources}"!`);
    }
    /**
     * Automatically builds the model(s)
     * based on the given resource(s)
     * as given object or array
     * @param {object | object[]} r as resource(s)
     * @param {typeof Model} m as model
     * @returns {Model | Model[]}
     */
    static autoBuild(r, m) {
        return this[r instanceof Array ? "buildMany" : "build"](r, m);
    }
    static gql(query) {
        if (!(this.resourceManager instanceof Graphql_1.default))
            throw new Error("Cannot use gql in non-graphql mode");
        const process = async (method, args) => {
            let result = (await this.resourceManager
                .execute(method, args, query)); // prettier-ignore
            return this.autoBuild(result.data[Object.keys(result.data)[0]], this);
        };
        return {
            query: (...args) => process("query", args),
        };
    }
    /**
     * Returns the resource manager for the model
     * @returns {types.ResourceManager}
     */
    static get resourceManager() {
        var _a;
        if (this.mode === "graphql")
            (_a = this._resourceManager) !== null && _a !== void 0 ? _a : (this._resourceManager = new this.managers[this.mode](this.apiUri));
        // else if (this.mode === "local")
        //   this._resourceManager ??= new LocalManager(this.resources());
        // else if (this.mode === "rest")
        //   this._resourceManager = new RestManager( this.apiUri, this.type(), this.schema() );
        else
            throw new Error("fetch Mode either no set or invalid");
        return this._resourceManager;
    }
    /**
     * Resolves the models for relations from the
     * given attributes and returns the resolved object
     * @param {object} attrs
     * @returns {object}
     */
    resolveRelations(attrs) {
        for (const r in this.static.relations)
            if (r in attrs)
                attrs[r] = this.static.autoBuild(attrs[r], this.getRelation(r));
        return attrs;
    }
    /**
     * Returns the relation model for the given key
     * @param {string} key
     * @returns {Model}
     */
    getRelation(key) {
        return this.static.relations[key];
    }
    /**
     * Resets the static state of the model
     * @returns {void}
     */
    static reset() {
        this._resourceManager = undefined;
    }
    /**
     * Sets the attributes of the model
     * @param {object} attributes
     * @returns {RelationalModel}
     */
    setAttributes(attributes) {
        attributes = this.resolveRelations(attributes);
        for (const key in attributes)
            this[key] = attributes[key];
        return this;
    }
    get static() {
        return this.constructor;
    }
}
/**
 * Define the relations of the model
 * @type {object}
 */
Model.relations = {};
/**
 * The fetch mode of the model
 * @type {string}
 * @static
 * @public
 * @memberof Resource
 * @default "graphql"
 */
Model.mode = "graphql";
/**
 * The managers for the model
 * @type {object}
 * @static
 * @protected
 * @memberof Resource
 * @default { graphql: GqlManager, local: LocalManager }
 */
Model.managers = {
    graphql: Graphql_1.default,
    // local: LocalManager,
};
exports.default = Model;
//# sourceMappingURL=Model.js.map