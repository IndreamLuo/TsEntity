import { EntityBase } from "../../entity-set";
import { table } from "../../decorators";

@table('Company')
export class Company extends EntityBase<Company> {
    id!: number;
    name!: string;
}