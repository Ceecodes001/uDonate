
// --- Hardcoded Emergency Relief Campaigns ---
import React, { useState } from 'react';
import { FaHeart, FaUsers, FaArrowLeft, FaEthereum, FaSearch } from 'react-icons/fa';
import './donations-page.css';
import PaymentCheckout from './PaymentCheckout'; // Import the PaymentCheckout component

// Import remaining category campaigns
import warCampaigns from './campaigns/war';
import orphansCampaigns from './campaigns/orphans';
import povertyCampaigns from './campaigns/poverty';
import educationCampaigns from './campaigns/education';
import WAR1  from '../../assets/war/gaza1.jpeg';
import WAR2 from '../../assets/war/gaza2.jpeg'
import SUDAN1 from '../../assets/sudan1.jpeg'
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
    goal: 12000,
    donors: 210,
    cryptoAddress: '0x11111111111111111111111111111111'
  },
  {
    id: 'emergency2',
    title: 'Famine Prevention in Northern Gaza',
    description: 'Emergency food, fuel, and supply distribution.',
    fullDescription: 'Prevent starvation among displaced residents and victims of war outbreak.',
    image: WAR2,
    category: 'emergency',
    raised: 3100,
    goal: 10000,
    donors: 98,
    cryptoAddress: '0x22222222222222222222222222222222'
  },
  {
    id: 'emergency3',
    title: 'Support for affected Civilians in Sudan',
    description: 'Shelter, medical supplies, and aid for those fleeing violence.',
    fullDescription: 'Support civilians besieged in El Fasher & Darfur amidst the civil war.',
    image: SUDAN1,
    category: 'emergency',
    raised: 6200,
    goal: 15000,
    donors: 145,
    cryptoAddress: '0x33333333333333333333333333333333'
  },
  {
    id: 'emergency4',
    title: 'Hunger Crisis in Afghanistan',
    description: 'Assistance for malnutrition and food insecurity.',
    fullDescription: 'Help vulnerable children and families displaced from poverty and war.',
    image: 'https://via.placeholder.com/600x400?text=Afghanistan+Hunger',
    category: 'emergency',
    raised: 5300,
    goal: 14000,
    donors: 180,
    cryptoAddress: '0x44444444444444444444444444444444'
  },
  {
    id: 'emergency5',
    title: 'Earthquake Relief in Afghanistan',
    description: 'Urgent clothing, shelter, and medical treatment.',
    fullDescription: 'Clean water, healthcare, and shelter for earthquake victims.',
    image: 'https://via.placeholder.com/600x400?text=Afghanistan+Earthquake',
    category: 'emergency',
    raised: 4100,
    goal: 12000,
    donors: 135,
    cryptoAddress: '0x55555555555555555555555555555555'
  },
  {
    id: 'emergency6',
    title: 'Aid to Conflict-Affected Households in Myanmar',
    description: 'Support households hit by war and natural disasters.',
    fullDescription: 'Food, shelter, and healthcare for Myanmar’s vulnerable families.',
    image: 'https://via.placeholder.com/600x400?text=Myanmar+Relief',
    category: 'emergency',
    raised: 2800,
    goal: 9000,
    donors: 90,
    cryptoAddress: '0x66666666666666666666666666666666'
  },
  {
    id: 'emergency7',
    title: 'Crisis in Yemen & Syria',
    description: 'Support victims of prolonged wars in Yemen & Syria.',
    fullDescription: 'Food, medicine, and shelter for displaced families amidst destroyed infrastructure.',
    image: 'https://via.placeholder.com/600x400?text=Yemen+Syria+Relief',
    category: 'emergency',
    raised: 7700,
    goal: 20000,
    donors: 320,
    cryptoAddress: '0x77777777777777777777777777777777'
  },
  {
    id: 'emergency8',
    title: 'Climate Crisis & Disasters in East Africa',
    description: 'Relief against drought, food & water scarcity.',
    fullDescription: 'Help families suffering from climate-driven crises in East Africa.',
    image: 'https://via.placeholder.com/600x400?text=East+Africa+Drought',
    category: 'emergency',
    raised: 3500,
    goal: 11000,
    donors: 115,
    cryptoAddress: '0x88888888888888888888888888888888'
  }
];

// --- Human Rights & Civilian Safety Campaigns ---
const humanRightsCampaigns = [
  {
    id: 'rights1',
    title: "Charlie Kirk's Donation Campaign",
    description: 'Support Erika and her two children after tragic loss.',
    fullDescription: 'This fund provides direct support to Erika and her two children (aged 3 and 1).',
    image: 'https://via.placeholder.com/600x400?text=Charlie+Kirk+Relief',
    category: 'humanrights',
    raised: 5000,
    goal: 20000,
    donors: 250,
    cryptoAddress: '0x99999999999999999999999999999999'
  },
  {
    id: 'rights2',
    title: 'Stop Human Trafficking and Child Labor',
    description: 'Fund rescue operations and survivor rehabilitation.',
    fullDescription: 'Anti-trafficking programs, education campaigns, and survivor support.',
    image: 'https://via.placeholder.com/600x400?text=Anti+Trafficking',
    category: 'humanrights',
    raised: 6800,
    goal: 18000,
    donors: 290,
    cryptoAddress: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  },
  {
    id: 'rights3',
    title: 'Women’s Rights',
    description: 'Campaigns against gender-based violence and forced marriages.',
    fullDescription: 'Advocacy and support programs for women facing discrimination and violence.',
    image: 'https://via.placeholder.com/600x400?text=Women+Rights',
    category: 'humanrights',
    raised: 4200,
    goal: 12000,
    donors: 160,
    cryptoAddress: '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'
  },
  {
    id: 'rights4',
    title: 'Civilian Protection in Conflict Zones',
    description: 'Support humanitarian corridors and food distribution.',
    fullDescription: 'Provide relief in war-torn areas ensuring safety of civilians.',
    image: 'https://via.placeholder.com/600x400?text=Civilian+Protection',
    category: 'humanrights',
    raised: 3600,
    goal: 10000,
    donors: 140,
    cryptoAddress: '0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'
  },
  {
    id: 'rights5',
    title: 'Support for Safe Delivery of Aids',
    description: 'Demand safe passage of relief to civilians.',
    fullDescription: 'Ensure humanitarian aid reaches civilians in dangerous zones.',
    image: 'https://via.placeholder.com/600x400?text=Safe+Aid+Delivery',
    category: 'humanrights',
    raised: 2500,
    goal: 9000,
    donors: 100,
    cryptoAddress: '0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'
  }
];

// --- Healthcare Campaigns ---
const healthcareCampaigns = [
  {
    id: 'health1',
    title: 'Global Cancer Research & Development Innovation',
    description: 'Support advanced treatments like immunotherapy & CAR-T.',
    fullDescription: 'Funding new treatments to improve survival rates in cancer patients.',
    image: 'https://via.placeholder.com/600x400?text=Cancer+Research',
    category: 'healthcare',
    raised: 8500,
    goal: 25000,
    donors: 370,
    cryptoAddress: '0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE'
  },
  {
    id: 'health2',
    title: 'HIV/AIDS Cure Research & Development',
    description: 'Research vaccines and elimination strategies.',
    fullDescription: 'Funding efforts to develop a functional cure for HIV/AIDS.',
    image: 'https://via.placeholder.com/600x400?text=HIV+Research',
    category: 'healthcare',
    raised: 6700,
    goal: 20000,
    donors: 280,
    cryptoAddress: '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
  },
  {
    id: 'health3',
    title: 'Rare Disease Support Campaign',
    description: 'Support for women & children with deadly rare diseases.',
    fullDescription: 'Funding for treatment of diseases like malaria, TB, Parkinson’s, ALS.',
    image: 'https://via.placeholder.com/600x400?text=Rare+Diseases',
    category: 'healthcare',
    raised: 4900,
    goal: 15000,
    donors: 190,
    cryptoAddress: '0x11112222333344445555666677778888'
  },
  {
    id: 'health4',
    title: 'Health Worker Support & Emergency Medical Aid',
    description: 'Gear, medicines, and support for overwhelmed clinics.',
    fullDescription: 'Especially in Gaza, Sudan, and Afghanistan.',
    image: 'https://via.placeholder.com/600x400?text=Health+Workers',
    category: 'healthcare',
    raised: 4100,
    goal: 12000,
    donors: 150,
    cryptoAddress: '0x99998888777766665555444433332222'
  },
  {
    id: 'health5',
    title: 'Child Protection and Education in Conflict Zones',
    description: 'Rebuild schools and provide psychological support.',
    fullDescription: 'Safe spaces and education for children affected by war.',
    image: 'https://via.placeholder.com/600x400?text=Child+Protection',
    category: 'healthcare',
    raised: 3900,
    goal: 11000,
    donors: 140,
    cryptoAddress: '0xAAAABBBBCCCCDDDDEEEEFFFF11112222'
  },
  {
    id: 'health6',
    title: 'Clean Water & Sanitation in War Zones',
    description: 'WASH programs in Gaza, Sudan, and remote regions.',
    fullDescription: 'Provide clean water and sanitation in conflict areas.',
    image: 'https://via.placeholder.com/600x400?text=Clean+Water',
    category: 'healthcare',
    raised: 3300,
    goal: 10000,
    donors: 125,
    cryptoAddress: '0x12344321123443211234432112344321'
  },
  {
    id: 'health7',
    title: 'Recovery & Protection for Migrants & Refugees',
    description: 'Support displaced families and refugees fleeing by sea.',
    fullDescription: 'Food, water, and shelter for those in camps lacking necessities.',
    image: 'https://via.placeholder.com/600x400?text=Refugee+Relief',
    category: 'healthcare',
    raised: 4700,
    goal: 14000,
    donors: 160,
    cryptoAddress: '0x22223333444455556666777788889999'
  },
  {
    id: 'health8',
    title: 'Food & Nutrition Aid in Western Africa',
    description: 'Help communities suffering from conflict-driven hunger.',
    fullDescription: 'Emergency nutrition for malnourished children and families.',
    image: 'https://via.placeholder.com/600x400?text=West+Africa+Food+Aid',
    category: 'healthcare',
    raised: 5200,
    goal: 16000,
    donors: 200,
    cryptoAddress: '0x33334444555566667777888899990000'
  }
];

// Combine all campaigns
const allCampaigns = [
  ...warCampaigns,
  ...orphansCampaigns,
  ...povertyCampaigns,
  ...educationCampaigns,
  ...emergencyCampaigns,
  ...humanRightsCampaigns,
  ...healthcareCampaigns
];

const categories = [
  { id: 'all', name: 'All Campaigns' },
  { id: 'war', name: 'War Victims' },
  { id: 'orphans', name: 'Orphans' },
  { id: 'poverty', name: 'Poverty' },
  { id: 'education', name: 'Education' },
  { id: 'emergency', name: 'Emergency Relief' },
  { id: 'humanrights', name: 'Human Rights & Safety' },
  { id: 'healthcare', name: 'Healthcare' }
];

// --- rest of your DonationPage component stays unchanged ---


const DonationPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false);

  const filteredCampaigns =
    activeCategory === 'all'
      ? allCampaigns
      : allCampaigns.filter((c) => c.category === activeCategory);

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
const CampaignDetail = ({ campaign, onBack, onDonate }) => (
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
          <h3>Cryptocurrency Donations</h3>
          <p>You can also donate using cryptocurrency:</p>
          <div className="crypto-address">
            <FaEthereum />
            <span>{campaign.cryptoAddress}</span>
          </div>
          <p className="note">Note: This is a placeholder crypto address for demonstration.</p>
        </div>
      </div>
    </div>
  </div>
);

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
