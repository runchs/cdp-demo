import React, { useState, useEffect } from "react";

// components
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// tabs
import C360Tab from "../components/tabs/C360Tab";
import EmproTab from "../components/tabs/EmproTab";

// assets
import Logo from "@/assets/artworks/logo.jpg";

interface InformationViewProps {
  defaultTab?: string;
}


const InformationView: React.FC<InformationViewProps> = ({ defaultTab = "empro" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="h-100">
      <Navbar className="px-4 tabs-wrp">
        <Navbar.Brand>
          <img src={Logo} alt="Logo" style={{ height: "32px" }} />
        </Navbar.Brand>
        <Nav
          variant="tabs"
          activeKey={activeTab} 
          onSelect={(key) => setActiveTab(key || "empro")}
          className="ms-2"
        >
          <Nav.Item>
            <Nav.Link eventKey="empro">EMPRO</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="c360">C360</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>

      {/* แสดงเนื้อหาแท็บตาม activeTab */}
      <div className="tab-content-wrp">
        {activeTab === "empro" && <EmproTab />}
        {activeTab === "c360" && <C360Tab />}
      </div>
    </div>
  );
};


export default InformationView;
