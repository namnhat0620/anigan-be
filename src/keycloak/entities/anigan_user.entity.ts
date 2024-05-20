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
        type: 'int',
        default: 0
    })
    number_of_generated: number;

    @ManyToOne(() => PlanEntity, plan => plan.users)
    plan: PlanEntity;

    @Column({
        type: 'timestamp',
    })
    expired_at: Date;
}