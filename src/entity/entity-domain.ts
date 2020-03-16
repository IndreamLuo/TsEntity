import { Domain } from "../domain";

export abstract class EntityDomain extends Domain {
    abstract GetQueryString(): string;
}