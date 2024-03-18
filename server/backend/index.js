const express = require('express')
const mysql = require('mysql')
const cors =  require('cors')


const app = express()

const db=mysql.createConnection({
    host:"localhost",
    user:"reactUser",
    password:"51462JoJo",
    database:"cs348project"
})

// to send from html body
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    const q = "SELECT * FROM test"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.listen(8800,()=>{
    console.log("Connect to backend.")
})