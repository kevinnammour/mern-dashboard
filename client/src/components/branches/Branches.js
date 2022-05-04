/* eslint-disable react-hooks/exhaustive-deps */
import Topbar from "../topbar/Topbar";
import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBranch from "./AddBranch";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import Dropdown from "../dropdown/Dropdown";
import useAuth from "../../hooks/useAuth";
import BranchInfo from "./BranchInfo";

const Branches = () => {
  const [selected, setSelected] = useState("");
  const [branchInfo, setBranchInfo] = useState();
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const getBranchInformation = async () => {
      try {
        if (selected !== "") {
          await axiosJWTHolder.get(`/branches/${selected}`).then((res) => {
            setBranchInfo(res.data);
          });
        }
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    getBranchInformation();
  }, [selected]);

  return (
    <>
      <div className="fixed-top">
        <Topbar />
        <div className="wrapper box-shadow-low">
          <Dropdown selected={selected} setSelected={setSelected} />
          {auth?.role === "Admin" ? <AddBranch /> : <></>}
        </div>
      </div>

      <div className="page-container">
        {branchInfo ? (
          <BranchInfo branchInfo={branchInfo} setBranchInfo={setBranchInfo} />
        ) : (
          <div className="center-h-v">
            <Spinner className="center-h-v darkblue-color" animation="border" />
          </div>
        )}
      </div>
    </>
  );
};

export default Branches;
