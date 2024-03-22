const express = require('express')
const mysql = require('mysql')
const cors =  require('cors')


const app = express()

const db=mysql.createConnection({
    host:"34.69.74.65",
    port:"3306",
    user:"root",
    password:"rootpwd",
    database:"truckSchedule"
})

db.connect(function(err) {
    if (err) throw err;
    console.log("connected to database");
})

// to send from html body
app.use(express.json())
app.use(cors())
app.set('json spaces', 40);

app.get("/api/trucks",(req,res)=>{
    console.log("Sending truck table query data");
    const q = "SELECT * FROM truck"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        //console.log(data)
        res.json(data)
    })
})

app.get("/api/drivers",(req,res)=>{
    console.log("Sending driver table query data");
    const q = "SELECT * FROM driver"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        //console.log(data)
        res.json(data)
    })
})

app.get("/api/warehouses",(req,res)=>{
    console.log("Sending warehouse table query data");
    const q = "SELECT * FROM warehouse"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        //console.log(data)
        res.json(data)
    })
})

app.get("/api/trips",(req,res)=>{
    console.log("sending trip table query data");
    const q = "SELECT * FROM trip"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        //console.log(data)
        res.json(data)
    })
})

app.post("/api/trips",(req,res)=>{
    console.log("recieved form from react for trips");
    //this function needs to successfully add, edit, and delete trips from the database based on the request
})

app.listen(8800,()=>{
    console.log("Backend API listening on port 8800")
})