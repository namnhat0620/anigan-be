import { userInfo } from "os";
import { BaseEntity } from "src/common/base-entity.entity";
import { AniganUserEntity } from "src/keycloak/entities/anigan_user.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('ani_plan')
export class PlanEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    plan_id: number;

    @Column({
        type: 'text',
    })
    name: string;

    @Column({
        type: 'text',
    })
    amount: string;

    @Column({
        type: 'int',
    })
    period: number;

    @Column({
        type: 'int',
    })
    number_of_generation: number;

    @OneToMany(() => AniganUserEntity, user => user.plan)
    users: AniganUserEntity[];
}