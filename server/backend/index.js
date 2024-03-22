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

app.get("/api/trips",(req,res)=>{ //natural join the truck, driver, and warehouse tables
    console.log("sending trip table query data");
    const q = "SELECT * FROM trip ORDER BY id ASC"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        //console.log(data)
        res.json(data)
    })
})

app.post("/api/trips/add",(req,res)=>{
    console.log("recieved form from react for trips");
    console.log(req.body);
    const q = `INSERT INTO trip VALUES ( ${req.body.id}, ${req.body.driver}, ${req.body.truck}, ${req.body.description}, FORMAT(${req.body.startTime}, \'yyyy-MM-ddTHH:mm:ss\'), FORMAT(${req.body.endTime}, \'yyyy-MM-ddTHH:mm\'), ${req.body.startWarehouse}, ${req.body.destinationWarehouse})`
    //verify that the q string is correct, then send it to the database and verify that its sendign properly
})

app.listen(8800,()=>{
    console.log("Backend API listening on port 8800")
})