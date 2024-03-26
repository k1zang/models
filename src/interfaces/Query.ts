export type WhereValue = string | number | boolean;
export type WhereObject = Record<string, WhereValue>;
export type WhereOperator = "=" | "==" | "<" | ">";
export type WhereArray = [string, WhereOperator, WhereValue];
export type WhereClause = WhereObject | WhereArray;
export type Stack = Array<object>;
export type WithObject = { [key: string]: Query };
export type WithArray = Array<string>;
export type WithClause = WithObject | WithArray;

export default interface Query {
  where?: WhereClause;
  with?: WithClause;
}
