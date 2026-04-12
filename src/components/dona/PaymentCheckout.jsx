// PaymentCheckout.js (Updated with Card Payment Option)
import React, { useState, useEffect } from 'react';
import { 
  FaEthereum, FaBitcoin, FaCopy, FaCheck, FaQrcode, FaShieldAlt, 
  FaExchangeAlt, FaCreditCard, FaUser, FaCalendarAlt, FaLock 
} from 'react-icons/fa';
import './paymentCheckout.css';

const PaymentCheckout = ({ campaign, donationAmount, onClose, onPaymentComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); // 'crypto' or 'card'
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState({});
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [timer, setTimer] = useState(900);
  const [paymentVerified, setPaymentVerified] = useState(false);
  
  // Card payment states
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardErrors, setCardErrors] = useState({});

  const cryptoRates = {
    eth: 3500,
    btc: 65000,
    usdt: 1,
    usdc: 1
  };

  const cryptoOptions = [
    { id: 'eth', name: 'Ethereum (ETH)', icon: FaEthereum, address: campaign.cryptoAddress || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
    { id: 'btc', name: 'Bitcoin (BTC)', icon: FaBitcoin, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
    { id: 'usdt', name: 'USDT (ERC-20)', icon: FaEthereum, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    { id: 'usdc', name: 'USDC (ERC-20)', icon: FaEthereum, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }
  ];

  useEffect(() => {
    setExchangeRate(cryptoRates);
    
    if (selectedCrypto && donationAmount) {
      setCryptoAmount(donationAmount / cryptoRates[selectedCrypto]);
    }

    if (step === 2 && selectedPaymentMethod === 'crypto') {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedCrypto, donationAmount, step, selectedPaymentMethod]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'crypto') {
      setStep(2); // Go to crypto selection
    } else {
      setStep(5); // Go directly to card payment
    }
  };

  const handleCryptoSelect = (cryptoId) => {
    setSelectedCrypto(cryptoId);
    setStep(3); // Go to crypto payment instructions
  };

  // Card validation functions
  const validateCardNumber = (number) => {
    return number.replace(/\s/g, '').length === 16 && /^\d+$/.test(number.replace(/\s/g, ''));
  };

  const validateExpiryDate = (date) => {
    const [month, year] = date.split('/');
    if (!month || !year) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    return month >= 1 && month <= 12 && 
           (year > currentYear || (year == currentYear && month >= currentMonth));
  };

  const validateCVV = (cvv) => {
    return cvv.length === 3 && /^\d+$/.test(cvv);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }
    
    // Limit CVV to 3 digits
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Clear error when user starts typing
    if (cardErrors[field]) {
      setCardErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateCardForm = () => {
    const errors = {};
    
    if (!validateCardNumber(cardDetails.cardNumber)) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!validateExpiryDate(cardDetails.expiryDate)) {
      errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!validateCVV(cardDetails.cvv)) {
      errors.cvv = 'Please enter a valid 3-digit CVV';
    }
    
    if (!cardDetails.cardholderName.trim()) {
      errors.cardholderName = 'Please enter cardholder name';
    }
    
    if (!validateEmail(cardDetails.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const simulateCardPayment = () => {
    return new Promise((resolve, reject) => {
      setIsProcessing(true);
      
      // Simulate API call with random success/failure
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate
        
        if (isSuccess) {
          resolve({
            transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            timestamp: new Date().toISOString(),
            status: 'completed'
          });
        } else {
          reject(new Error('Payment declined. Please check your card details or try a different card.'));
        }
      }, 3000);
    });
  };

  const handleCardPayment = async () => {
    if (!validateCardForm()) return;

    try {
      const result = await simulateCardPayment();
      setStep(6); // Go to card payment success
    } catch (error) {
      setCardErrors(prev => ({
        ...prev,
        general: error.message
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransactionSubmit = () => {
    if (transactionHash.length > 10) {
      setPaymentVerified(true);
      setTimeout(() => setStep(4), 2000);
    }
  };

  const renderStep1 = () => (
    <div className="checkout-step">
      <h2>Choose Payment Method</h2>
      <p className="step-description">Select how you'd like to make your donation</p>
      
      <div className="payment-methods">
        <div 
          className={`payment-method ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodSelect('card')}
        >
          <div className="method-icon">
            <FaCreditCard />
          </div>
          <div className="method-info">
            <h3>Credit/Debit Card</h3>
            <p>Pay instantly with your card</p>
            <div className="method-badges">
              <span className="badge">Visa</span>
              <span className="badge">Mastercard</span>
              <span className="badge">Amex</span>
            </div>
          </div>
        </div>

        <div 
          className={`payment-method ${selectedPaymentMethod === 'crypto' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodSelect('crypto')}
        >
          <div className="method-icon">
            <FaEthereum />
          </div>
          <div className="method-info">
            <h3>Cryptocurrency</h3>
            <p>Pay with crypto (BTC, ETH, USDT, USDC)</p>
            <div className="method-badges">
              <span className="badge">Bitcoin</span>
              <span className="badge">Ethereum</span>
              <span className="badge">Stablecoins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="checkout-step">
      <h2>Select Cryptocurrency</h2>
      <p className="step-description">Choose your preferred cryptocurrency for donation</p>
      
      <div className="crypto-options">
        {cryptoOptions.map(crypto => (
          <div 
            key={crypto.id}
            className={`crypto-option ${selectedCrypto === crypto.id ? 'selected' : ''}`}
            onClick={() => handleCryptoSelect(crypto.id)}
          >
            <div className="crypto-icon">
              {React.createElement(crypto.icon)}
            </div>
            <div className="crypto-info">
              <h3>{crypto.name}</h3>
              <p>Exchange rate: 1 {crypto.id.toUpperCase()} = ${exchangeRate[crypto.id]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => {
    const selectedCryptoData = cryptoOptions.find(c => c.id === selectedCrypto);
    
    return (
      <div className="checkout-step">
        <h2>Make Your Payment</h2>
        <p className="step-description">Send exactly {cryptoAmount.toFixed(6)} {selectedCrypto.toUpperCase()} to the address below</p>
        
        <div className="payment-details">
          <div className="amount-card">
            <div className="amount-display">
              <span className="crypto-amount">{cryptoAmount.toFixed(6)}</span>
              <span className="crypto-symbol">{selectedCrypto.toUpperCase()}</span>
            </div>
            <div className="usd-equivalent">≈ ${donationAmount} USD</div>
          </div>

          <div className="timer-warning">
            <FaExchangeAlt />
            <span>Price valid for: <strong>{formatTime(timer)}</strong></span>
          </div>

          <div className="address-section">
            <label>Send to this {selectedCrypto.toUpperCase()} address:</label>
            <div className="address-display">
              <span>{selectedCryptoData.address}</span>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(selectedCryptoData.address)}
              >
                {copiedAddress ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
          </div>

          <div className="qr-code-section">
            <div className="qr-code">
              <FaQrcode />
              <p>Scan QR Code</p>
            </div>
          </div>

          <div className="payment-instructions">
            <h4>Important Instructions:</h4>
            <ul>
              <li>Send exactly {cryptoAmount.toFixed(6)} {selectedCrypto.toUpperCase()}</li>
              <li>Use only the {selectedCrypto.toUpperCase()} network</li>
              <li>Do not send from an exchange wallet</li>
              <li>Transaction may take 5-15 minutes to confirm</li>
            </ul>
          </div>
        </div>

        <button className="next-btn" onClick={() => setStep(4)}>
          I've Sent the Payment
        </button>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="checkout-step">
      <h2>Verify Your Payment</h2>
      <p className="step-description">Enter your transaction hash to verify the donation</p>
      
      <div className="verification-section">
        <div className="security-badge">
          <FaShieldAlt />
          <span>Secure Verification</span>
        </div>

        <div className="transaction-input">
          <label>Transaction Hash (TXID):</label>
          <input
            type="text"
            placeholder="Enter your transaction hash here..."
            value={transactionHash}
            onChange={(e) => setTransactionHash(e.target.value)}
          />
          <p className="input-help">You can find this in your wallet's transaction history</p>
        </div>

        {paymentVerified && (
          <div className="verification-success">
            <FaCheck />
            <span>Payment verified successfully!</span>
          </div>
        )}

        <button 
          className="verify-btn"
          onClick={handleTransactionSubmit}
          disabled={!transactionHash || transactionHash.length < 10}
        >
          Verify Payment
        </button>

        <div className="verification-info">
          <h4>How verification works:</h4>
          <ul>
            <li>We check the blockchain for your transaction</li>
            <li>Verify the amount and recipient address</li>
            <li>Confirm transaction has sufficient confirmations</li>
            <li>Process typically takes 30-60 seconds</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="checkout-step">
      <h2>Card Payment</h2>
      <p className="step-description">Enter your card details securely</p>
      
      <div className="card-payment-form">
        <div className="security-notice-card">
          <FaLock />
          <span>Your payment information is encrypted and secure</span>
        </div>

        {cardErrors.general && (
          <div className="error-message general-error">
            {cardErrors.general}
          </div>
        )}

        <div className="form-group">
          <label>Card Number</label>
          <div className={`input-with-icon ${cardErrors.cardNumber ? 'error' : ''}`}>
            <FaCreditCard />
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
            />
          </div>
          {cardErrors.cardNumber && <span className="error-text">{cardErrors.cardNumber}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <div className={`input-with-icon ${cardErrors.expiryDate ? 'error' : ''}`}>
              <FaCalendarAlt />
              <input
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
              />
            </div>
            {cardErrors.expiryDate && <span className="error-text">{cardErrors.expiryDate}</span>}
          </div>

          <div className="form-group">
            <label>CVV</label>
            <div className={`input-with-icon ${cardErrors.cvv ? 'error' : ''}`}>
              <FaLock />
              <input
                type="text"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
              />
            </div>
            {cardErrors.cvv && <span className="error-text">{cardErrors.cvv}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Cardholder Name</label>
          <div className={`input-with-icon ${cardErrors.cardholderName ? 'error' : ''}`}>
            <FaUser />
            <input
              type="text"
              placeholder="John Doe"
              value={cardDetails.cardholderName}
              onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
            />
          </div>
          {cardErrors.cardholderName && <span className="error-text">{cardErrors.cardholderName}</span>}
        </div>

        <div className="form-group">
          <label>Email for Receipt</label>
          <div className={`input-with-icon ${cardErrors.email ? 'error' : ''}`}>
            <FaUser />
            <input
              type="email"
              placeholder="john@example.com"
              value={cardDetails.email}
              onChange={(e) => handleCardInputChange('email', e.target.value)}
            />
          </div>
          {cardErrors.email && <span className="error-text">{cardErrors.email}</span>}
        </div>

        <div className="amount-summary">
          <h4>Donation Summary</h4>
          <div className="summary-item">
            <span>Amount:</span>
            <span>${donationAmount}</span>
          </div>
          <div className="summary-item">
            <span>Processing Fee:</span>
            <span>$0.00</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>${donationAmount}</span>
          </div>
        </div>

        <button 
          className={`pay-now-btn ${isProcessing ? 'processing' : ''}`}
          onClick={handleCardPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            `Pay $${donationAmount}`
          )}
        </button>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="checkout-step success-step">
      <div className="success-animation">
        <div className="checkmark">✓</div>
      </div>
      
      <h2>Payment Successful!</h2>
      <p className="success-message">
        Thank you for your generous donation of ${donationAmount} to {campaign.title}
      </p>

      <div className="transaction-details">
        <h4>Transaction Details:</h4>
        <div className="detail-item">
          <span>Amount:</span>
          <span>${donationAmount} USD</span>
        </div>
        <div className="detail-item">
          <span>Payment Method:</span>
          <span>{selectedPaymentMethod === 'card' ? 'Credit/Debit Card' : selectedCrypto.toUpperCase()}</span>
        </div>
        <div className="detail-item">
          <span>Status:</span>
          <span className="status-confirmed">Completed</span>
        </div>
        <div className="detail-item">
          <span>Email:</span>
          <span>{cardDetails.email}</span>
        </div>
      </div>

      <div className="success-actions">
        <button className="receipt-btn">Download Receipt</button>
        <button className="share-btn">Share This Campaign</button>
        <button className="close-btn" onClick={onPaymentComplete}>
          Return to Campaign
        </button>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  const getStepNumber = () => {
    if (selectedPaymentMethod === 'card') {
      return step === 5 ? 3 : step === 6 ? 4 : step;
    }
    return step;
  };

  const getTotalSteps = () => {
    return selectedPaymentMethod === 'card' ? 4 : 4;
  };

  return (
    <div className="payment-checkout-overlay">
      <div className="payment-checkout-modal">
        <div className="checkout-header">
          <button className="back-btn" onClick={step > 1 ? () => setStep(step - 1) : onClose}>
            ← Back
          </button>
          <h1>Complete Your Donation</h1>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(getStepNumber() / getTotalSteps()) * 100}%` }}></div>
        </div>

        <div className="step-indicator">
          <div className={`step ${getStepNumber() >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <label>Method</label>
          </div>
          <div className={`step ${getStepNumber() >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <label>{selectedPaymentMethod === 'card' ? 'Details' : 'Select Crypto'}</label>
          </div>
          <div className={`step ${getStepNumber() >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <label>{selectedPaymentMethod === 'card' ? 'Payment' : 'Verify'}</label>
          </div>
          <div className={`step ${getStepNumber() >= 4 ? 'active' : ''}`}>
            <span>4</span>
            <label>Complete</label>
          </div>
        </div>

        <div className="checkout-content">
          {getCurrentStepContent()}
        </div>

        <div className="security-notice">
          <FaShieldAlt />
          <span>All transactions are secured with SSL encryption</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;