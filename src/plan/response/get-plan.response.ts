export class GetPlanResponse {
    expired_day: string;
    remain_generation: number

    constructor(data: GetPlanResponse) {
        this.expired_day = data?.expired_day
        this.remain_generation = data?.remain_generation
    }
}