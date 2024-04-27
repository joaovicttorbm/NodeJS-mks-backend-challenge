import { IsNotEmpty, IsString, MinLength, MaxLength,IsEmail } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Film } from "./Film";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({type: 'text', nullable: false})
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
    name: string;
  
    @Column({type: 'text', nullable: false})
    @IsEmail({}, { message: 'Email inválido' })
    email: string;
  
    @Column({type: 'text', nullable: false})
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string;

    @OneToMany(() => Film, film => film.user)
    films: Film[];
  
    constructor(name: string, email: string, password: string) {
      this.name = name;
      this.email = email   
      this.password = password;
    }
}