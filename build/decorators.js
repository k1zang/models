"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationOneToMany = exports.relationOneToOne = void 0;
function relationOneToOne(relative) {
    return function (model, property) {
        model.constructor.relations[property] = relative;
    };
}
exports.relationOneToOne = relationOneToOne;
function relationOneToMany(relative) {
    return function (model, property) {
        model.constructor.relations[property] = relative;
    };
}
exports.relationOneToMany = relationOneToMany;
//# sourceMappingURL=decorators.js.map