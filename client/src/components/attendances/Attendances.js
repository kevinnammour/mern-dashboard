import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Topbar from "../topbar/Topbar";
import Dropdown from "../dropdown/Dropdown";
import AttendanceSheets from "./AttendanceSheets";
import AddAttendanceSheet from "./AddAttendanceSheet";

const Attendances = () => {
  const [selected, setSelected] = useState("");
  const { auth } = useAuth();

  return (
    <>
      <div className="fixed-top">
        <Topbar />
        <div className="wrapper box-shadow-low">
          <Dropdown selected={selected} setSelected={setSelected}/>
          {auth?.role === "Partner" ? <AddAttendanceSheet selected={selected}/> : <AddAttendanceSheet/>}
        </div>
      </div>
      <div className="page-container">
        <AttendanceSheets selected={selected}/>
      </div>
    </>
  );
};

export default Attendances;