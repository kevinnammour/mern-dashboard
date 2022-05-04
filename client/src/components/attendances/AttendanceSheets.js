import { VscSearchStop } from "react-icons/vsc";
import AttendanceSheet from "./AttendanceSheet";

const AttendanceSheets = (props) => {
  return (
    <>
      {props?.sheets && props?.sheets.length > 0 ? (
        <div>
          <h5 className="mb-4">Last 30 days attendance sheets</h5>
          {props?.sheets.map((sheet) => {
            return <AttendanceSheet key={sheet._id} sheet={sheet} />;
          })}
        </div>
      ) : (
        <div className="center-h-v">
          <VscSearchStop className="notification-icon" />
          <span className="notification-msg">No attendance sheets found</span>
        </div>
      )}
    </>
  );
};

export default AttendanceSheets;