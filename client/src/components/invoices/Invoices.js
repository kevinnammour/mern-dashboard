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
  const [activeStudents, setActiveStudents] = useState();
  const { auth } = useAuth();
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    const getBranchInvoices = async () => {
      await axiosJWTHolder
        .get(`/invoices/${selected}`)
        .then((res) => {
          var copy = res?.data;
          copy.map((invoice) => {
            if (invoice.lbpRate !== null) {
              invoice.usdAmount = invoice.amount / invoice.lbpRate;
            }
            return invoice;
          });
          setBranchInvoices(copy);
        })
        .catch((err) => {
          if (err?.response?.status === 403 || err?.response?.status === 401) {
            navigate("/login");
          }
        });
    };
    if (selected !== "") {
      getBranchInvoices();
    }
  }, [selected]);

  useEffect(() => {
    const getActiveStudents = async () => {
      await axiosJWTHolder
        .get(`/students/active/${selected}`)
        .then((res) => {
          setActiveStudents(res?.data);
        })
        .catch((err) => {
          if (err?.response?.status === 403 || err?.response?.status === 401) {
            navigate("/login");
          }
        });
    };
    if (selected !== "") {
      getActiveStudents();
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
              activeStudents={activeStudents}
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
