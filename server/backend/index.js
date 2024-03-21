const express = require('express')
const mysql = require('mysql')
const cors =  require('cors')


const app = express()

const db=mysql.createConnection({
    host:"localhost",
    port:"3306",
    user:"root",
    password:"root",
    database:"cs348project"
})

db.connect(function(err) {
    if (err) throw err;
    console.log("connected to database");
})

// to send from html body
app.use(express.json())
app.use(cors())

app.get("/api",(req,res)=>{
    console.log("Sending test table query data");
    const q = "SELECT * FROM test"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.listen(8800,()=>{
    console.log("Backend API listening on port 8800")
})