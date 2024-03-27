"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const Query_1 = __importDefault(require("../Query"));
class LocalResource {
    constructor(src, schema) {
        this.stack = [];
        this.schema = schema;
        this.setResources(src);
    }
    async index(queries) {
        return queries ? this.query(queries) : this.stack;
    }
    // async update(attributes: object, id = null) {
    //   // asign all models id to in stack to identify them
    //   const index = this.stack.indexOf((r: Request) => r.id === id);
    //   // if (index >= 0) this.stack[index] = response;
    //   return this;
    // }
    async destroy(id = null) {
        if (id)
            this.stack[id] = this.stack.filter((r) => r.id !== id);
        return this;
    }
    addToResources(r) {
        this.stack.push(...(r instanceof Array ? r : [r]).map((r) => this.validateSchema(r)));
        return this;
    }
    setResources(rs) {
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
    validateSchema(attributes) {
        const ajv = new ajv_1.default();
        const validate = ajv.compile(this.schema);
        if (!validate(attributes))
            throw new Error(ajv.errorsText(validate.errors));
        return attributes;
    }
    query(queries) {
        return new Query_1.default(this.stack).do(queries);
    }
}
exports.default = LocalResource;
//# sourceMappingURL=Local.js.map