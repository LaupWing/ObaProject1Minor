const express = require("express")
const app = express()
const path = require("path")
const port = 3000
// import {getITems} from "./"

app.listen(port)
app.set('view engine', 'ejs')
app.set("views", "view")
app.get("/", renderHome)

app.use(express.static("static"))
function renderHome(req, res){
    res.render('index')
}