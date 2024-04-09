import './App.css';
import React from "react";
import DriversDropdown from "./components/DriversDropdown.js"
import TrucksDropdown from "./components/TrucksDropdown.js"
import WarehouseDropdown from "./components/WarehouseDropdown.js"
import Triplist from "./components/Triplist.js"

function App() {
    const [driverSelection, setDriverSelection] = React.useState({});
    const [truckSelection, setTruckSelection] = React.useState({});
    const [startWarehouseSelection, setStartWarehouseSelection] = React.useState({});
    const [endWarehouseSelection, setEndWarehouseSelection] = React.useState({});
    const [startTime, setStartTime] = React.useState({});
    const [endTime, setEndTime] = React.useState({});
    const [tripID, setTripID] = React.useState({});
    const [doUpdateBool, setDoUpdateBool] = React.useState(false);

    const driverChange = (newVal) => {
        //console.log(newVal);
        setDriverSelection(newVal);
    }
    const truckChange = (newVal) => {
        //console.log(newVal);
        setTruckSelection(newVal);
    }
    const startWarehouseChange = (newVal) => {
        //console.log(newVal);
        setStartWarehouseSelection(newVal);
    }
    const endWarehouseChange = (newVal) => {
        //console.log(newVal);
        setEndWarehouseSelection(newVal);
    }

    const submitTripForm = (e) => {
        e.preventDefault();
        let newID = 0;
        //console.log("form submitted")
        //console.log(doUpdateBool);
        if (!doUpdateBool) {
            fetch("/api/getNewTripID").then(response => response.json()).then(data => {
                newID = 999;
            })
        } else {
            console.log("parsing id from state")
            newID = parseInt(tripID);
        }
        const formData = new FormData(e.target.form);
        let queryData = Object.fromEntries(formData.entries());
        queryData = {driver:driverSelection, truck:truckSelection, startWarehouse:startWarehouseSelection, destinationWarehouse:endWarehouseSelection, id:newID, description:"random description"};
        if ((startTime == "") ||
        (endTime == "") ||
        (startTime == null) ||
        (endTime == null) ||
        (queryData.driver == null) ||
        (queryData.truck == null) ||
        (queryData.startWarehouse == null) ||
        (queryData.destinationWarehouse == null)) {
            alert("invalid trip");
            //console.log(queryData);
            return;
        }
        console.log(queryData);
        queryData = {...queryData, startTime:startTime.replace("T", " ") + ":00", endTime:endTime.replace("T", " ") + ":00"}
        const requestOptions = {
            method: "POST",
            headers: {
            "Content-Type":"application/json"
            },
            body: JSON.stringify(queryData)
        }
        if (!doUpdateBool) {
            fetch("api/trips/add", requestOptions).then(response=>response.json()).then(data => {
                //console.log(data);
                if (data.errno) {
                    alert("SQL error. Errno: " + data.errno)
                } else {
                    window.location.reload();
                }
            })
        }
        else {
            fetch("api/trips/edit", requestOptions).then(response=>response.json()).then(data =>{
                //console.log(data);
                if (data.errno) {
                    alert("SQL error. Errno: " + data.errno)
                } else {
                    window.location.reload();
                }
            })
        }
    }

    return (
        <div>
            <form onSubmit={submitTripForm}>
                <div>
                    Driver:
                    <DriversDropdown name="driver" onChange={driverChange}/>
                </div>
                <div>
                    Truck: 
                    <TrucksDropdown name="truck" onChange={truckChange}/>
                </div>
                <div>
                    Starting Warehouse:
                    <WarehouseDropdown name="startWarehouse" onChange={startWarehouseChange}/>
                </div>
                <div>
                    Destination Warehouse:
                    <WarehouseDropdown name="destinationWarehouse" onChange={endWarehouseChange}/>
                </div>
                <div>
                    Start time: <input name="startTime" type="datetime-local" onChange = {e => {setStartTime(e.target.value)}}/>
                </div>
                <div>
                    End time: <input name="endTime" type="datetime-local" onChange = {e => (setEndTime(e.target.value))}/>
                </div>
                <div>
                    Update existing trip? <input name="updateBool" type="checkbox" checked={doUpdateBool} onChange={() => setDoUpdateBool(!doUpdateBool)}/>
                </div>
                <div>
                    TripID to update (optional): <input name="tripID" type="number" onChange = {e=>setTripID(e.target.value)}/>
                </div>
                <div>
                    <button type="submit">Add trip</button>
                </div>
            </form>
            <Triplist/>
        </div>
    )
}
//there should be another web page that allows us to either edit or delete a trip based on trip id
export default App;
