/* eslint-disable react-hooks/exhaustive-deps */
import Topbar from "../topbar/Topbar";
import Dropdown from "../dropdown/Dropdown";
import BranchInfo from "./BranchInfo";
import useLogout from "../../hooks/useLogout";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
const baseUrl = "http://localhost:8000";

const Branches = () => {
  const [branch, setBranch] = useState();
  const [selectedBranchId, setSelectedBranchId] = useState();
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBranch = async () => {
      try {
        const res = await axiosJWTHolder.get(
          `${baseUrl}/branches/${selectedBranchId}`,
          {
            signal: controller.signal,
          }
        );
        if (isMounted) setBranch(res.data);
      } catch (err) {
        if (err?.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    getBranch();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedBranchId]);

  return (
    <>
      <Topbar />
      <Dropdown setSelectedBranchId={setSelectedBranchId} />
      <div className="content-wrapper">
        <BranchInfo
          branchName={branch?.name}
          partnerName={branch?.partnerName}
          percentage={branch?.percentage}
          phoneNumber={branch?.phoneNumber}
          active={branch?.active}
        />
      </div>
      <button onClick={signOut}>Sign out</button>
    </>
  );
};

export default Branches;
