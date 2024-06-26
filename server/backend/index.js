const express = require('express')
const mysql = require('mysql')
const cors =  require('cors')
const {Sequelize, DataTypes} = require('sequelize')

//Indexes exist on trip.id, trip.startTime, trip.endDate
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


app.post("/api/trips/filter", (req, res)=>{
    console.log("recieved form from React for filter trips");
    console.log("body is " + JSON.stringify(req.body));
    let q = `SELECT trip.*, 
            TIMEDIFF(trip.endTime, trip.startTime) as duration,
            make,
            model,
            firstName,
            lastName,
            startWarehouse.id as startWarehouseID,
            endWarehouse.id as endWarehouseID,
            endWarehouse.name as destinationName, 
            endWarehouse.address as destinationAddress,
            startWarehouse.name as startName, 
            startWarehouse.address as startAddress,
            tot1.conflictingTruckTrips,
            dot1.conflictingDriverTrips
            FROM trip
            JOIN driver ON driver.licenseNumber = trip.driverLicenseNumber
            JOIN truck ON truck.plateNumber = trip.truckPlateNumber
            JOIN warehouse startWarehouse ON startWarehouse.id = startWarehouseID
            JOIN warehouse endWarehouse ON endWarehouse.id = endWarehouseID
            LEFT JOIN (
                SELECT truckOverlapTrip1.id, count(truckOverlapTrip2.id) as conflictingTruckTrips
                FROM trip truckOverlapTrip1
                JOIN trip truckOverlapTrip2
                    ON truckOverlapTrip1.id != truckOverlapTrip2.id AND truckOverlapTrip1.truckPlateNumber = truckOverlapTrip2.truckPlateNumber AND
                    ((truckOverlapTrip1.startTime BETWEEN truckOverlapTrip2.startTime AND truckOverlapTrip2.endTime) OR
                    (truckOverlapTrip1.endTime BETWEEN truckOverlapTrip2.startTime AND truckOverlapTrip2.endTime) OR
                    (truckOverlapTrip1.startTime <= truckOverlapTrip2.startTime AND truckOverlapTrip1.endTime >= truckOverlapTrip2.endTime))
                GROUP BY truckOverlapTrip1.id
            ) AS tot1 ON tot1.id = trip.id
            LEFT JOIN (
                SELECT driverOverlapTrip1.id, COUNT (driverOverlapTrip2.id) as conflictingDriverTrips
                FROM trip driverOverlapTrip1
                JOIN trip driverOverlapTrip2
                    ON driverOverlapTrip1.id != driverOverlapTrip2.id AND driverOverlapTrip1.driverLicenseNumber = driverOverlapTrip2.driverLicenseNumber AND
                    ((driverOverlapTrip1.startTime BETWEEN driverOverlapTrip2.startTime AND driverOverlapTrip2.endTime) OR
                    (driverOverlapTrip1.endTime BETWEEN driverOverlapTrip2.startTime AND driverOverlapTrip2.endTime) OR
                    (driverOverlapTrip1.startTime <= driverOverlapTrip2.startTime AND driverOverlapTrip1.endTime >= driverOverlapTrip2.endTime))
                GROUP BY driverOverlapTrip1.id
            ) AS dot1 ON dot1.id = trip.id
            WHERE `;
    if ((req.body.minID != undefined) && (req.body.minID != "")) {
        q = q + "trip.id >= " + req.body.minID + " AND ";
    }
    if ((req.body.maxID != undefined) && (req.body.maxID != "")) {
        q = q + "trip.id <= " + req.body.maxID + " AND ";
    }
    if ((req.body.fromWarehouseID != undefined) && (req.body.fromWarehouseID != "")) {
        q = q + "startWarehouseID = " + req.body.fromWarehouseID + " AND "
    }
    if ((req.body.toWarehouseID != undefined) && (req.body.fromWarehouseID != "")) {
        q = q + "endWarehouseID = " + req.body.toWarehouseID + " AND "
    }
    if ((req.body.driverID != undefined) && (req.body.driverID != "")) {
        q = q + "driver.licenseNumber = " + req.body.driverID + " AND "
    }
    if ((req.body.startDateMin != undefined) && (req.body.startDateMin != "")) {
        q = q + "trip.startTime >=\"" + req.body.startDateMin + "\" AND "
    }
    if ((req.body.startDateMax != undefined) && (req.body.startDateMax != "")) {
        q = q + "trip.startTime <=\"" + req.body.startDateMax + "\" AND "
    }
    if ((req.body.endDateMin != undefined) && (req.body.endDateMin != "")) {
        q = q + "trip.endTime >=\"" + req.body.endDateMin + "\" AND "
    }
    if ((req.body.endDateMax != undefined) && (req.body.endDateMax != "")) {
        q = q + "trip.endTime <=\"" + req.body.endDateMax + "\" AND "
    }
    q = q + "1 = 1";
    //console.log(q)
    db.query(q, (err,data) => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json(data)
    })
})

app.listen(8800,()=>{
    console.log("Backend API listening on port 8800")
})