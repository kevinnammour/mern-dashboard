import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
const baseUrl = "http://localhost:8000";

const Login = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [reset, setReset] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMessage("");
  }, [username, password, newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If the partner tried to log in earlier and they were forced to reset their password
    if (reset) {
      if (
        !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
          newPassword
        )
      ) {
        setErrMessage(
          "The new password must have 1 upper letter, 1 lower letter, 1 symbol, 1 number, and have at least 8 characters."
        );
        return;
      }
      try {
        await axios.put(
          `${baseUrl}/crm/reset-pass`,
          JSON.stringify({ username, password, newPassword }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } catch (err) {
        if (!err?.response) {
          setErrMessage("Server error.");
        } else if (err.response?.status === 400) {
          setErrMessage("Password is weak.");
        } else if (err.response?.status === 401) {
          setErrMessage("Incorrect password.");
        } else if (err.response?.status === 404) {
          setErrMessage("Username not found.");
        } else if (err.response?.status === 405) {
          setErrMessage("Reset password not allowed.");
        } else if (err.response?.status === 500) {
          setErrMessage("Server error.");
        }
        return;
      }
    }
    const pass = reset ? newPassword : password;
    try {
      const res = await axios.post(
        `${baseUrl}/crm/login`,
        JSON.stringify({ username, password: pass }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = res?.data?.accessToken;
      const role = res?.data?.role;
      setAuth({ username, password, role, accessToken });
      setUsername("");
      setPassword("");
      setNewPassword("");
      setReset(false);
      if (role === "Admin") {
        navigate("/analytics");
      } else if (role === "Partner") {
        navigate("/students");
      }
    } catch (err) {
      if (!err?.response) {
        setErrMessage("Server error.");
      } else if (err.response?.status === 401) {
        setErrMessage("Incorrect password.");
      } else if (err.response?.status === 404) {
        setErrMessage("Username not found.");
      } else if (err.response?.status === 406) {
        setErrMessage("Password needs to be reset.");
        setReset(true);
      } else if (err.response?.status === 500) {
        setErrMessage("Server error.");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      <Container className="padding">
        <Row className="mt-5">
          <Col
            lg={5}
            md={6}
            sm={12}
            className="p-4 m-auto rounded-lg box-shadow"
          >
            <h3 className="margin-bottom">NinjaCo's CRM panel</h3>
            <Form onSubmit={handleSubmit}>
              <p
                ref={errRef}
                className={errMessage ? "error" : "display-none"}
                aria-live="assertive"
              >
                {errMessage}
              </p>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  className="no-outline"
                  type="text"
                  placeholder="Enter username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                />
              </Form.Group>
              <br />
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  className="no-outline"
                  type="password"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
              </Form.Group>
              <br />
              {reset ? (
                <>
                  <Form.Group controlId="formBasicNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      className="no-outline"
                      type="password"
                      placeholder="Enter new password"
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      required
                    />
                  </Form.Group>
                  <br />
                </>
              ) : (
                <></>
              )}
              <Button
                className="w-100 btn-custom"
                variant="btn-block"
                type="submit"
              >
                {reset ? "Reset password" : "Login"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
