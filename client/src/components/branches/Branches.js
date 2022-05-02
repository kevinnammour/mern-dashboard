/* eslint-disable react-hooks/exhaustive-deps */
import Topbar from "../topbar/Topbar";
import Dropdown from "../dropdown/Dropdown";
import BranchInfo from "./BranchInfo";
import { Form, Button } from "react-bootstrap";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
const baseUrl = "http://localhost:8000";

const Branches = () => {
  const [selected, setSelected] = useState("");
  const [branches, setBranches] = useState();
  const [branchInfo, setBranchInfo] = useState();
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname.substring(1);

  useEffect(() => {
    const getBranches = async () => {
      try {
        const res = await axiosJWTHolder.get(`${baseUrl}/branches/names`);
        let rabieh = res?.data.find(
          (branch) => branch.name.toLowerCase() === "rabieh"
        );
        if (!rabieh && res?.data?.length > 0) {
          setSelected(res?.data?.[0]._id);
        } else if (rabieh) {
          setSelected(rabieh._id);
        }
        setBranches(res.data);
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    getBranches();
  }, []);

  useEffect(() => {
    const getBranchInformation = async () => {
      try {
        const res = await axiosJWTHolder.get(`${baseUrl}/branches/${selected}`);
        setBranchInfo(res.data);
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    getBranchInformation();
  }, [selected]);

  const changeBranchStatus = async () => {
    try {
      const res = await axiosJWTHolder.put(`${baseUrl}/branches/`, {
        branchId: branchInfo._id,
        active: !branchInfo.active,
      });
      setBranchInfo(res.data);
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <>
      <Topbar />
      <div className="wrapper box-shadow-low">
        <Form.Select
          className="drop-down"
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
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
      </div>
      <div className="content-wrapper">
        {branchInfo ? (
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Branch name</Form.Label>
              <Form.Control value={branchInfo.name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Partner's name</Form.Label>
              <Form.Control value={branchInfo.partnerName} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>NinjaCo percentage (%)</Form.Label>
              <Form.Control value={branchInfo.percentage} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Phone number</Form.Label>
              <Form.Control value={branchInfo.phoneNumber} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Status</Form.Label>
              {branchInfo.active === true ? (
                <Form.Control value="Active" readOnly />
              ) : (
                <Form.Control value="Inactive" readOnly />
              )}
            </Form.Group>
            <Button
              className="btn-custom no-border"
              onClick={(e) => {
                e.preventDefault();
                changeBranchStatus();
              }}
            >
              {branchInfo.active === true ? "Deactivate" : "Activate"}
            </Button>
          </Form>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Branches;
