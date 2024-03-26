import Model from "../..";

export default interface ModelConstructor {
  new (...args: any[]): Model;
}
