import dotenv from 'dotenv'
import  jsonwebtoken from 'jsonwebtoken'

dotenv.config()
//validação de token funcionando

function validaToken(req, res, next) {
   
    try {
        const token = req.headers.authorization
        jsonwebtoken.verify(token, process.env.CHAVE_TOKEN)
        next()
    } catch(err) {
        res.send("não validado")
    }
}

export default validaToken