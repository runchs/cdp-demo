import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { convertId, CConvertType, IConvertResp } from '@/composables/convertId'

enum COption {
  AeonId = '1',
  CustomerId = '2'
}

const SearchView: React.FC = () => {

  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<COption>(COption.AeonId);
  const [aeonId, setAEONId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const [convertResp, setConvertResp] = useState<IConvertResp>({
    aeonId: '',
    customerId: '',
  });

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
    if (selectedOption === COption.AeonId && !aeonId) {
      setAlertMsg("The AEON ID cannot be empty.");
      setShowAlert(true);
    } else if (selectedOption === COption.CustomerId && !customerId) {
      setAlertMsg("The Customer ID cannot be empty.");
      setShowAlert(true);
    } else {
      if (!error) {
        setShowAlert(false);
        if (selectedOption === COption.AeonId) {
          setConvertResp(convertId(CConvertType.AeonId, aeonId));
        } else if (selectedOption === COption.CustomerId) {
          setConvertResp(convertId(CConvertType.CustomrtId, customerId));
        }
      } else {
        setAlertMsg("Customer not found (Not register Web Member Service)");
        setShowAlert(true);
      }
    }
  };

  useEffect(() => {
    if (convertResp.aeonId && convertResp.customerId) {
      navigate(`/information?aeonid=${convertResp.aeonId}&customerid=${convertResp.customerId}`);
    }
  }, [convertResp]);

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
    <div className="h-100 search-view-container fw-bold">
      <div className="rounded-4 bg-light w-50 mx-auto overflow-hidden search-box">
        <div className="bg-purple w-100 py-4 fw-bold fs-4 text-white">Please Input<br></br>AEON ID / Customer ID</div>
        <div className="p-5 text-start my-5">
          {alertMessage()}
          <div>
            <Form>
              {/* AEON ID Radio */}
              <Form.Check
                type="radio"
                id="aeonIdRadio"
                name="options"
                value={COption.AeonId}
                className="d-flex align-items-center mb-3 w-100"
                defaultChecked={selectedOption === COption.AeonId}
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
                        disabled={selectedOption !== COption.AeonId}
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
                value={COption.CustomerId}
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
                        disabled={selectedOption !== COption.CustomerId}
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
            <Button variant="primary" className="purple-btn shadow-sm" onClick={handleSearch}>Search</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchView;
