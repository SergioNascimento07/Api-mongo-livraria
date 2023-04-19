import criaColecaoUser from "../models/Livro.js";
import jsonwebtoken from 'jsonwebtoken'
import User from "../models/User.js";
import {scryptSync} from "crypto"
import { timingSafeEqual } from "crypto";

export default class Services {
    static async listaLivros(idUserToken) {
        const idUser = jsonwebtoken.verify(idUserToken, process.env.CHAVE_TOKEN).id
        const collection = criaColecaoUser(idUser)
        return await collection.find()
    }

    static async salvarLivro(idUserToken, contentLivro) {
        const idUser = jsonwebtoken.verify(idUserToken, process.env.CHAVE_TOKEN).id
        const collection = criaColecaoUser(idUser) //  || mongoose.models.idUser
        let livro = new collection(contentLivro);
        return await livro.save()
    }

    static async removeLivro(idUserToken, idLivro) {
        const idUser = jsonwebtoken.verify(idUserToken, process.env.CHAVE_TOKEN).id
        const collection = criaColecaoUser(idUser)
        return await collection.findByIdAndRemove(idLivro)
    }

    static async filtrarLivro(idUserToken, query) {
        const idUser = jsonwebtoken.verify(idUserToken, process.env.CHAVE_TOKEN).id
        const collection = criaColecaoUser(idUser)
        let expressao = new RegExp(query, "i")
        const todosLivros = await collection.find()
        const livrosSelecionados = todosLivros.filter(livro=> expressao.test(livro.titulo)|| expressao.test(livro.autor))
        return livrosSelecionados
    }

    static async modificarLivro(idUserToken, idLivro, atualizacoes) {
        const idUser = jsonwebtoken.verify(idUserToken, process.env.CHAVE_TOKEN).id
        const collection = criaColecaoUser(idUser)
        return await collection.findOneAndUpdate({_id: idLivro}, atualizacoes)
    }

    static async cadastrarUsuario(name, email, password, confirmPassword) {
        if (!name) {
            return res.status(422).json({ msg: "O nome é obrigatório!" });
        }

        if (!email) {
            return res.status(422).json({ msg: "O email é obrigatório!" });
        }

        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }

        if (password != confirmPassword) {
            return res
            .status(422)
            .json({ msg: "A senha e a confirmação precisam ser iguais!" });
        }

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
        }

        const passwordHash = scryptSync(password, process.env.CRYPTO_SAL, 64).toString('hex')
        
        const novoUsuario = new User({
            name: name,
            email: email,
            passwordHash: passwordHash
        })
        return await novoUsuario.save()
    }

    static async logarUser(email, password) {
        const user = await User.findOne({email:email})

        if (user) {
            let passwordGuardada = user.passwordHash
            passwordGuardada = Buffer.from(passwordGuardada, 'hex')
            const passwordHash = scryptSync(password, process.env.CRYPTO_SAL, 64)
            const teste = timingSafeEqual(passwordHash, passwordGuardada)
            if (teste) {
                const token = jsonwebtoken.sign({
                    id: user._id
                }, process.env.CHAVE_TOKEN)
                // this.colecao = criaColecaoUser(user._id)
                return {token: token}
            } 
        }
    }
}