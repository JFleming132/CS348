import {useState, useEffect} from 'react'

const TripsFilter = () => {
    const [minID, updateMinID] = useState(undefined);
    const [maxID, updateMaxID] = useState(undefined);
    const [toWarehouseID, updateToWarehouseID] = useState(undefined);
    const [fromWarehouseID, updateFromWarehouseID] = useState(undefined);
    const [driverID, updateDriverID] = useState(undefined);
    const [truckID, updateTruckID] = useState(undefined);
    const [startDateMin, updateStartDateMin] = useState(undefined);
    const [startDateMax, updateStartDateMax] = useState(undefined);
    const [endDateMin, updateEndDateMin] = useState(undefined);
    const [endDateMax, updateEndDateMax] = useState(undefined);
    const [trips, setTrips] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const filterOptions = {
            minID:minID,
            maxID:maxID,
            toWarehouseID:toWarehouseID,
            fromWarehouseID:fromWarehouseID,
            driverID:driverID,
            truckID:truckID,
            startDateMin:startDateMin,
            startDateMax:startDateMax,
            endDateMin:endDateMin,
            endDateMax:endDateMax,
        }
        console.log(filterOptions);
        const requestOptions = {
            method: "POST",
            headers: {
            "Content-Type":"application/json"
            },
            body: JSON.stringify(filterOptions)
        }
        fetch("/api/trips/filter", requestOptions).then(response=>response.json()).then(data=> {
            if (data.errno) {
                alert("SQL error. Errno: " + data.errno)
            } else {
                setTrips(data);
            }
        })

        //send the filters to the backend and use a stored procedure to return a query
    }
    //set up forms for the rest of the fields
    return (
        <div>
            Trucks Search Filters
            <form onSubmit={handleSubmit}>
                <div>
                    Minimum Trip ID
                    <input name="minIDInput" type="number" onChange={e=>{updateMinID(parseInt(e.target.value))}}/>
                    Maximum Trip ID
                    <input name="maxIDInput" type="number" onChange={e=>{updateMaxID(parseInt(e.target.value))}}/>
                </div>
                <div>
                    Start Warehouse ID
                    <input name="startWarehouseID" type="number" onChange={e=>{updateFromWarehouseID(parseInt(e.target.value))}}/>
                    Destination Warehouse ID
                    <input name="endWarehouseID" type="number" onChange={e=>{updateToWarehouseID(parseInt(e.target.value))}}/>
                </div>
                <div>
                    Driver License Number
                    <input name="driverID" type="text" onChange={e=>{updateDriverID(e.target.value)}}/>
                </div>
                <div>
                    Truck Plate Number
                    <input name="truckID" type="text" onChange={e=>{updateTruckID(e.target.value)}}/>
                </div>
                <div>
                    Departing After:
                    <input name="startDateMin" type="datetime-local" onChange={e=>{updateStartDateMin(e.target.value.replace("T", " ").slice(0, 19))}}/>
                    Departing Before:
                    <input name="startDateMax" type="datetime-local" onChange={e=>{updateStartDateMax(e.target.value.replace("T", " ").slice(0, 19))}}/>
                </div>
                <div>
                    Arriving After:
                    <input name="endDateMin" type="datetime-local" onChange={e=>{updateEndDateMin(e.target.value.replace("T", " ").slice(0, 19))}}/>
                    Arriving Before:
                    <input name="endDateMax" type="datetime-local" onChange={e=>updateEndDateMax(e.target.value.replace("T", " ").slice(0, 19))}/>
                </div>
                <button>Search</button>
            </form>
            <table border="1">
                <tr>
                    <th>Trip ID</th>
                    <th>Driver Name</th>
                    <th>Truck Make and Model</th>
                    <th>Departure Warehouse Name and Address</th>
                    <th>Destination Warehouse Name and Address</th>
                    <th>Departure Time</th>
                    <th>Arrival Time</th>
                    <th>Trip Duration</th>
                    <th>
                        <div>Overlapping Trips</div> 
                        <div>with the same truck</div>
                    </th>
                    <th>
                        <div>Overlapping Trips</div> 
                        <div>with the same driver</div>
                    </th>
                </tr>
                {trips.map(trip => {
                console.log(trip);
                    return (
                        <tr>
                            <td>{trip.id}</td>
                            <td>{trip.firstName} {trip.lastName}</td>
                            <td>{trip.make} {trip.model}</td>
                            <td>{trip.startName} at address {trip.startAddress}</td>
                            <td>{trip.destinationName} at address {trip.destinationAddress}</td>
                            <td>{trip.startTime}</td>
                            <td>{trip.endTime}</td>
                            <td>{trip.duration}</td>
                            <td>{trip.conflictingTruckTrips}</td>
                            <td>{trip.conflictingDriverTrips}</td>
                        </tr>
                    )
            })}
            </table>
        </div>
    )
}

export default TripsFilter