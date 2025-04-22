import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// components
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// tabs
import C360Tab from "../modules/c360/views/C360View";
import EmproTab from "../modules/c360/views/EmproView";
import APILogTab from "../modules/apiLog/views/APILogView";
import AccountView from "../modules/account/views/AccountView";
import AuthKeyView from "../modules/authKey/views/AuthKeyView";

// assets
import Logo from "@/assets/artworks/logo.jpg";

interface InformationViewProps {
  defaultTab?: string;
}

enum CRole {
  User = "user",
  Administrator = "administrator",
  Admin = "admin"
}

const InformationView: React.FC<InformationViewProps> = ({ defaultTab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const role = location.state?.role || CRole.User;

  const onLogOut = () => {
    // api
    navigate("/");
  }

  const roleDefaultTabs: Record<CRole, string> = {
    [CRole.User]: "empro",
    [CRole.Administrator]: "apiLog",
    [CRole.Admin]: "authorizationKey",
  };
  
  const handleActiveTab = () => {
    return activeTab ?? roleDefaultTabs[role as CRole] ?? "empro";
  };

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(roleDefaultTabs[role as CRole]);
    }
  }, [role, activeTab]);

  return (
    <div className="h-100">
      <Navbar className="px-4 tabs-wrp">
        <Navbar.Brand>
          <img src={Logo} alt="Logo" style={{ height: "45px" }} />
        </Navbar.Brand>
        <Nav
          variant="tabs"
          activeKey={handleActiveTab()}
          onSelect={(selectedKey) => setActiveTab(selectedKey || "")}
          className="ms-2"
        >
          {/* role user */}
          {role === CRole.User && (
            <>
              <Nav.Item>
                <Nav.Link eventKey="empro">EMPRO</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="c360">c360</Nav.Link>
              </Nav.Item>
            </>
          )}

          {/* role administrator */}
          {role === CRole.Administrator && (
            <>
              <Nav.Item>
                <Nav.Link eventKey="apiLog">APILog</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="account">Account</Nav.Link>
              </Nav.Item>
            </>
          )}

          {/* role admin */}
          {role === CRole.Admin && (
            <Nav.Item>
              <Nav.Link eventKey="authorizationKey">Authorization Key</Nav.Link>
            </Nav.Item>
          )}

          {/* log out */}
          {role !== CRole.User && (
            <Nav.Item onClick={onLogOut}>
              <Nav.Link eventKey="logOut">Log Out</Nav.Link>
            </Nav.Item>
          )}

        </Nav>
      </Navbar>

      {/* แสดงเนื้อหาแท็บตาม activeTab */}
      <div className="tab-content-wrp">
        {activeTab === "empro" && <EmproTab />}
        {activeTab === "c360" && <C360Tab />}
        {activeTab === "apiLog" && <APILogTab />}
        {activeTab === "account" && <AccountView />}
        {activeTab === "authorizationKey" && <AuthKeyView />}
      </div>
    </div>
  );
};


export default InformationView;
