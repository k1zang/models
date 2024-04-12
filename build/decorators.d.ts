import Model from "./abstracts/Model";
export declare function relationOneToOne(relative: typeof Model): (model: any, property: any) => void;
export declare function relationOneToMany(relative: typeof Model): (model: any, property: any) => void;
