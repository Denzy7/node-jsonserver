const express = require('express')
const bodyParser = require('body-parser')
const {writeFileSync, readFileSync, Stats} = require('fs')
const { response } = require('express')
const { request } = require('http')

const port = 8080
const json_file = "data.json"

// express ctor
const app = express()

// allows parsing of received json
app.use(bodyParser.json())

// allows serving of a single directory on server
app.use(express.static("app-frontend"))

// json initializer data to store our responses
const json_init_dat=
{
    "responses" : [0, 0, 0, 0, 0, 0, 0]
}

// read the json file to a json object
function json_read()
{
    return JSON.parse(readFileSync(json_file))
}

// convert json object to string then write to server
function json_write(json)
{
    writeFileSync(json_file, JSON.stringify(json))
}

// check json. on error, write a new json file to server filesys
function json_check()
{
    try{
        json_read()
    }catch(err)
    {
        console.log("read error. creating new json")
        json_write(json_init_dat)
    }
}
json_check();

/* SERVER REQUESTS*/

// NOTE: #1 = its in string format NOT a JSON object. So JSON.parse on frontend

// sends the current json in server filesys , #1
app.get('/getjson', (request, response) =>
{
    console.log("getjson : " + request.ip)
    response.sendFile(json_file, {root: __dirname})
})

// sends an empty init json for filling by frontend, #1
app.get('/getinit', (request, response) =>
{
    console.log("getinit : " + request.ip)
    response.send(JSON.stringify(json_init_dat))
})

// post request from frontend to write a json object
app.post('/postjson', (request, response) =>
{
    // read server json
    rd = json_read()

    // get frontend json from body. dont parse as bodyParser has already done so...
    fd = request.body

    // add the frontend responses to server json
    for(let i = 0; i < json_init_dat.responses.length; i++)
    {
        rd.responses[i] += fd.responses[i]
    }
    
    // write the added responses + log
    json_write(rd)

    console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString())
    console.log(rd)

    response.sendStatus(200)
})

var server = app.listen(port, ()=>
{
    console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString())
    console.log("started at http://localhost:" + server.address().port)
})