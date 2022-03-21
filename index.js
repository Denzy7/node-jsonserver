const {writeFileSync,readFileSync}=require('fs')
const express=require('express')
const bodyParser = require('body-parser');

const jsonf="js.json"

const port=8080

const app=express();
app.use(bodyParser.json());

const init_dat=
{
    "a":[0,0,0],
    "respsz":3
}

function readjson()
{
    return JSON.parse(readFileSync(jsonf))
}

function writejson(json)
{
    writeFileSync(jsonf,JSON.stringify(json))
}

function checkjson()
{
    try {
        readjson()    
    } catch (error) {
        console.log("read error. create new json")
        writejson(init_dat)
    }
}

checkjson()

app.get('/',(request,result)=>
{
    result.sendFile("survey.html",{root:__dirname})
});

app.get('/getjson',(request,result)=>
{
    result.sendFile(jsonf,{root:__dirname})
});

app.get('/getinit',(request,result)=>
{
    result.send(JSON.stringify(init_dat))
});

app.post('/savejson',(req,res)=>
{
    rd=readjson()

    for (let i = 0; i < init_dat.respsz; i++) {
        rd.a[i]+=req.body.a[i]
    }
    writejson(rd)

    console.log(rd,Date.now())

    res.sendStatus(200)
});

var server=app.listen(port ,()=>
{
console.log("start on http://localhost:"+server.address().port);
});