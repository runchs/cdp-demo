import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

enum COption {
  AEON_ID = '1',
  CUSTOMER_ID = '2'
}

const SearchView: React.FC = () => {

  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<COption>(COption.AEON_ID);
  const [aeonId, setAEONId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const [error, setError] = useState<boolean>(false); // mock for test

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value as COption);
  };

  const handleAEONIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAlert(false);
    setAEONId(e.target.value);
  };

  const handleCustomerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAlert(false);
    setCustomerId(e.target.value);
  };

  const handleSearch = () => {
    if (selectedOption === COption.AEON_ID && !aeonId) {
      setAlertMsg("The AEON ID cannot be empty.");
      setShowAlert(true);
    } else if (selectedOption === COption.CUSTOMER_ID && !customerId) {
      setAlertMsg("The Customer ID cannot be empty.");
      setShowAlert(true);
    } else {
      // connect api
      if (!error) {
        setShowAlert(false);
        navigate("/information");
      } else {
        setAlertMsg("Customer not found (Not register Web Member Service)");
        setShowAlert(true);
      }
    }
  };

  const alertMessage = () => {
    if (showAlert) {
      return <Alert variant="danger" className="text-start fw-light mb-4 py-2 px-3">
        <div>{alertMsg}</div>
      </Alert>
    }
  }

  useEffect(() => {
    setAEONId("");
    setCustomerId("");
  }, [selectedOption]);

  return (
    <div className="h-100 search-view-container bg-color-tertiary d-flex align-items-center">
      <div className="rounded-4 bg-light w-50 mx-auto overflow-hidden shadow-sm">
        <div className="bg-color-secondary w-100 py-4 fw-bold fs-5">Please Input AEON ID / Customer Id</div>
        <div className="p-5 text-start">
          {alertMessage()}
          <div>
            <Form>
              {/* AEON ID Radio */}
              <Form.Check
                type="radio"
                id="aeonIdRadio"
                name="options"
                value={COption.AEON_ID}
                className="d-flex align-items-center mb-3 w-100"
                defaultChecked={selectedOption === COption.AEON_ID}
                onChange={handleRadioChange}
                label={
                  <Row className="d-flex align-items-center gx-0 ms-3 w-100">
                    <Col xs={3} className="text-start label-wrp">
                      AEON ID
                    </Col>
                    <Col xs={9}>
                      <Form.Control
                        type="text"                        
                        className="w-100"
                        disabled={selectedOption !== COption.AEON_ID}
                        value={aeonId}
                        onChange={handleAEONIdChange}
                      />
                    </Col>
                  </Row>
                }
              />

              {/* Customer ID Radio */}
              <Form.Check
                type="radio"
                id="customerIdRadio"
                name="options"
                value={COption.CUSTOMER_ID}
                className="d-flex align-items-center w-100"
                onChange={handleRadioChange}
                label={
                  <Row className="d-flex align-items-center gx-0 ms-3 w-100">
                    <Col xs={3} className="text-start label-wrp">
                      Customer ID
                    </Col>
                    <Col xs={9}>
                      <Form.Control
                        type="text"                        
                        className="w-100"
                        disabled={selectedOption !== COption.CUSTOMER_ID}
                        value={customerId}
                        onChange={handleCustomerIdChange}
                      />
                    </Col>
                  </Row>
                }
              />
            </Form>
          </div>
          <div className="mt-5">
            <Button variant="primary" onClick={handleSearch}>Search</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchView;
