import GqlManager from "../services/resource/managers/Graphql";
import LocalManager from "../services/resource/managers/Local";
export type { default as Query } from "./Query";
export type * as query from "./Query";
export type ResourceManager = GqlManager | LocalManager;
export type QueryParameters = Partial<Parameters<GqlManager["client"]["query"]>>;
export type QueryReturnType = Promise<ReturnType<GqlManager["client"]["query"]> | any>;
