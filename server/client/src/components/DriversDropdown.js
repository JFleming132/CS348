import {useState, useEffect} from "react";

const DriversDropdown = ({onChange, name}) => {
  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
      fetch("/api/drivers").then(response => response.json()).then((data) => {
        //console.log(data);
        setDrivers(data);
      });
  }, []);
  //test array of objects where the property is the column and the value of that property is the value of the column
  //we need to map these objects to components for displaying.
  return (
    <select name={name} onChange={e => {onChange(e.target.value)}}>
      <option disabled selected value> -- select an option -- </option>
      {drivers.map(driver => (
        <option value={driver.licenseNumber}>{driver.firstName} {driver.lastName}</option>
      ))}
    </select>
  );  
}

export default DriversDropdown;