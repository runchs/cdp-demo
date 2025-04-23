import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// components
import { Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

// assets 
import Logo from '@/assets/artworks/logoLeft.jpg';
import EyeHideIcon from '@/assets/svg/eyeHideIcon.svg';
import EyeShowIcon from '@/assets/svg/eyeShowIcon.svg';

enum CRole {
  User = "user",
  Administrator = "administrator", 
  Admin = "admin"
}

interface ICredentials {
  username: string;
  password: string;
}

const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<ICredentials>({ username: "", password: "" });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<CRole | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAlert(false);
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleLogin = () => {
    if (!credentials.username || !credentials.password) {
      setShowAlert(true);
    } else {
      // connect api
      setShowAlert(false);
      setRole(CRole.User);
    }
  };

  const alertMessage = () => {
    if (showAlert) {
      return <Alert variant="danger" className="text-start fw-light mb-4 py-2 px-3 fs-6">
        <div>The username or password cannot be empty.</div>
      </Alert>
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (!role) return;
    if (role === CRole.User) {
      navigate("/search", { state: { role } });
    } else {
      navigate("/information", { state: { role } });
    }
  }, [role]);

  return (
    <div className="h-100 login-view-container">
    <Row className="gx-0 login-box">
      <Col xs={5} className="logo-wrp d-flex align-items-center"><img src={Logo} alt="logo" /></Col>
      <Col xs={7} className="d-flex align-items-center justify-content-center bg-white">
        <div className="fw-bold w-75 form-wrp">
          <div className="fs-1 mb-5">Sign in</div>
          {alertMessage()}
          <div>
            <Row className="d-flex align-items-center mb-3 gx-0">
              <Col xs={3} className="text-start label-wrp"><Form.Label htmlFor="username" className="mb-0">Username</Form.Label></Col>
              <Col xs={9}><Form.Control
                type="text"
                id="username"
                className="w-100"
                value={credentials.username}
                onChange={handleInputChange}
              /></Col>
            </Row>
            <Row className="d-flex align-items-center mb-3 gx-0">
              <Col xs={3} className="text-start label-wrp"><Form.Label htmlFor="password" className="mb-0">Password</Form.Label></Col>
              <Col xs={9} className="position-relative"><Form.Control
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-100"
                value={credentials.password}
                onChange={handleInputChange}
              />
                <img
                  src={showPassword ? EyeShowIcon : EyeHideIcon}
                  alt="Toggle Password Visibility"
                  onClick={togglePasswordVisibility}
                  className="eye-icon"
                />
              </Col>
            </Row>
            <div className="text-start mt-5">
              <Button variant="primary" className="purple-btn shadow-sm" onClick={handleLogin}>Sign in</Button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    </div>

  );
};

export default LoginView;
