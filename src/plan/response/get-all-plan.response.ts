import { PlanEntity } from "../entity/plan.entity";

export class GetAllPlanResponse {
    plan_id: number;
    name: string;
    amount: string;
    number_of_generation: number;
    period: number

    constructor(data: PlanEntity) {
        this.plan_id = data?.plan_id;
        this.name = data?.name;
        this.amount = data?.amount;
        this.number_of_generation = data?.number_of_generation;
        this.period = data?.period;
    }

    static mapToList(data?: PlanEntity[]) {
        return data.map(item => new GetAllPlanResponse(item))
    }
}