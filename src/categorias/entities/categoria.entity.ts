import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Produto } from "../../produtos/entities/produto.entity";

@Entity({name: "tb_categorias"})
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 100, nullable: false})
    genero_um: string;

    @Column({length: 100, nullable: true})
    genero_dois: string;

    @OneToMany(() => Produto, (produto) => produto.categoria)
    produto: Produto[]
}
