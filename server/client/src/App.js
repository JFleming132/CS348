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

    const driverChange = (newVal) => {
        setDriverSelection(newVal);
    }
    const truckChange = (newVal) => {
        setTruckSelection(newVal);
    }
    const startWarehouseChange = (newVal) => {
        setStartWarehouseSelection(newVal);
    }
    const endWarehouseChange = (newVal) => {
        setEndWarehouseSelection(newVal);
    }

    const submitTripForm = (e) => {
        let newID = 0;
        fetch("/api/trips").then(response => response.json()).then(data => {
            console.log(data);
            data.forEach(trip => {
                if (trip.id == newID) {
                    newID = trip.id + 1;
                }
                const formData = new FormData(e.target.form);
                let queryData = Object.fromEntries(formData.entries());
                queryData = {...queryData, id:newID, description:"random description"};
                console.log(queryData);
                if ((queryData.startTime == "") ||
                (queryData.endTime == "") ||
                (queryData.driver == null) ||
                (queryData.truck == null) ||
                (queryData.startWarehouse == null) ||
                (queryData.destinationWarehouse == null)) {
                    console.log("invalid trip");
                    return;
                }
                const requestOptions = {
                    method: "POST",
                    headers: {
                    "Content-Type":"application/json"
                    },
                    body: JSON.stringify(queryData)
                }
                fetch("api/trips/add", requestOptions);
            })
        })
        e.preventDefault();
        
    }

    return (
        <div>
            <form>
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
                    Start time: <input name="startTime" type="datetime-local" onChange = {e => (setStartTime(e.target.value))}/>
                </div>
                <div>
                    End time: <input name="endTime" type="datetime-local" onChange = {e => (setEndTime(e.target.value))}/>
                </div>
                <div>
                    <button type="submit" onClick={submitTripForm}>Add trip</button>
                </div>
            </form>
            <Triplist/>
        </div>
    )
}
//there should be another web page that allows us to either edit or delete a trip based on trip id
export default App;
