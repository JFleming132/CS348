import {useState, useEffect} from "react";

const TrucksDropdown = ({onChange, name}) => {
  const [trucks, setTrucks] = useState([]);
  useEffect(() => {
      fetch("/api/trucks").then(response => response.json()).then((data) => {
        //console.log(data);
        setTrucks(data);
      });
  }, []);
  //test array of objects where the property is the column and the value of that property is the value of the column
  //we need to map these objects to components for displaying.
  return (
    <select name={name} onChange={e => {onChange(e.target.value)}}>
      <option disabled selected value> -- select an option -- </option>
      {trucks.map(truck => (
        <option value={truck.plateNumber}>{truck.make} {truck.model}, Plate Number: {truck.plateNumber}</option>
      ))}
    </select>
  );  
}

export default TrucksDropdown;