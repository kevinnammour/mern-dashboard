/* eslint-disable react-hooks/exhaustive-deps */
import Dropdown from "../dropdown/Dropdown";
import Topbar from "../topbar/Topbar";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import AddInvoice from "./AddInvoice";
import { Spinner } from "react-bootstrap";
import InvoicesTable from "./InvoicesTable";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const [selected, setSelected] = useState("");
  const [branchInvoices, setBranchInvoices] = useState();
  const { auth } = useAuth();
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    const getBranchInvoices = async () => {
      try {
        const res = await axiosJWTHolder.get(`/invoices/${selected}`);
        setBranchInvoices(res.data);
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    if (selected !== "") {
      getBranchInvoices();
    }
  }, [selected]);

  return (
    <>
      <div className="fixed-top">
        <Topbar />
        <div className="wrapper box-shadow-low">
          <Dropdown selected={selected} setSelected={setSelected} />
          {auth?.role === "Partner" ? (
            <AddInvoice
              selected={selected}
              branchInvoices={branchInvoices}
              setBranchInvoices={setBranchInvoices}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="page-container">
        {branchInvoices ? (
          <InvoicesTable
            branchInvoices={branchInvoices}
            setBranchInvoices={setBranchInvoices}
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

export default Invoices;
