const express = require('express')
const mongoose = require('mongoose')
//add that route to this
const hintRoutes = require('../route/HintRoutes')
const examRoutes = require('../route/ExamRoutes')

const app = express()

const cors = require("cors")
const bodyParser = require("body-parser")

app.use(cors())
app.use(bodyParser.json())

const mongoDbURL = "mongodb+srv://bhawan:200132400588@atlascluster.fl5bp73.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"

mongoose.connect(mongoDbURL)
.then(() => console.log('Database Connected Successfully.'))
.catch((err) => console.log(err))

//use that route
app.use('/hint', hintRoutes)
app.use('/exam', examRoutes)

app.listen(3000, () => console.log('Server Connected Successfully'))