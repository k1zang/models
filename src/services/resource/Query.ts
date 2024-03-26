import { DocumentNode, gql } from "@apollo/client/core";
import { types } from "../../..";

export default class Query {
  stack: types.query.Stack;

  constructor(stack: types.query.Stack) {
    this.stack = stack;
  }

  do(queries: types.Query): types.query.Stack {
    let stack = this.stack;
    if (queries.where) stack = this.where(queries.where, stack);
    if (queries.with) stack = this.with(queries.with, stack);
    return stack;
  }

  with(
    qs: types.query.WithClause,
    stack: types.query.Stack
  ): types.query.Stack {
    if (Array.isArray(qs)) return this.withArray(qs, stack);
    return this.withObject(qs, stack);
  }

  withObject(
    qs: types.query.WithObject,
    stack: types.query.Stack
  ): types.query.Stack {
    return stack.map((r: any) => {
      Object.keys(qs).forEach(
        (key) => (r[key] = new Query(r[key]).do(qs[key]))
      );
      return r;
    });
  }

  withArray(
    qs: types.query.WithArray,
    stack: types.query.Stack
  ): types.query.Stack {
    return stack.map((r: any) => {
      // qs.forEach((key) => (r[key] = new Query(r[key]).do({})));
      return r;
    });
  }

  where(
    qs: types.query.WhereClause,
    stack: types.query.Stack
  ): types.query.Stack {
    if (Array.isArray(qs)) return this.whereArray(qs, stack);
    return this.whereObject(qs, stack);
  }

  whereObject(
    qs: types.query.WhereObject,
    stack: types.query.Stack
  ): types.query.Stack {
    return stack.filter((r: any) =>
      Object.keys(qs).every((key) => r[key] === qs[key])
    );
  }

  whereArray(
    qs: types.query.WhereArray,
    stack: types.query.Stack
  ): types.query.Stack {
    return stack.filter((r: any) => this.compare(qs[1], r[qs[0]], qs[2]));
  }

  operators = {
    "=": (a: types.query.WhereValue, b: types.query.WhereValue) => a == b,
    "==": (a: types.query.WhereValue, b: types.query.WhereValue) => a === b,
    "<": (a: types.query.WhereValue, b: types.query.WhereValue) => a < b,
    ">": (a: types.query.WhereValue, b: types.query.WhereValue) => a > b,
  };

  compare(
    operator: types.query.WhereOperator,
    a: types.query.WhereValue,
    b: types.query.WhereValue
  ): boolean {
    return this.operators[operator](a, b);
  }

  static toGql(queries: types.Query): DocumentNode {
    return gql(
      `query { ${Object.keys(queries).map(
        (key) => `${key} { ${Query.toGql(queries[key])} }`
      )} }`
    );
  }
}
