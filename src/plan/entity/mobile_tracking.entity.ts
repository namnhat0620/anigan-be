import { PlanEntity } from "src/plan/entity/plan.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('ani_mobile_tracking')
export class MobileTrackingEntity {
    @PrimaryColumn()
    mobile_id: string;

    @Column({
        type: 'int',
        default: 0
    })
    number_of_generated: number;
}