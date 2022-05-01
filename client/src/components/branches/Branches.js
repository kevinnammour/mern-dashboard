import Topbar from "../topbar/Topbar";
import Dropdown from "../dropdown/Dropdown";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
const baseUrl = "http://localhost:8000";

const Branches = () => {
  const [branches, setBranches] = useState();
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBranches = async () => {
      try {
        const res = await axiosJWTHolder.get(`${baseUrl}/branches/`, {
          signal: controller.signal,
        });
        console.log(res.data);
        if (isMounted) setBranches(res.data);
      } catch (err) {
        if (err?.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    getBranches();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <Topbar />
      <Dropdown />
    </>
  );
};

export default Branches;
