import { BaseEntity } from "src/common/base-entity.entity";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('ani_image')
export class ImageEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    image_id: number;

    @Column({
        type: 'text',
    })
    url: string;

    @Column({
        type: 'int',
    })
    type: number;
}