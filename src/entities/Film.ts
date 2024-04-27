import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("films")
export class Film {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false, unique: true })
  title: string;

  @Column({ type: "text", nullable: false })
  description: string;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }
}
