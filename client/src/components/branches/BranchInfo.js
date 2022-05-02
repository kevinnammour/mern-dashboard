import { Form, Button } from "react-bootstrap";

const BranchInfo = (props) => {
  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Branch name</Form.Label>
          <Form.Control value={props.branch.name} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Partner's name</Form.Label>
          <Form.Control value={props.branch.partnerName} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>NinjaCo percentage (%)</Form.Label>
          <Form.Control value={props.branch.percentage} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Phone number</Form.Label>
          <Form.Control value={props.branch.phoneNumber} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Status</Form.Label>
          {props.branch.active === true ? (
            <Form.Control value="Active" readOnly />
          ) : (
            <Form.Control value="Inactive" readOnly />
          )}
        </Form.Group>
        <Button className="btn-custom no-border" type="submit">
          Activate
        </Button>
      </Form>
    </>
  );
};

export default BranchInfo;
