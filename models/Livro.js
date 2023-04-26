import mongoose from 'mongoose'

function criaColecaoUser(idUser) { 
    const livroschema = new mongoose.Schema({
        "id": {type:String},
        "titulo": {type: String, required: true},
        "autor": {type: String, required: true},
        "genero": {type: String, required: true},
        "img": {type: String}
    })
    mongoose.models = {} 
    const collectionLivro = mongoose.model(`${idUser}`, livroschema)
    return collectionLivro
}

export default criaColecaoUser