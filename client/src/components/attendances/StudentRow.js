import React, { useState } from "react";

const StudentRow = (props) => {
  const [checked, setChecked] = useState(true);
  return (
    <tr key={props?.student?._id}>
      <td>{props?.student?.fullName}</td>
      <td>{props?.student?.phoneNumber}</td>
      <td>
        <label class="switch">
          <input
            key={props?.student?._id}
            data-index={props?.student?._id}
            type="checkbox"
            onChange={(e) => {
              setChecked(!checked);
              props?.addStudent(e.target.getAttribute("data-index"), checked);
            }}
          ></input>
          <span class="slider round"></span>
        </label>
      </td>
    </tr>
  );
};

export default StudentRow;