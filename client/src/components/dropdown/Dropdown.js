import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { useNavigate } from "react-router-dom";
const baseUrl = "http://localhost:8000";

const Dropdown = (props) => {
  const [branchNames, setBranchNames] = useState();
  const [selected, setSelected] = useState("");
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBranchNames = async () => {
      try {
        const res = await axiosJWTHolder.get(`${baseUrl}/branches/names`, {
          signal: controller.signal,
        });
        if (isMounted) setBranchNames(res.data);
      } catch (err) {
        if (err?.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    getBranchNames();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="wrapper box-shadow-low">
      <Form.Select
        className="drop-down"
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          props.setSelectedBranchId(e.target.value);
        }}
      >
        {branchNames ? (
          branchNames.map((branchName) => {
            return <option value={branchName._id}>{branchName.name}</option>;
          })
        ) : (
          <></>
        )}
      </Form.Select>
    </div>
  );
};

export default Dropdown;