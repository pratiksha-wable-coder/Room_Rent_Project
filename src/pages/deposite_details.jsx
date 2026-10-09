import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import './Deposite_Details.css'; 

const Deposite_Details = () => {
    const [deposit, setDeposit] = useState(null);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:8080/api/deposits/customer/${userId}`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setDeposit(res.data[res.data.length - 1]);
                }
            })
            .catch(err => console.error("Error fetching data:", err));
    }, [userId, navigate]);

    if (!deposit) return <div className="loading-screen">Generating Your Receipt...</div>;

    return (
        <div className="deposit-details-page">
            <Navbar />
            <div className="receipt-wrapper">
                <div className="receipt-card">
                    <div className="receipt-header">
                        <h2>Payment Receipt</h2>
                        <span className="status-badge">Completed</span>
                    </div>

                    <div className="receipt-body">
                        <div className="info-group">
                            <h4 className="section-label">Property & Owner Info</h4>
                            <div className="data-row">
                                <span className="label">Owner Name</span>
                                <span className="value">{deposit.owner?.name || "N/A"}</span>
                            </div>
                            <div className="data-row">
                                <span className="label">Location</span>
                                <span className="value">{deposit.location}</span>
                            </div>
                        </div>

                        <div className="info-group">
                            <h4 className="section-label">Tenant Information</h4>
                            <div className="data-row">
                                <span className="label">Tenant Name</span>
                                <span className="value text-highlight">{deposit.customer?.name || "N/A"}</span>
                            </div>
                            <div className="data-row">
                                <span className="label">Receipt No</span>
                                <span className="value">{deposit.depositId}</span>
                            </div>
                            <div className="data-row">
                                <span className="label">Date</span>
                                <span className="value">{deposit.paymentDate}</span>
                            </div>
                        </div>

                        <div className="amount-summary">
                            <div className="amount-row">
                                <span>Monthly Rent</span>
                                <span>₹{deposit.rent}</span>
                            </div>
                            <div className="amount-row total">
                                <span>Security Deposit Paid</span>
                                <span>₹{deposit.depositAmount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="receipt-footer">
                        <button className="confirm-btn" onClick={() => navigate('/room_details')}>
                            Confirm & Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Deposite_Details;