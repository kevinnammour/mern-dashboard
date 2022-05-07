/* eslint-disable no-lone-blocks */
/* eslint-disable no-useless-escape */
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";

const AddBranch = (props) => {
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const navigate = useNavigate();
  const axiosJWTHolder = useAxiosJWTHolder();

  const addBranch = async (e) => {
    e.preventDefault();
    if (
      !/^(?=.{21,31}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.partner$/.test(
        username
      )
    ) {
      setErrMsg("Invalid username.");
    } else if (
      !/^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/.test(name)
    ) {
      setErrMsg("Invalid branch name.");
    } else if (
      !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
        phoneNumber
      )
    ) {
      setErrMsg("Invalid phone number.");
    } else if (
      !/^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/.test(
        partnerName
      )
    ) {
      setErrMsg("Invalid partner name.");
    } else if (percentage < 0 || percentage > 100) {
      setErrMsg("Invalid NinjaCo percentage.");
    } else {
      setErrMsg(null);
      generatePassword().then((pass) => {
        axiosJWTHolder
          .post(`/branches/`, {
            username,
            name,
            password: pass,
            phoneNumber,
            partnerName,
            percentage,
            locationUrl,
          })
          .then(() => {
            setSuccessMsg(`Branch successfully added.`);
            setUsernameMsg(`Username: ${username}`);
            setPasswordMsg(`Password: ${pass}`);
            setUsername("");
            setName("");
            setPhoneNumber("");
            setPartnerName("");
            setPercentage("");
            setLocationUrl("");
            setErrMsg("");
            props?.setForceUpdate(props?.forceUpdate + 1);
          })
          .catch((err) => {
            if (
              err?.response?.status === 403 ||
              err?.response?.status === 401
            ) {
              navigate("/login");
            } else if (err?.response?.status === 409) {
              setErrMsg(
                "Username, branch name, or location url already exists."
              );
            } else {
              setErrMsg("Something went wrong. Please try again.");
            }
          });
      });
    }
  };

  const generatePassword = async () => {
    // Generates a password of length 10 that includes
    // at least one lowercase, one uppercase, one digit,
    // and one symbol
    const lAlpha = "abcdefghijklmnopqrstuvwxyz";
    const cAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const num = "1234567890";
    const specials = "#?!@$%^&*-";
    const options = [
      lAlpha,
      lAlpha,
      lAlpha,
      cAlpha,
      cAlpha,
      num,
      num,
      specials,
      cAlpha,
      num,
    ];
    let opt, choose;
    let pass = "";
    for (let i = 0; i < options.length; i++) {
      opt = Math.floor(Math.random() * options[i].length);
      choose = options[i][opt];
      pass = pass + choose;
    }

    let a = pass.split(""),
      n = a.length;

    for (let i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join("");
  };

  return (
    <>
      <Button
        className="btn-custom no-border flex add-branch"
        variant="primary"
        onClick={() => setShowAddBranchModal(true)}
      >
        <IoIosAddCircleOutline className="icon" />
      </Button>

      <Modal
        show={showAddBranchModal}
        onHide={() => {
          {
            setSuccessMsg("");
            setUsernameMsg("");
            setPasswordMsg("");
            setShowAddBranchModal(false);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Adding a branch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addBranch}>
            {errMsg ? (
              <p className={errMsg ? "error" : ""} aria-live="assertive">
                {errMsg}
              </p>
            ) : (
              <></>
            )}
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                placeholder="e.g. berta@ninjaco.partner"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicNewPassword">
              <Form.Label>Branch name</Form.Label>
              <Form.Control
                value={name}
                type="text"
                placeholder="e.g. Jbeil"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicNewPassword">
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                type="tel"
                value={phoneNumber}
                placeholder="e.g. +96178910121"
                required
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicNewPassword">
              <Form.Label>Partner's name</Form.Label>
              <Form.Control
                type="text"
                value={partnerName}
                placeholder="e.g. Berta Luisella"
                required
                onChange={(e) => setPartnerName(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicNewPassword">
              <Form.Label>NinjaCo percentage</Form.Label>
              <Form.Control
                type="number"
                value={percentage}
                placeholder="e.g. 60"
                required
                onChange={(e) => setPercentage(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicNewPassword">
              <Form.Label>Location url</Form.Label>
              <Form.Control
                type="text"
                value={locationUrl}
                placeholder="e.g. {url}/maps/{place}/{}/@{lat},{long},{*}/data={data}"
                required
                onChange={(e) => setLocationUrl(e.target.value)}
              />
            </Form.Group>
            <br />
            {successMsg === "" ? (
              <></>
            ) : (
              <p className="success bold">
                {successMsg} <br /> {usernameMsg} <br /> {passwordMsg}
              </p>
            )}
            <Button
              className="btn-custom no-border float-right"
              type="submit"
              onClick={() => {
                setSuccessMsg("");
                setUsernameMsg("");
                setPasswordMsg("");
              }}
            >
              Add branch
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddBranch;