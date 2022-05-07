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
    // If the user is an admin, then the dropdown will be set as Rabieh
    // since it is the main branch. However, if Rabieh is not in the database,
    // then it will set the first branch in the set of branches received from
    // the database as the default branch.
    // But if the user is a partner, the the dropdown has the branch of the partner
    // but will not be shown to prevent it from being changed and allowing the partner
    // to see the information of other branches.
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