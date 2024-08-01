import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';

const moment = require('moment');

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) { }

    async findByUsuario(usuario: string): Promise<Usuario | undefined> {
        return await this.usuarioRepository.findOne({
            where: {
                usuario: usuario
            }
        })
    }

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find();

    }

    async findById(id: number): Promise<Usuario> {

        let usuario = await this.usuarioRepository.findOne({
            where: {
                id
            }
        });

        if (!usuario)
            throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);

        return usuario;

    }

    public ageFromDateOfBirthday(dateOfBirth: any): number {
        const now = moment(); // Obter o momento atual
        const birthDate = moment(dateOfBirth); // Transformar dateOfBirth em momento
        
        if (!birthDate.isValid()) {
            throw new Error("Data de nascimento inválida");
        }
    
        return now.diff(birthDate, 'years'); // Calcular a diferença em anos
    }

    async create(usuario: Usuario): Promise<Usuario> {
        
        let buscaUsuario = await this.findByUsuario(usuario.usuario);

        let idadeUsuario = this.ageFromDateOfBirthday(usuario.nascimento);

        if (idadeUsuario < 18) {
            throw new HttpException("O Usuario não tem idade o bastante para cadastro!", HttpStatus.BAD_REQUEST);
        }

        if (!buscaUsuario) {
            usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
            return await this.usuarioRepository.save(usuario);
        }

        throw new HttpException("O Usuario ja existe!", HttpStatus.BAD_REQUEST);

    }

    async update(usuario: Usuario): Promise<Usuario> {

        let updateUsuario: Usuario = await this.findById(usuario.id);
        let buscaUsuario = await this.findByUsuario(usuario.usuario);

        if (!updateUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        if (buscaUsuario && buscaUsuario.id !== usuario.id)
            throw new HttpException('Usuário (e-mail) já Cadastrado!', HttpStatus.BAD_REQUEST);

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
        return await this.usuarioRepository.save(usuario);

    }

}
