import express from 'express'
import router from './routes/rotas.js'
import db from './repository/conMongo.js'

const app = express()
const PORT = process.env.PORT || 3000

db.on("error", console.log.bind(console, 'Erro de conexão')) 
db.once("open", ()=>{
    console.log("conexão com o banco feita com sucesso")
})

// app.use(router)
app.use(express.json(), router, express.static('public'))
// app.use()


app.listen(PORT, ()=>{
    console.log(`Servidor ouvido em http://localhost:${PORT}`)
})