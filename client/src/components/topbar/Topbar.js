import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

const Topbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar className="darkblue-bg" dark expand="md">
        <NavbarBrand href="/">NinjaCo panel</NavbarBrand>
        <NavbarToggler onClick={toggle} animation="false" />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink
                onClick={() => {
                  navigate("/analytics");
                }}
              >
                Analytics
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={() => {
                  navigate("/branches");
                }}
              >
                Branches
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={() => {
                  navigate("/invoices");
                }}
              >
                Invoices
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={() => {
                  navigate("/students");
                }}
              >
                Students
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={() => {
                  navigate("/attendances");
                }}
              >
                Attendances
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                onClick={() => {
                  navigate("/inquiries");
                }}
              >
                Inquiries
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Topbar;
