import {useState, useEffect} from "react";

const WarehouseDropdown = ({onChange, name}) => {
  const [warehouses, setWarehouses] = useState([]);
  useEffect(() => {
      fetch("/api/warehouses").then(response => response.json()).then((data) => {
        //console.log(data);
        setWarehouses(data);
      });
  }, []);
  //test array of objects where the property is the column and the value of that property is the value of the column
  //we need to map these objects to components for displaying.
  return (
          <select name={name} onChange={e => onChange(e.target.value)}>
            <option disabled selected value> -- select an option -- </option>
            {warehouses.map(warehouse => (
              <option value={warehouse.id}>{warehouse.name}, {warehouse.address}</option>
            ))}
          </select>
  );  
}

export default WarehouseDropdown;