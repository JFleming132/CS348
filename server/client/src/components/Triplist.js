import {useState, useEffect} from "react";

const Triplist = () => {
  const [trips, setTrips] = useState([]);
  useEffect(() => {
      fetch("/api/trips").then(response => response.json()).then((data) => {
        //console.log(data);
        setTrips(data);
      });
  }, []);
  return (
    <div>
      {trips.map(trip => (
        <div>Leaving warehouseID {trip.startWarehouseID} at {trip.startTime}, arriving at warehouseID {trip.endWarehouseID} at {trip.endTime}.</div>
      ))}
    </div>
  )
}

export default Triplist