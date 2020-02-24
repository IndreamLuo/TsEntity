import { Domain } from "./domain";
export declare abstract class EntityDomain extends Domain {
    abstract GetQueryString(): string;
}
