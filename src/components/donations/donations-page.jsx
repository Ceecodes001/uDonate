 import React, { useState } from 'react';
import { FaHeart, FaUsers, FaArrowLeft, FaEthereum, FaSearch, FaBitcoin, FaCopy } from 'react-icons/fa';
import './donations-page.css';
import PaymentCheckout from './PaymentCheckout'; // your existing checkout component

// Import remaining category campaigns
import warCampaigns from './campaigns/war';
import orphansCampaigns from './campaigns/orphans';
import povertyCampaigns from './campaigns/poverty';
import educationCampaigns from './campaigns/education';

import WAR1  from '../../assets/war/gaza1.jpeg';
import WAR2 from '../../assets/war/gaza2.jpeg';
import SUDAN1 from '../../assets/sudan1.jpeg';
import AFGHN1 from '../../assets/hardcoded/afghan1.jpeg';
import AFGHN2 from '../../assets/hardcoded/afghan2.jpeg';
import CANCER from '../../assets/hardcoded/cancer.jpeg';
import CHARLIE from '../../assets/hardcoded/charlie.jpeg';
import CHILD from '../../assets/hardcoded/child education.jpeg';
import CIVIL from '../../assets/hardcoded/civil-p.jpeg';
import WATER from '../../assets/hardcoded/clean water.jpeg';
import AFRICA from '../../assets/hardcoded/east africa.jpeg';
import FOOD from '../../assets/hardcoded/food.jpeg';
import HEALTH from '../../assets/hardcoded/health worker.jpeg';
import HIV from '../../assets/hardcoded/hiv.jpeg';
import HUMAN from '../../assets/hardcoded/human-t.jpeg';
import MIGRANT from '../../assets/hardcoded/migrants.jpeg';
import MY from '../../assets/hardcoded/Myanmar.jpeg';
import RARE from '../../assets/hardcoded/rare disease.jpeg';
import DELIEVERY from '../../assets/hardcoded/support for safe delievery.jpeg';
import WOMAN from '../../assets/hardcoded/woman-r.jpeg';
import YEMEN from '../../assets/hardcoded/yemen.jpeg';

// --- Your new set of crypto addresses (from you) ---
const CRYPTO_ADDRESSES = {
  BTC: 'bc1qd0l4rpekuxey4dchuaqt963wuz5djpskj9az06',
  ETH: '0x2F549207342b44ADF00d25893580b23902f3137B',
  USDT: '0x2F549207342b44ADF00d25893580b23902f3137B', // USDT-ERC20
  USDC: '0x2F549207342b44ADF00d25893580b23902f3137B', // USDC-ERC20
  LTC: 'LYeqNHY5YR258V41SEMN8WmdHHrm76EzkD',
  DOGE: 'D7whXjWwZzsXqnfZdy3rSkBtvTbyefr4d4',
  TRX: 'TNyKcnXh9GhANHaCgQyTdnXGmMc72ykQFC',
  XRP: 'raMJSVpvpi8RY6yqmeAo9VPsAeECz1qvmc'
};

// --- Charlie Kirk Campaign (Moved to TOP) ---
const charlieKirkCampaign = {
  id: 'charlie1',
  title: "Charlie Kirk's Donation Campaign",
  description: 'Support Erika and her two children after tragic loss.',
  fullDescription: 'This fund provides direct support to Erika and her two children (aged 3 and 1) after the tragic loss of Charlie Kirk. Your donations will help cover living expenses, education costs, and provide stability during this difficult time. Our foundation ensures that all funds and support from this campeign goes directly to Erica and her childern directly.',
  image: CHARLIE,
  category: 'featured',
  raised: 5000,
  goal: 500000,
  donors: 250,
};

// --- Hardcoded Emergency Relief Campaigns ---
const emergencyCampaigns = [
  {
    id: 'emergency1',
    title: 'Humanitarian Relief for war victims in Gaza',
    description: 'Aid and supplies for displaced families, children, and medical care.',
    fullDescription: 'Providing food, water, and emergency support where crossings are blocked.',
    image: WAR1,
    category: 'emergency',
    raised: 4500,
    goal: 120000,
    donors: 210,
  },
  {
    id: 'emergency2',
    title: 'Famine Prevention in Northern Gaza',
    description: 'Emergency food, fuel, and supply distribution.',
    fullDescription: 'Prevent starvation among displaced residents and victims of war outbreak.',
    image: WAR2,
    category: 'emergency',
    raised: 3100,
    goal: 200000,
    donors: 98,
  },
  {
    id: 'emergency3',
    title: 'Support for affected Civilians in Sudan',
    description: 'Shelter, medical supplies, and aid for those fleeing violence.',
    fullDescription: 'Support civilians besieged in El Fasher & Darfur amidst the civil war.',
    image: SUDAN1,
    category: 'emergency',
    raised: 6200,
    goal: 450000,
    donors: 145,
  },
  {
    id: 'emergency4',
    title: 'Hunger Crisis in Afghanistan',
    description: 'Assistance for malnutrition and food insecurity.',
    fullDescription: 'Help vulnerable children and families displaced from poverty and war.',
    image: AFGHN1,
    category: 'emergency',
    raised: 5300,
    goal: 1000000,
    donors: 180,
  },
  {
    id: 'emergency5',
    title: 'Earthquake Relief in Afghanistan',
    description: 'Urgent clothing, shelter, and medical treatment.',
    fullDescription: 'Clean water, healthcare, and shelter for earthquake victims.',
    image: AFGHN2,
    category: 'emergency',
    raised: 4100,
    goal: 260000,
    donors: 135,
  },
  {
    id: 'emergency6',
    title: 'Aid to Conflict-Affected Households in Myanmar',
    description: 'Support households hit by war and natural disasters.',
    fullDescription: 'Food, shelter, and healthcare for Myanmar\'s vulnerable families.',
    image: MY,
    category: 'emergency',
    raised: 2800,
    goal: 250000,
    donors: 90,
  },
  {
    id: 'emergency7',
    title: 'Crisis in Yemen & Syria',
    description: 'Support victims of prolonged wars in Yemen & Syria.',
    fullDescription: 'Food, medicine, and shelter for displaced families amidst destroyed infrastructure.',
    image: YEMEN,
    category: 'emergency',
    raised: 7700,
    goal: 250000,
    donors: 320,
  },
  {
    id: 'emergency8',
    title: 'Climate Crisis & Disasters in East Africa',
    description: 'Relief against drought, food & water scarcity.',
    fullDescription: 'Help families suffering from climate-driven crises in East Africa.',
    image: AFRICA,
    category: 'emergency',
    raised: 3500,
    goal: 275000,
    donors: 115,
  }
];

// --- Human Rights & Civilian Safety Campaigns ---
const humanRightsCampaigns = [
  {
    id: 'rights2',
    title: 'Stop Human Trafficking and Child Labor',
    description: 'Fund rescue operations and survivor rehabilitation.',
    fullDescription: 'Anti-trafficking programs, education campaigns, and survivor support.',
    image: HUMAN,
    category: 'humanrights',
    raised: 6800,
    goal: 280000,
    donors: 290,
  },
  {
    id: 'rights3',
    title: 'Women\'s Rights',
    description: 'Campaigns against gender-based violence and forced marriages.',
    fullDescription: 'Advocacy and support programs for women facing discrimination and violence.',
    image: WOMAN,
    category: 'humanrights',
    raised: 4200,
    goal: 330000,
    donors: 160,
  },
  {
    id: 'rights4',
    title: 'Civilian Protection in Conflict Zones',
    description: 'Support humanitarian corridors and food distribution.',
    fullDescription: 'Provide relief in war-torn areas ensuring safety of civilians.',
    image: CIVIL,
    category: 'humanrights',
    raised: 3600,
    goal: 350000,
    donors: 140,
  },
  {
    id: 'rights5',
    title: 'Support for Safe Delivery of Aids',
    description: 'Demand safe passage of relief to civilians.',
    fullDescription: 'Ensure humanitarian aid reaches civilians in dangerous zones.',
    image: DELIEVERY,
    category: 'humanrights',
    raised: 2500,
    goal: 250000,
    donors: 100,
  }
];

// --- Healthcare Campaigns ---
const healthcareCampaigns = [
  {
    id: 'health1',
    title: 'Global Cancer Research & Development Innovation',
    description: 'Support advanced treatments like immunotherapy & CAR-T.',
    fullDescription: 'Funding new treatments to improve survival rates in cancer patients.',
    image: CANCER,
    category: 'healthcare',
    raised: 8500,
    goal: 430000,
    donors: 370,
  },
  {
    id: 'health2',
    title: 'HIV/AIDS Cure Research & Development',
    description: 'Research vaccines and elimination strategies.',
    fullDescription: 'Funding efforts to develop a functional cure for HIV/AIDS.',
    image: HIV,
    category: 'healthcare',
    raised: 6700,
    goal: 900000,
    donors: 280,
  },
  {
    id: 'health3',
    title: 'Rare Disease Support Campaign',
    description: 'Support for women & children with deadly rare diseases.',
    fullDescription: 'Funding for treatment of diseases like malaria, TB, Parkinson\'s, ALS.',
    image: RARE,
    category: 'healthcare',
    raised: 4900,
    goal: 450000,
    donors: 190,
  },
  {
    id: 'health4',
    title: 'Health Worker Support & Emergency Medical Aid',
    description: 'Gear, medicines, and support for overwhelmed clinics.',
    fullDescription: 'Especially in Gaza, Sudan, and Afghanistan.',
    image: HEALTH,
    category: 'healthcare',
    raised: 4100,
    goal: 320000,
    donors: 150,
  },
  {
    id: 'health6',
    title: 'Clean Water & Sanitation in War Zones',
    description: 'WASH programs in Gaza, Sudan, and remote regions.',
    fullDescription: 'Provide clean water and sanitation in conflict areas.',
    image: WATER,
    category: 'healthcare',
    raised: 3300,
    goal: 500000,
    donors: 125,
  },
  {
    id: 'health7',
    title: 'Recovery & Protection for Migrants & Refugees',
    description: 'Support displaced families and refugees fleeing by sea.',
    fullDescription: 'Food, water, and shelter for those in camps lacking necessities.',
    image: MIGRANT,
    category: 'healthcare',
    raised: 4700,
    goal: 325000,
    donors: 160,
  },
  {
    id: 'health8',
    title: 'Food & Nutrition Aid in Western Africa',
    description: 'Help communities suffering from conflict-driven hunger.',
    fullDescription: 'Emergency nutrition for malnourished children and families.',
    image: FOOD,
    category: 'healthcare',
    raised: 5200,
    goal: 1000000,
    donors: 200,
  }
];

// Combine all campaigns (Charlie Kirk first, then others)
const allCampaigns = [
  charlieKirkCampaign, // Charlie Kirk campaign at the top
  ...warCampaigns,
  ...orphansCampaigns,
  ...povertyCampaigns,
  ...educationCampaigns,
  ...emergencyCampaigns,
  ...humanRightsCampaigns,
  ...healthcareCampaigns
];

// Enrich every campaign with the unified crypto addresses object so every campaign shows the same options
const enrichedCampaigns = allCampaigns.map((c) => ({
  ...c,
  cryptoAddresses: CRYPTO_ADDRESSES
}));

const categories = [
  { id: 'all', name: 'All Campaigns' },
  { id: 'featured', name: 'Featured' },
  { id: 'war', name: 'War Victims' },
  { id: 'orphans', name: 'Orphans' },
  { id: 'poverty', name: 'Poverty' },
  { id: 'education', name: 'Education' },
  { id: 'emergency', name: 'Emergency Relief' },
  { id: 'humanrights', name: 'Human Rights & Safety' },
  { id: 'healthcare', name: 'Healthcare' }
];

const DonationPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false);

  const filteredCampaigns =
    activeCategory === 'all'
      ? enrichedCampaigns
      : enrichedCampaigns.filter((c) => c.category === activeCategory);

  const openCampaignDetail = (campaign) => setSelectedCampaign(campaign);

  const openDonationModal = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDonationModal(true);
  };

  const handleDonate = () => {
    setShowDonationModal(false);
    setShowPaymentCheckout(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentCheckout(false);
    setDonationAmount('');
    alert(`Thank you for your donation of $${donationAmount} to ${selectedCampaign.title}!`);
  };

  if (selectedCampaign && !showDonationModal && !showPaymentCheckout) {
    return (
      <CampaignDetail
        campaign={selectedCampaign}
        onBack={() => setSelectedCampaign(null)}
        onDonate={() => openDonationModal(selectedCampaign)}
      />
    );
  }

  return (
    <div className="donation-page">
      <header className="donation-header">
        <div className="container">
          <h1>uDonate Campaigns</h1>
          <p>Make a difference today by supporting these causes</p>
        </div>
      </header>

      <div className="container">
        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder="Search campaigns..." />
          </div>
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Grid */}
        <div className="campaigns-grid">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-image">
                <img src={campaign.image} alt={campaign.title} />
                <div className="category-badge">{campaign.category}</div>
              </div>
              <div className="campaign-content">
                <h3>{campaign.title}</h3>
                <p>{campaign.description}</p>

                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(campaign.raised / campaign.goal) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="progress-stats">
                    <span>${campaign.raised.toLocaleString()} raised</span>
                    <span>${campaign.goal.toLocaleString()} goal</span>
                  </div>
                </div>

                <div className="campaign-meta">
                  <div className="meta-item">
                    <FaUsers /> {campaign.donors} donors
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="details-btn"
                    onClick={() => openCampaignDetail(campaign)}
                  >
                    View Details
                  </button>
                  <button
                    className="donate-btn"
                    onClick={() => openDonationModal(campaign)}
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Donation Modal for Amount Selection */}
      {showDonationModal && selectedCampaign && (
        <DonationModal
          campaign={selectedCampaign}
          donationAmount={donationAmount}
          setDonationAmount={setDonationAmount}
          onClose={() => setShowDonationModal(false)}
          onDonate={handleDonate}
        />
      )}

      {/* Advanced Payment Checkout System */}
      {showPaymentCheckout && selectedCampaign && (
        <PaymentCheckout
          campaign={selectedCampaign}
          donationAmount={donationAmount}
          onClose={() => {
            setShowPaymentCheckout(false);
            setDonationAmount('');
          }}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

// --- Campaign Detail Component ---
const CampaignDetail = ({ campaign, onBack, onDonate }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const copyAddress = async (tokenKey) => {
    const addr = campaign.cryptoAddresses && campaign.cryptoAddresses[tokenKey];
    if (!addr) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(addr);
      } else {
        // fallback
        const textArea = document.createElement('textarea');
        textArea.value = addr;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopySuccess(`${tokenKey} address copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Copy failed — please copy manually.');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const renderTokenIcon = (key) => {
    switch (key) {
      case 'BTC':
        return <FaBitcoin />;
      case 'ETH':
        return <FaEthereum />;
      case 'USDT':
         return <span>USDT</span>;
      case 'USDC':
        return <span style={{ fontWeight: 500 }}>{key}</span>;
      case 'LTC':
        return <span>Ł</span>;
      case 'DOGE':
        return <span>Ð</span>;
      case 'TRX':
        return <span>⟲</span>;
      case 'XRP':
        return <span>✕</span>;
      default:
        return <span>{key}</span>;
    }
  };

  return (
    <div className="campaign-detail">
      <button className="back-button" onClick={onBack}>
        <FaArrowLeft /> Back to Campaigns
      </button>
      <div className="detail-header">
        <img src={campaign.image} alt={campaign.title} />
        <div className="header-content">
          <h1>{campaign.title}</h1>
          <p className="category-tag">{campaign.category}</p>
        </div>
      </div>

      <div className="detail-content">
        <div className="main-content">
          <h2>About the Campaign</h2>
          <p>{campaign.fullDescription}</p>
          <h2>Impact of Your Donation</h2>
          <ul className="impact-list">
            <li>$10 can provide clean water for one person for a year</li>
            <li>$25 can supply school materials for a child for one year</li>
            <li>$50 can provide a family with food for a month</li>
            <li>$100 can cover emergency medical expenses</li>
          </ul>
        </div>

        <div className="donation-sidebar">
          <div className="stats-box">
            <div className="stat">
              <span className="stat-value">${campaign.raised.toLocaleString()}</span>
              <span className="stat-label">Raised</span>
            </div>
            <div className="stat">
              <span className="stat-value">${campaign.goal.toLocaleString()}</span>
              <span className="stat-label">Goal</span>
            </div>
            <div className="stat">
              <span className="stat-value">{campaign.donors}</span>
              <span className="stat-label">Donors</span>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {((campaign.raised / campaign.goal) * 100).toFixed(1)}% funded
            </div>
          </div>

          <button className="donate-btn large" onClick={onDonate}>
            <FaHeart /> Donate Now
          </button>

          <div className="crypto-info">
            

            <div className="copy-feedback" aria-live="polite">
              {copySuccess && <span>{copySuccess}</span>}
            </div>

            <p className="note">Note: These addresses were provided for donation options. Please verify before sending.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Simple Donation Modal (for amount selection only) ---
const DonationModal = ({ campaign, donationAmount, setDonationAmount, onClose, onDonate }) => {
  const quickAmounts = [10, 25, 50, 100, 250, 500];
  return (
    <div className="modal-overlay">
      <div className="donation-modal">
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <h2>Donate to {campaign.title}</h2>
        <div className="donation-options">
          <div className="quick-amounts">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                className={`amount-btn ${donationAmount == amount ? 'selected' : ''}`}
                onClick={() => setDonationAmount(amount)}
              >
                ${amount}
              </button>
            ))}
          </div>
          <div className="custom-amount">
            <label htmlFor="custom-amount">Or enter custom amount:</label>
            <div className="amount-input">
              <span>$</span>
              <input
                type="number"
                id="custom-amount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <button
          className="donate-now-btn"
          onClick={onDonate}
          disabled={!donationAmount || donationAmount <= 0}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default DonationPage;