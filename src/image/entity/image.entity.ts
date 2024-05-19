import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('ani_image')
export class ImageEntity {
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