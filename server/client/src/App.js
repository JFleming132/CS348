import './App.css';
import React from "react";

function App() {
    const [testTable, setTestTable] = React.useState({});
    React.useEffect(() => {
        fetch("/api").then((res) => res.json()).then((data) => setTestTable(data));
    }, []);

    return (
        <div className="App">
            <div>Currently, the test table contains the following entries:</div>
            <div>{JSON.stringify(testTable)}</div>
        </div>
    );
}

export default App;
