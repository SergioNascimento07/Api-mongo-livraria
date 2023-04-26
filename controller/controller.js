//IMPLEMENTAR SINGLETON OU NÃO???

import {scryptSync, timingSafeEqual} from 'crypto'
// import livros from '../models/Livro.js'
import User from '../models/User.js'
import dotenv from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import criaColecaoUser from '../models/Livro.js'
import Services from '../service/Service.js'

dotenv.config()
//declarar model apenas uma vez usando orientacao a objetos, quando logar 
class controlador {
    static async mostrarLivros(req, res) {
        const idUserToken = req.headers.authorization
        res.send(await Services.listaLivros(idUserToken))
    }

    static async adicionarLivro(req, res) {
        const conteudoLivro = req.body
        const idUserToken = req.headers.authorization
        res.send(Services.salvarLivro(idUserToken, conteudoLivro))
    }

    static async deletaLivro(req, res) {
        const idUserToken = req.headers.authorization
        let idLivro = req.params.id
        res.send(await Services.removeLivro(idUserToken, idLivro))
    }

    static async livrosFiltrados(req, res) {
        const idUserToken = req.headers.authorization
        let query = req.query.query
        res.send(await Services.filtrarLivro(idUserToken, query))
    }

    static async atualizarLivro(req, res) {
        const idUserToken = req.headers.authorization
        let idLivro = req.params.id
        let atualizacoes = req.body
        res.send("livro: " + await Services.modificarLivro(idUserToken, idLivro, atualizacoes) + " atualizado com sucesso")
    }

    static async cadastrarUsuario(req, res) {
        const {name, email, password, confirmPassword} = req.body 
        res.status(201).send("Usuario cadastrado com sucesso: " + await Services.cadastrarUsuario(name, email, password, confirmPassword, res))
    }

    static async loginUser(req, res) {
        const {email, password} = req.body
        res.send(await Services.logarUser(email, password))
    }
}

export default controlador