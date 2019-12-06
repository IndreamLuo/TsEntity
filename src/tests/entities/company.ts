import { EntityBase } from "../../entity-set";

export class Company extends EntityBase<Company> {
    id!: number;
    name!: string;
}