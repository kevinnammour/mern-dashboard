import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/AuthProvider";
import axios from "axios";
const LOGIN_URL = "http://localhost:8000/crm/login";
const RESET_PASS_URL = "http://localhost:8000/crm/reset-pass";

const Login = () => {
  const setAuth = useContext(AuthContext).setAuth;
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMessage("");
  }, [username, password, newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reset) {
      try {
        console.log(JSON.stringify({ username, password, newPassword }));
        await axios.put(
          RESET_PASS_URL,
          JSON.stringify({ username, password, newPassword }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } catch (err) {
        if (!err?.response) {
          setErrMessage("Server error.");
        } else if (err.response?.status === 401) {
          setErrMessage("Incorrect password.");
        } else if (err.response?.status === 404) {
          setErrMessage("Username not found.");
        }
        return;
      }
    }
    const pass = reset ? newPassword : password;
    try {
      const res = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password: pass }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = res?.data?.accessToken;
      const role = res.config.data?.role;
      setAuth({ username, password, role, accessToken });
      setUsername("");
      setPassword("");
      setSuccess(true);
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
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="#">Go to home</a>
          </p>
        </section>
      ) : (
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
      )}
    </>
  );
};

export default Login;
