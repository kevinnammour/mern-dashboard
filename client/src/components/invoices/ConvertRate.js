import { Button } from "react-bootstrap";

const ConvertRate = (props) => {
  return (
    <>
      <Button
        className="btn-custom no-border"
        onClick={() => props?.setConvert(!props?.convert)}
      >
        <span className="nobr">Convert amount to {props?.convert === true ? "LBP" : "USD"}</span>
      </Button>
    </>
  );
};

export default ConvertRate;