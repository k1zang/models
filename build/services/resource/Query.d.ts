import { types } from "../..";
export default class Query {
    stack: types.query.Stack;
    constructor(stack: types.query.Stack);
    do(queries: types.Query): types.query.Stack;
    with(qs: types.query.WithClause, stack: types.query.Stack): types.query.Stack;
    withObject(qs: types.query.WithObject, stack: types.query.Stack): types.query.Stack;
    withArray(qs: types.query.WithArray, stack: types.query.Stack): types.query.Stack;
    where(qs: types.query.WhereClause, stack: types.query.Stack): types.query.Stack;
    whereObject(qs: types.query.WhereObject, stack: types.query.Stack): types.query.Stack;
    whereArray(qs: types.query.WhereArray, stack: types.query.Stack): types.query.Stack;
    operators: {
        "=": (a: types.query.WhereValue, b: types.query.WhereValue) => boolean;
        "==": (a: types.query.WhereValue, b: types.query.WhereValue) => boolean;
        "<": (a: types.query.WhereValue, b: types.query.WhereValue) => boolean;
        ">": (a: types.query.WhereValue, b: types.query.WhereValue) => boolean;
    };
    compare(operator: types.query.WhereOperator, a: types.query.WhereValue, b: types.query.WhereValue): boolean;
}
