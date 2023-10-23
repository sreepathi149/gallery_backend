require("dotenv").config()
const express = require('express')
const cors = require('cors')
const app = express()
const configureDb = require("./configure/db")
const upload = require('./app/middlewares/multer')

const photoCltr = require("./app/controllers/photo-controller")
const userCltr = require("./app/controllers/user-controller")
const authenticateUser = require("./app/middlewares/authenticate-user")

app.use(cors())
app.use(express.json())
app.use(express.static("uploads"))
configureDb()

const port = 4477

app.post('/api/user/login', userCltr.login)
app.post('/api/user/register', userCltr.register)
app.get('/api/users', authenticateUser, userCltr.users)

app.post('/api/create-photo', authenticateUser, upload.array('path', 5), photoCltr.create)
app.get('/api/get-photos', photoCltr.getPhotos)
app.get('/api/get-photo/:id', photoCltr.getPhoto)
app.put('/api/update-views/:id', photoCltr.update)
app.put('/api/update-tags/:id', authenticateUser, photoCltr.updateTags)
app.put('/api/delete-image/:id', authenticateUser, photoCltr.deleteImage)
app.delete('/api/delete-photo/:id', authenticateUser, photoCltr.delete)

app.listen(port, () => {
    console.log("server connected on port", port)
})