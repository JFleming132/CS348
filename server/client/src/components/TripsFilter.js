import {useState, useEffect} from 'react'

const TripsFilter = () => {
    const [minID, updateMinID] = useState({});
    const [maxID, updateMaxID] = useState({});
    const [toWarehouseID, updateToWarehouseID] = useState({});
    const [fromWarehouseID, updateFromWarehouseID] = useState({});
    const [driverID, updateDriverID] = useState({});
    const [truckID, updateTruckID] = useState({});
    const [startDateMin, updateStartDateMin] = useState({});
    const [startDateMax, updateStartDateMax] = useState({});
    const [endDateMin, updateEndDateMin] = useState({});
    const [endDateMax, updateEndDateMax] = useState({});
    const [durationMin, updateDurationMin] = useState({});
    const [durationMax, updateDurationMax] = useState({});

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
                <button>Search</button>
            </form>
        </div>
    )
}

export default TripsFilter