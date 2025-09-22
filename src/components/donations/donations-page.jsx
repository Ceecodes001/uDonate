import React, { useState } from 'react';
import { FaHeart, FaUsers, FaClock, FaArrowLeft, FaEthereum, FaSearch } from 'react-icons/fa';
import './donations-page.css';

// Import all category campaigns
import warCampaigns from './campaigns/war';
import healthCampaigns from './campaigns/health';
import orphansCampaigns from './campaigns/orphans';
import povertyCampaigns from './campaigns/poverty';
import educationCampaigns from './campaigns/education';
import environmentCampaigns from './campaigns/environment';

// Combine all campaigns
const allCampaigns = [
  ...warCampaigns,
  ...healthCampaigns,
  ...orphansCampaigns,
  ...povertyCampaigns,
  ...educationCampaigns,
  ...environmentCampaigns
];

const categories = [
  { id: 'all', name: 'All Campaigns' },
  { id: 'war', name: 'War Victims' },
  { id: 'health', name: 'Sick Patients' },
  { id: 'orphans', name: 'Orphans' },
  { id: 'poverty', name: 'Poor Families' },
  { id: 'education', name: 'Education' },
  { id: 'environment', name: 'Environment' }
];

const DonationPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);

  const filteredCampaigns = activeCategory === 'all'
    ? allCampaigns
    : allCampaigns.filter(c => c.category === activeCategory);

  const openCampaignDetail = (campaign) => setSelectedCampaign(campaign);
  const openDonationModal = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDonationModal(true);
  };
  const handleDonate = () => {
    alert(`Thank you for your donation of $${donationAmount} to ${selectedCampaign.title}!`);
    setShowDonationModal(false);
    setDonationAmount('');
  };

  if (selectedCampaign && !showDonationModal) {
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
            {categories.map(cat => (
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
          {filteredCampaigns.map(campaign => (
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
                    <div className="progress-fill" style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}></div>
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
                  <div className="meta-item">
                    <FaClock /> {campaign.daysLeft} days left
                  </div>
                </div>

                <div className="card-actions">
                  <button className="details-btn" onClick={() => openCampaignDetail(campaign)}>View Details</button>
                  <button className="donate-btn" onClick={() => openDonationModal(campaign)}>Donate Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDonationModal && selectedCampaign && (
        <DonationModal 
          campaign={selectedCampaign}
          donationAmount={donationAmount}
          setDonationAmount={setDonationAmount}
          onClose={() => setShowDonationModal(false)}
          onDonate={handleDonate}
        />
      )}
    </div>
  );
};

// --- Campaign Detail Component ---
const CampaignDetail = ({ campaign, onBack, onDonate }) => (
  <div className="campaign-detail">
    <button className="back-button" onClick={onBack}><FaArrowLeft /> Back to Campaigns</button>
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
          <li>$100 can cover medical expenses for a sick child</li>
        </ul>
      </div>
      <div className="donation-sidebar">
        <div className="stats-box">
          <div className="stat"><span className="stat-value">${campaign.raised.toLocaleString()}</span><span className="stat-label">Raised</span></div>
          <div className="stat"><span className="stat-value">${campaign.goal.toLocaleString()}</span><span className="stat-label">Goal</span></div>
          <div className="stat"><span className="stat-value">{campaign.donors}</span><span className="stat-label">Donors</span></div>
          <div className="stat"><span className="stat-value">{campaign.daysLeft}</span><span className="stat-label">Days Left</span></div>
        </div>
        <div className="progress-container">
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}></div></div>
          <div className="progress-text">{((campaign.raised / campaign.goal) * 100).toFixed(1)}% funded</div>
        </div>
        <button className="donate-btn large" onClick={onDonate}><FaHeart /> Donate Now</button>
        <div className="crypto-info">
          <h3>Cryptocurrency Donations</h3>
          <p>You can also donate using cryptocurrency:</p>
          <div className="crypto-address"><FaEthereum /><span>{campaign.cryptoAddress}</span></div>
          <p className="note">Note: This is a placeholder crypto address for demonstration.</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Donation Modal ---
const DonationModal = ({ campaign, donationAmount, setDonationAmount, onClose, onDonate }) => {
  const quickAmounts = [10, 25, 50, 100, 250, 500];
  return (
    <div className="modal-overlay">
      <div className="donation-modal">
        <button className="close-modal" onClick={onClose}>&times;</button>
        <h2>Donate to {campaign.title}</h2>
        <div className="donation-options">
          <div className="quick-amounts">
            {quickAmounts.map(amount => (
              <button key={amount} className={`amount-btn ${donationAmount == amount ? 'selected' : ''}`} onClick={() => setDonationAmount(amount)}>${amount}</button>
            ))}
          </div>
          <div className="custom-amount">
            <label htmlFor="custom-amount">Or enter custom amount:</label>
            <div className="amount-input"><span>$</span><input type="number" id="custom-amount" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} placeholder="0.00" /></div>
          </div>
        </div>
        <button className="donate-now-btn" onClick={onDonate} disabled={!donationAmount || donationAmount <= 0}>Donate Now</button>
      </div>
    </div>
  );
};

export default DonationPage;
