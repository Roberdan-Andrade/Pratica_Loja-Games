import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CategoriaService } from "../services/categoria.service";
import { Categoria } from "../entities/categoria.entity";

@Controller("/categorias")
export class CategoriaController{
    constructor(private readonly categoriaServices: CategoriaService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    FindAll(): Promise<Categoria[]> {
        return this.categoriaServices.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    FindById(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
        return this.categoriaServices.findById(id);
    }

    @Get('/genero_Um/:genero_Um')
    @HttpCode(HttpStatus.OK)
    FindByGeneroUm(@Param('genero_Um') genero: string): Promise<Categoria[]> {
        return this.categoriaServices.findByGeneroUm(genero);
    }

    @Get('/genero_Dois/:genero_Dois')
    @HttpCode(HttpStatus.OK)
    FindByGeneroDois(@Param('genero_Dois') genero: string): Promise<Categoria[]> {
        return this.categoriaServices.findByGeneroDois(genero);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    Create(@Body() Categoria: Categoria): Promise<Categoria> {
        return this.categoriaServices.create(Categoria);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    Update(@Body() Categoria: Categoria): Promise<Categoria> {
        return this.categoriaServices.update(Categoria);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    Delete(@Param('id', ParseIntPipe) id: number){
        return this.categoriaServices.delete(id);
    }    
}
