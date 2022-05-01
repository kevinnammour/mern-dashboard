import { useState, useEffect } from "react";
import axios from "axios";
const baseUrl = "http://localhost:8000";

const Dropdown = () => {
  const [selected, setSelected] = useState();
  const [branches, setBranches] = useState();

  return (
    // <div className="wrapper">
    //   <div className="form-group drop-down">
    //     <select
    //       className="form-control"
    //       id="exampleSelect"
    //       value={selected}
    //       onChange={(e) => setSelected(e.target.value)}
    //     >
    //       {branches.map((branch) => {
    //         <option value={branch._id} key={branch._id}>
    //           {branch.name}
    //         </option>;
    //       })}
    //     </select>
    //   </div>
    // </div>
    <></>
  );
};

export default Dropdown;