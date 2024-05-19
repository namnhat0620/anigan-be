import { PlanEntity } from "src/plan/entity/plan.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity('ani_user')
export class AniganUserEntity {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({
        type: 'text',
    })
    keycloak_user_id: string;

    @Column({
        type: 'text',
        default: 0
    })
    number_of_generated: string;

    @ManyToOne(() => PlanEntity, plan => plan.users)
    plan: PlanEntity;
}