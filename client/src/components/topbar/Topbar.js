import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname.substring(1);

  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const toggle = () => setIsOpen(!isOpen);

  const { auth } = useAuth();
  const isAdmin = auth?.role === "Admin";

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
                    className={`pointer ${url === "analytics" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/analytics");
                    }}
                  >
                    Analytics
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={`pointer ${url === "branches" ? "active" : ""}`}
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
                className={`pointer ${url === "students" ? "active" : ""}`}
                onClick={() => {
                  navigate("/students");
                }}
              >
                Students
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`pointer ${url === "invoices" ? "active" : ""}`}
                onClick={() => {
                  navigate("/invoices");
                }}
              >
                Invoices
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`pointer ${url === "attendances" ? "active" : ""}`}
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
                    className={`pointer ${url === "inquiries" ? "active" : ""}`}
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
            <NavItem>
              <NavLink onClick={signOut}>Logout</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Topbar;
