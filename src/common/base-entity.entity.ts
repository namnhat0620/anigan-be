import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, UpdateDateColumn, BaseEntity as TypeORMBaseEntity } from "typeorm";

export class BaseEntity extends TypeORMBaseEntity {
    @Column({
        type: 'text',
    })
    created_by: string;

    @CreateDateColumn({
        type: 'timestamp',
    })
    created_at: Date;

    @Column({
        type: 'text',
    })
    updated_by: string;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    updated_at: Date;

    @BeforeInsert()
    setCreationDetails() {
        this.created_at = new Date();
        // Set created_by in service
    }

    @BeforeUpdate()
    setUpdateDetails() {
        this.updated_at = new Date();
        // Set updated_by in service
    }
}