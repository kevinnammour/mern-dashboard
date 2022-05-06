/* eslint-disable react-hooks/exhaustive-deps */
import Topbar from "../topbar/Topbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import AddStudent from "./AddStudent";
import Dropdown from "../dropdown/Dropdown";
import StudentsTable from "./StudentsTable";
import { Spinner } from "react-bootstrap";

const Students = () => {
  const [selected, setSelected] = useState("");
  const [branchStudents, setBranchStudents] = useState();

  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    const getBranchStudents = async () => {
      try {
        const res = await axiosJWTHolder.get(`/students/${selected}`);
        setBranchStudents(res.data);
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    if (selected !== "") {
      getBranchStudents();
    }
  }, [selected]);

  return (
    <>
      <div className="fixed-top">
        <Topbar />
        <div className="wrapper box-shadow-low">
          <Dropdown selected={selected} setSelected={setSelected} />
          <AddStudent
            selected={selected}
            branchStudents={branchStudents}
            setBranchStudents={setBranchStudents}
          />
        </div>
      </div>
      <div className="page-container">
        {branchStudents ? (
          <StudentsTable
            branchStudents={branchStudents}
            setBranchStudents={setBranchStudents}
          />
        ) : (
          <div className="center-h-v">
            <Spinner className="center-h-v darkblue-color" animation="border" />
          </div>
        )}
      </div>
    </>
  );
};

export default Students;
