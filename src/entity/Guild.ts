import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Guild extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ default: true })
  isCached: boolean;

  @Column()
  prefix: string;
}
