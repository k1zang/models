"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Query {
    constructor(stack) {
        this.operators = {
            "=": (a, b) => a == b,
            "==": (a, b) => a === b,
            "<": (a, b) => a < b,
            ">": (a, b) => a > b,
        };
        this.stack = stack;
    }
    do(queries) {
        let stack = this.stack;
        if (queries.where)
            stack = this.where(queries.where, stack);
        if (queries.with)
            stack = this.with(queries.with, stack);
        return stack;
    }
    with(qs, stack) {
        if (Array.isArray(qs))
            return this.withArray(qs, stack);
        return this.withObject(qs, stack);
    }
    withObject(qs, stack) {
        return stack.map((r) => {
            Object.keys(qs).forEach((key) => (r[key] = new Query(r[key]).do(qs[key])));
            return r;
        });
    }
    withArray(qs, stack) {
        return stack.map((r) => {
            // qs.forEach((key) => (r[key] = new Query(r[key]).do({})));
            return r;
        });
    }
    where(qs, stack) {
        if (Array.isArray(qs))
            return this.whereArray(qs, stack);
        return this.whereObject(qs, stack);
    }
    whereObject(qs, stack) {
        return stack.filter((r) => Object.keys(qs).every((key) => r[key] === qs[key]));
    }
    whereArray(qs, stack) {
        return stack.filter((r) => this.compare(qs[1], r[qs[0]], qs[2]));
    }
    compare(operator, a, b) {
        return this.operators[operator](a, b);
    }
}
exports.default = Query;
//# sourceMappingURL=Query.js.map