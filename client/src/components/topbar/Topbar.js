import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
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

  const { auth } = useAuth();
  const isAdmin = auth.role === "Admin";

  return (
    <div>
      <Navbar className="darkblue-bg" dark expand="md">
        <NavbarBrand href="/">NinjaCo panel</NavbarBrand>
        <NavbarToggler onClick={toggle} animation="false" />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {isAdmin ? (
              <>
                <NavItem>
                  <NavLink
                    className="pointer"
                    onClick={() => {
                      navigate("/analytics");
                    }}
                  >
                    Analytics
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className="pointer"
                    onClick={() => {
                      navigate("/branches");
                    }}
                  >
                    Branches
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <></>
            )}
            <NavItem>
              <NavLink
                className="pointer"
                onClick={() => {
                  navigate("/students");
                }}
              >
                Students
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className="pointer"
                onClick={() => {
                  navigate("/invoices");
                }}
              >
                Invoices
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className="pointer"
                onClick={() => {
                  navigate("/attendances");
                }}
              >
                Attendances
              </NavLink>
            </NavItem>
            {isAdmin ? (
              <>
                <NavItem>
                  <NavLink
                    className="pointer"
                    onClick={() => {
                      navigate("/inquiries");
                    }}
                  >
                    Inquiries
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <></>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Topbar;
