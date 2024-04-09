const express = require('express')
const mysql = require('mysql')
const cors =  require('cors')
const {Sequelize, DataTypes} = require('sequelize')


const app = express()

const db=mysql.createConnection({
    host:"34.69.74.65",
    port:"3306",
    user:"root",
    password:"rootpwd",
    database:"truckSchedule"
})

const sequelize = new Sequelize('truckSchedule', 'root', 'rootpwd', {
    host:"34.69.74.65", dialect: 'mysql'
})

const Trip = sequelize.define('Trips', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    truckPlateNumber: {
        type: DataTypes.STRING(15)
    },
    driverLicenseNumber: {
        type: DataTypes.STRING(15)
    },
    cargoDescription: {
        type: DataTypes.STRING(500)
    },
    startTime: {
        type: DataTypes.DATE
    },
    endTime: {
        type: DataTypes.DATE
    },
    startWarehouseID: {
        type: DataTypes.INTEGER
    },
    endWarehouseID: {
        type: DataTypes.INTEGER
    }
}, {tableName:'trip', timestamps:false})

sequelize.authenticate();

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
    const q = "SELECT trip.*, make, model, firstName, lastName, licenseNumber, endWarehouse.name as destinationName, endWarehouse.address as destinationAddress, startWarehouse.name as startName, startWarehouse.address as startAddress " +
              "FROM trip " +
              "JOIN driver ON driver.licenseNumber = trip.driverLicenseNumber " +
              "JOIN truck ON truck.plateNumber = trip.truckPlateNumber " +
              "JOIN warehouse startWarehouse ON startWarehouse.id = startWarehouseID " +
              "JOIN warehouse endWarehouse ON endWarehouse.id = endWarehouseID " +
              "ORDER BY trip.id ASC";
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        res.json(data)
    })
})

app.get("/api/getNewTripID", (req, res)=>{
    Trip.findAll({
        attributes: [
            [sequelize.fn('MAX', sequelize.col('id')), 'maxID']
        ]
    }).then(newID => res.json(newID))
})

app.post("/api/trips/add",(req,res)=>{
    console.log("recieved form from react for add trip");
    Trip.findAll({attributes:
        [[sequelize.fn('MAX', sequelize.col('id')), 'maxID']]
    }).then(row => {
        console.log(row[0].dataValues.maxID);
        const newTrip = Trip.create({
            id: row[0].dataValues.maxID + 1,
            driverLicenseNumber: req.body.driver,
            truckPlateNumber: req.body.truck,
            cargoDescription: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            startWarehouseID: req.body.startWarehouse,
            endWarehouseID: req.body.destinationWarehouse
        })
        res.json(newTrip)
    })
})

app.post("/api/trips/edit", (req,res) => {
    console.log("recieved form from react for edit trip");
    const q = `UPDATE trip SET id=${req.body.id}, driverlicenseNumber=${req.body.driver}, truckPlateNumber=\"${req.body.truck}\", cargoDescription=\"${req.body.description}\", startTime=\"${req.body.startTime}\", endTime=\"${req.body.endTime}\", startWarehouseID=${req.body.startWarehouse}, endWarehouseID=${req.body.destinationWarehouse} WHERE id=${req.body.id}`
    db.query(q,(err,data) => {
        if (err) return res.json(err)
        res.json(data)
    })
})

app.post("/api/trips/delete",(req,res)=>{
    console.log("recieved form from React for delete trip");
    const q = "DELETE FROM trip WHERE id = " + req.body.tripid;
    db.query(q, (err,data) => {
        if (err) return res.json(err)
        res.json(data)
    })
})


app.listen(8800,()=>{
    console.log("Backend API listening on port 8800")
})