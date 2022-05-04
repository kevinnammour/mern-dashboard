/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { IoIosAddCircleOutline } from "react-icons/io";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { useNavigate } from "react-router-dom";
import StudentRow from "./StudentRow";

const AddAttendanceSheet = (props) => {
  const [showAddSheetModal, setShowAttendanceSheetModal] = useState(false);
  const [branchStudents, setBranchStudents] = useState();
  const [errMsg, setErrMsg] = useState("");
  let presentStudents = [];
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    const getBranchStudents = async () => {
      try {
        const res = await axiosJWTHolder.get(`/students/${props?.selected}`);
        setBranchStudents(res.data);
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    if (props?.selected !== "") {
      getBranchStudents();
    }
  }, [props?.selected]);

  const addSheet = async () => {
    console.log(presentStudents);
    if (props?.selected !== "") {
      try {
        const res = await axiosJWTHolder.post(`/attendances/`, {
          branchId: props?.selected,
          students: presentStudents,
        });
        setErrMsg("");
        console.log(props?.sheets);
        // const copy = [...props?.sheets];
        // copy.push(res.data);
        // props?.setSheets(copy);
        // setShowAttendanceSheetModal(false);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        } else {
          setErrMsg("Something went wrong. Please try again.");
        }
      }
    }
  };

  const setPresentStudents = (arr) => {
    presentStudents = arr;
  };

  const addStudent = async (_id, state) => {
    if (state) {
      presentStudents.push(_id);
    } else {
      let index = presentStudents.indexOf(_id);
      if (index !== -1) {
        presentStudents.splice(index, 1);
      }
    }
  };

  return (
    <>
      <Button
        className="btn-custom no-border flex add-branch"
        variant="primary"
        onClick={() => {
          setShowAttendanceSheetModal(true);
          setPresentStudents([]);
        }}
      >
        <IoIosAddCircleOutline className="icon" />
      </Button>

      <Modal
        show={showAddSheetModal}
        onHide={() => {
          setShowAttendanceSheetModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Adding a sheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errMsg ? (
            <p className={errMsg ? "error" : ""} aria-live="assertive">
              {errMsg}
            </p>
          ) : (
            <></>
          )}
          {branchStudents && branchStudents.length > 0 ? (
            <>
              <Table striped bordered hover responsive className="mt-1">
                <thead>
                  <tr>
                    <th>Full name</th>
                    <th>Phone number</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {branchStudents.map((student) => {
                    return (
                      <StudentRow
                        key={student._id}
                        student={student}
                        addStudent={addStudent}
                      />
                    );
                  })}
                </tbody>
              </Table>
              <Button
                className="btn-custom no-border float-right"
                onClick={(e) => {
                  e.preventDefault();
                  addSheet();
                }}
              >
                Add sheet
              </Button>
            </>
          ) : (
            <>There are no students in this branch</>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddAttendanceSheet;
