/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { VscSearchStop } from "react-icons/vsc";
import useAuth from "../../hooks/useAuth";
import ConvertRate from "./ConvertRate";
import EditInvoiceRate from "./EditInvoiceRate";

const InvoicesTable = (props) => {
  const { auth } = useAuth();
  const [convert, setConvert] = useState(false);

  useEffect(() => {
    props?.branchInvoices.map((invoice) => {
      if (invoice.lbpRate !== null) {
        invoice.usdAmount = invoice.amount / invoice.lbpRate;
      }
      return invoice;
    });
  }, []);

  return (
    <>
      {props?.branchInvoices && props?.branchInvoices.length > 0 ? (
        <>
          <div>
            <h5 className="mb-4">Last 30 days invoices</h5>
            {auth?.role === "Admin" ? (
              <ConvertRate convert={convert} setConvert={setConvert} />
            ) : (
              <></>
            )}
            <Table striped bordered hover responsive className="mt-4">
              <thead>
                <tr>
                  <th>Student's full name</th>
                  <th>Student's phone number</th>
                  <th>Amount ({convert ? "USD" : "LBP"})</th>
                  <th>Lbp rate</th>
                  <th>Datetime</th>
                  {auth?.role === "Admin" ? <th>Actions</th> : <></>}
                </tr>
              </thead>
              <tbody>
                {props?.branchInvoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice?.student?.fullName}</td>
                    <td>{invoice?.student?.phoneNumber}</td>
                    <td>{convert ? invoice?.usdAmount : invoice?.amount}</td>
                    <td>{invoice?.lbpRate}</td>
                    <td>{invoice?.datetime}</td>
                    {auth?.role === "Admin" ? (
                      <td className="actions-cell">
                        <EditInvoiceRate
                          invoice={invoice}
                          branchInvoices={props?.branchInvoices}
                          setBranchInvoices={props?.setBranchInvoices}
                        />
                      </td>
                    ) : (
                      <></>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <div className="center-h-v">
          <VscSearchStop className="notification-icon" />
          <span className="notification-msg">No invoices found!</span>
        </div>
      )}
    </>
  );
};

export default InvoicesTable;