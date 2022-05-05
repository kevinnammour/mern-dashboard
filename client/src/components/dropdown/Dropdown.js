/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import useAuth from "../../hooks/useAuth";

const Dropdown = (props) => {
  const [branches, setBranches] = useState();
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const getBranches = async () => {
      try {
        if (auth?.role === "Admin") {
          const res = await axiosJWTHolder.get(`/branches/names`);
          let rabieh = res?.data.find(
            (branch) => branch.name.toLowerCase() === "rabieh"
          );
          if (!rabieh && res?.data?.length > 0) {
            props?.setSelected(res?.data?.[0]._id);
          } else if (rabieh) {
            props?.setSelected(rabieh._id);
          }
          setBranches(res.data);
        } else {
          props?.setSelected(auth?._id);
        }
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    getBranches();
  }, [props?.forceUpdate]);

  return (
    <>
      {auth?.role === "Admin" ? (
        <Form.Select
          className="drop-down"
          value={props.selected}
          onChange={(e) => {
            props.setSelected(e.target.value);
          }}
        >
          {branches ? (
            branches.map((branchName) => {
              return (
                <option key={branchName._id} value={branchName._id}>
                  {branchName.name}
                </option>
              );
            })
          ) : (
            <></>
          )}
        </Form.Select>
      ) : (
        <></>
      )}
    </>
  );
};

export default Dropdown;