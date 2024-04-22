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
    const [durationMin, updateDurationMin] = useState(undefined);
    const [durationMax, updateDurationMax] = useState(undefined);
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
            durationMin:durationMin,
            durationMax:durationMax,
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
                Minimum Trip ID
                <input name="minIDInput" type="number" onChange={e=>{updateMinID(parseInt(e.target.value))}}/>
                Maximum Trip ID
                <input name="maxIDInput" type="number" onChange={e=>{updateMaxID(parseInt(e.target.value))}}/>
                Start Warehouse ID
                <input name="startWarehouseID" type="number" onChange={e=>{updateFromWarehouseID(parseInt(e.target.value))}}/>
                Destination Warehouse ID
                <input name="endWarehouseID" type="number" onChange={e=>{updateToWarehouseID(parseInt(e.target.value))}}/>
                Driver License Number
                <input name="driverID" type="text" onChange={e=>{updateDriverID(e.target.value)}}/>
                Truck Plate Number
                <input name="truckID" type="text" onChange={e=>{updateTruckID(e.target.value)}}/>
                <button>Search</button>
            </form>
            <table>
                <tr>
                    <th>Trip ID</th>
                    <th>Driver Name</th>
                    <th>Truck Make and Model</th>
                    <th>Departure Warehouse Name and Address</th>
                    <th>Destination Warehouse Name and Address</th>
                    <th>Departure Time</th>
                    <th>Arrival Time</th>
                    <th>Trip Duration</th>
                    <th>Overlapping Trips</th>
                </tr>
                {trips.map(trip => {
                //console.log(trip);
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
                            
                        </tr>
                    )
            })}
            </table>
        </div>
    )
}

export default TripsFilter