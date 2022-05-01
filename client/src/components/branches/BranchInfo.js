import { Form, Button } from "react-bootstrap";

const BranchInfo = (props) => {
  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Branch name</Form.Label>
          <Form.Control value={props.branchName} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Partner's name</Form.Label>
          <Form.Control value={props.partnerName} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>NinjaCo percentage (%)</Form.Label>
          <Form.Control value={props.percentage} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Phone number</Form.Label>
          <Form.Control value={props.phoneNumber} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Status</Form.Label>
          {props.active === true ? (
            <Form.Control value="Active" readOnly />
          ) : (
            <Form.Control value="Inactive" readOnly />
          )}
        </Form.Group>
        <br />
        <Button className="btn-custom no-border" type="submit">
          Activate
        </Button>
      </Form>
    </>
  );
};

export default BranchInfo;
