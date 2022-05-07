import React from "react";
import { Button } from "react-bootstrap";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { useNavigate } from "react-router-dom";

const EditStudentStatus = (props) => {
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  const changeStudentStatus = async () => {
    try {
      await axiosJWTHolder
        .put(`/students/set-status`, {
          studentId: props?.student._id,
          active: !props?.student.active,
        })
        .then((res) => {
          const copy = [...props?.branchStudents];
          let index = copy.findIndex(
            (student) => student._id === props?.student._id
          );
          copy[index] = res.data;
          props?.setBranchStudents(copy);
        });
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <>
      <Button
        data-index={props?.student?._id}
        className="btn-custom no-border m-1"
        onClick={changeStudentStatus}
      >
        {props?.student?.active === true ? "Deactivate" : "Activate"}
      </Button>
    </>
  );
};

export default EditStudentStatus;