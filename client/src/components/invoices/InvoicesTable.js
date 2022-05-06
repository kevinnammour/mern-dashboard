import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { VscSearchStop } from "react-icons/vsc";
import useAuth from "../../hooks/useAuth";
import EditInvoiceRate from "./EditInvoiceRate";

const InvoicesTable = (props) => {
  const { auth } = useAuth();
  const [convert, setConvert] = useState(false);

  return (
    <>
      {props?.branchInvoices && props?.branchInvoices.length > 0 ? (
        <>
          <div>
            <h5 className="mb-4">Invoices</h5>
            {/* <SearchStudents search={search} setSearch={setSearch} /> */}
            <Table striped bordered hover responsive className="mt-4">
              <thead>
                <tr>
                  <th>Student's full name</th>
                  <th>Student's phone number</th>
                  <th>Amount</th>
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
                    <td>{invoice?.amount}</td>
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
          <span className="notification-msg">No invoices found</span>
        </div>
      )}
    </>
  );
};

export default InvoicesTable;
