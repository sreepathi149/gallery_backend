const Photo = require("../models/photo-model");

const photoCltr = {}

photoCltr.create = async (req, res) => {
    try {
        const body = req.body
        const files = req.files
        if(Object.keys(body).length === 0) {
            return res.status(404).json({error: "data fields not found"})
        }
        if(!body.title || !body.description || !body.category ){
            return res.status(400).json({error: "invalid data "})
        }
        if(files.length === 0) {
            return res.status(404).json({error: "no files found"})
        }
        const photo = new Photo(body)
        photo.path = files.map(file => {return {name: file.filename}})
        const photoDoc = await photo.save()
        res.json(photoDoc)
    } catch(e) {
        res.json(e)
    }
}

photoCltr.getPhotos = async (req, res) => {
    try {
        const photo = await Photo.find()
        res.json(photo)
    } catch(e) {
        res.json(e)
    }
}

photoCltr.getPhoto = async (req, res) => {
    try {
        const id = req.params.id
        if(!id) {
            return res.status(404).json({error: "id is required"})
        }
        const photo = await Photo.findOne({_id: id})
        res.json(photo)
    } catch(e) {
        res.json(e)
    }
}

photoCltr.update = async (req, res) => {
    try {
        const id = req.params.id
        const {views, imgId} = req.body
        if(!id){
            return res.status(404).json({error: "id is required"})
        }
        if(!views || !imgId){
            return res.status(400).json({error: "invalid details"})
        }
        const photo = await Photo.findOneAndUpdate({ _id : id, "path._id": imgId},  { $inc: { 'path.$.views': views } }, { runValidations: true, new: true })
        res.json(photo)
    } catch(e) {
        res.json(e)
    }
}

photoCltr.updateTags = async (req, res) => {
    try {
        const id = req.params.id
        const {tags,imgId} = req.body
        if(!id || !imgId){
            return res.status(404).json({error: "id's is required"})
        }
        if(tags.length === 0 ){
            return res.status(400).json({error: "invalid details"})
        }
        const data = tags.map((tag) => {return {user: tag.value}})
        const photo = await Photo.findOneAndUpdate({ _id: id, "path._id": imgId},  { $push: { 'path.$.tags': data } }, { runValidations: true, new: true })
        res.json(photo)
    } catch(e) {
        res.json(e)
    }
}

photoCltr.deleteImage = async (req, res) => {
    try {
        const id = req.params.id
        const {imgId} = req.body
        if(!id || !imgId){
            return res.status(404).json({error: "id's is required"})
        }
        const photo = await Photo.findOneAndUpdate({_id: id}, { $pull: { path: {_id: imgId} } }, { runValidations: true, new: true } )
        res.json(photo)
    } catch(e) {
        res.json(e)
    }
}

photoCltr.delete = async (req, res) => {
    try {
        const id = req.params.id
        if(!id){
            return res.status(404).json({error: "id is required"})
        }
        const photo = await Photo.findOneAndDelete({_id: id})
        res.json(photo)
    } catch(e) {
        res.json(e)
    }
}

module.exports = photoCltr