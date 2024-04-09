import {useState, useEffect} from "react";

const Triplist = () => {
  const [trips, setTrips] = useState([]);
  useEffect(() => {
      fetch("/api/trips").then(response => response.json()).then((data) => {
        //console.log(data);
        setTrips(data);
      });
  }, []);

  const removeTrip = (tripid) => {
    //console.log("attempting to remove trip with id " + tripid)
    const requestOptions = {
      method: "POST",
      headers: {
      "Content-Type":"application/json"
      },
      body: JSON.stringify({tripid:tripid})
    }
    fetch("/api/trips/delete", requestOptions).then(response=>response.json()).then(data=> {
      if (data.errno) {
          alert("SQL error. Errno: " + data.errno)
      } else {
          window.location.reload();
      }
    })
  }

  return (
    <div>
      {trips.map(trip => {
        //console.log(trip);
        return (
        <div style={{border:"1px", borderStyle:"solid"}}>
          <div>Trip ID: {trip.id}</div>
          <div>Leaving {trip.startName} at {trip.startTime.replace("T", " ").slice(0, 19)}.</div>
          <div>Arriving at {trip.destinationName} at {trip.endTime.replace("T", " ").slice(0, 19)}.</div>
          <div>Driver: {trip.firstName} {trip.lastName}, License number: {trip.licenseNumber}</div>
          <div>Truck: {trip.make} {trip.model}, Plate Number: {trip.truckPlateNumber}</div>
          <button onClick={()=>removeTrip(trip.id)}>Delete Trip</button>
        </div>
        )
      })}
    </div>
  )
}

export default Triplist