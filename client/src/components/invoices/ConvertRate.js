/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";

const ConvertRate = (props) => {
  useEffect(() => {
    if (props?.convert) {
      props?.branchInvoices.map((invoice) => {
        if (invoice.lbpRate !== null) {
          invoice.usdAmount = invoice.amount / invoice.lbpRate;
        }
        return invoice;
      });
    }
  }, [props?.convert]);

  return (
    <>
      <Button
        className="btn-custom no-border"
        onClick={() => props?.setConvert(!props?.convert)}
      >
        Convert amount to {props?.convert === true ? "LBP" : "USD"}
      </Button>
    </>
  );
};

export default ConvertRate;
