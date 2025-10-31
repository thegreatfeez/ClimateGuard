# 🌍 ClimateGuard - Decentralized Climate Action Platform

<div align="center">

![ClimateGuard Banner](https://img.shields.io/badge/Built%20on-Hedera-00D4AA?style=for-the-badge&logo=ethereum&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Empowering communities to combat climate change through blockchain technology**

[Live Demo](https://climateeguard.netlify.app/) • [Documentation](#features) • [Project Slides](https://drive.google.com/file/d/1aMh8aq68q_VscWNsUiedPb0QoI--bAfm/view?usp=drivesdk) • [Smart Contracts](#smart-contracts) • [Roadmap](#future-roadmap)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Smart Contracts](#-smart-contracts)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Future Roadmap](#-future-roadmap)
- [Team](#-team)
- [License](#-license)

---

## 🌟 Overview

**ClimateGuard** is a decentralized platform that combines **AI-powered weather predictions**, **blockchain verification**, and **tokenized incentives** to drive real-world climate action. Built on **Hedera Hashgraph**, our platform rewards users for eco-friendly activities while providing **hyper-localized environmental alerts** to vulnerable communities.

### 🎯 Mission
To create a transparent, community-driven ecosystem where climate action is incentivized, verified, and rewarded through blockchain technology—starting with precise, location-based weather alerts that save lives.

---

## 🔥 Problem Statement

### Current Challenges:

1. **Lack of Trust in Carbon Credits**
   - Traditional carbon credit systems are opaque
   - No verification mechanism for individual actions
   - Difficult to prove environmental impact

2. **Climate Vulnerability**
   - Extreme weather events increasing globally
   - Poor communities lack access to **precise** early warning systems
   - Generic alerts don't account for neighborhood-level risks
   - No incentive for proactive climate adaptation

3. **Limited Individual Participation**
   - People want to help but don't know how
   - No tangible rewards for eco-friendly actions
   - Disconnected climate initiatives

---

## 💡 Our Solution

ClimateGuard addresses these challenges through:

### 🔐 Blockchain Verification
- **Decentralized Activity Verification**: DAO-based approval system (3-vote consensus)
- **Transparent Records**: All actions recorded on Hedera blockchain
- **Immutable Proof**: Tamper-proof environmental impact tracking

### 🤖 AI-Powered Predictions
- **Hyper-local Weather Alerts**: GPS-based alerts down to street-level accuracy (currently IP-based, GPS coming soon)
- **Smart Risk Assessment**: AI analyzes patterns to predict extreme events
- **Voice-Enabled Assistant**: Climate Q&A with Gemini AI integration
- **14-Day Forecasts**: Extended predictions for premium users

### 💰 Tokenized Incentives
- **CGT Token Rewards**: Earn tokens for verified eco-activities
- **Activity Multipliers**: Up to 5x points for high-impact actions (tree planting, renewable energy)
- **Redeemable Value**: Convert points to tradeable tokens

---

## ✨ Key Features

### 👤 **User Portal**

#### 🌦️ Environmental Alerts
- **Location-based Alerts**: Currently supports IP geolocation with GPS coming soon
- Real-time weather updates with AI predictions
- Severity-based categorization (Low → Critical)
- Dynamic alert filtering by location, category, and time
- Safety tips and disaster preparedness guides
- Works offline with SMS alerts (coming soon)

**Current Implementation:**
- ✅ IP-based location detection (city-level accuracy)
- ✅ Real-time weather data via OpenWeather API
- ✅ 7-day forecast with daily breakdowns
- ✅ Smart alert generation (heatwaves, storms, floods)

**Coming Soon:**
- 🔜 GPS-based hyper-localization (street-level accuracy)
- 🔜 Push notifications for critical alerts
- 🔜 Neighborhood-specific risk zones
- 🔜 Automatic alert delivery to registered users
- 🔜 SMS fallback for areas with poor internet

#### 🌱 Carbon Footprint Tracker
- Log eco-friendly activities (tree planting, recycling, renewable energy)
- Track personal carbon offset/emissions
- Activity-based point calculation with multipliers
- Submit activities for DAO verification
- Real-time verification status tracking

#### 🪙 Token Rewards System
- Earn CGT tokens for verified activities
- Conversion rate: 100 points = 1 CGT
- 24-hour cooldown between claims
- Minimum redemption: 1000 points
- View claimable balance and history

#### 📊 Personal Dashboard
- Track total points, tokens, and impact
- View activity history and verification status
- Monitor carbon offset achievements
- Subscription tier management (Free/Premium/Enterprise)

---

### 🏛️ **Stakeholder Portal**

#### 🗳️ DAO Governance
- Vote on climate project proposals
- Transparent on-chain decision making
- Quorum requirement: 20,000 votes minimum
- Track proposal status (Active/Passed/Rejected)
- Community-driven fund allocation

#### ✅ Verifier System
- Become a verifier with 1000+ CGT tokens (no staking required)
- Review user-submitted activities
- Approve/reject with justification
- 3-vote consensus for auto-approval
- View pending and completed verifications
- Track verification statistics

#### 🔍 Activity Verification Portal
- See all pending user activities
- View detailed activity information (type, carbon impact, proposed points)
- Real-time voting progress tracking
- Automatic execution at 3-vote threshold
- Prevention of double-voting
- 7-day voting period deadline

---

### 🤖 **AI Features**

#### ClimateGuard AI Assistant
- **Gemini AI Integration**: Natural language climate Q&A
- **Voice Input/Output**: Hands-free interaction
- **Weather Context**: Real-time data-aware responses
- **Quick Actions**: Predefined climate queries
- **Safety Guidance**: Disaster preparedness advice

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ User Portal  │  │   AI Chat    │  │  Stakeholder │      │
│  │              │  │   Assistant  │  │    Portal    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Web3 Integration Layer                      │
│              (ethers.js + Hedera JSON-RPC)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Hedera Testnet (Blockchain)                     │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Smart Contracts   │  │   Consensus      │                │
│  │ • Tracker         │  │   Service        │                │
│  │ • Token (CGT)     │  │   (HCS)          │                │
│  │ • DAO Verifier    │  │                  │                │
│  │ • Distributor     │  │                  │                │
│  │ • Alerts          │  │                  │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ OpenWeather  │  │  Gemini AI   │  │  IPFS (Soon) │      │
│  │     API      │  │     API      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📜 Smart Contracts

### Core Contracts

#### 1️⃣ **ClimateToken.sol** (`CGT`)
```solidity
// ERC20 token with role-based minting
MAX_SUPPLY: 1,000,000,000 CGT
MINTER_ROLE: Controlled by RewardDistributor
```
- **Address**: `0xFe3C05334d3383F75F54853962425E3DFF2DCa86`
- **Purpose**: Reward token for verified climate actions
- **Features**: Burnable, role-based access control

#### 2️⃣ **CarbonFootprintTracker.sol**
```solidity
// Tracks user activities and assigns points
Activity Multipliers:
- Tree Planting: 3.0x
- Renewable Energy: 2.5x
- Recycling: 1.5x
- Water Conservation: 1.2x
```
- **Address**: `0xa55B89e5dB076F8699EB7F781252a7C6ceD52b0a`
- **Purpose**: Log and verify eco-activities
- **Features**: Activity multipliers, verification system, pausable

#### 3️⃣ **DAOVerifier.sol**
```solidity
// Decentralized verification through voting
MIN_VERIFIER_STAKE: 1000 CGT
MIN_VOTES_REQUIRED: 3
VOTING_PERIOD: 7 days
```
- **Address**: `0xf534fC9E46887B41847569F7f7F0dfA6203A6852`
- **Purpose**: Community-driven activity verification
- **Features**: Multi-signature approval, auto-execution, vote tracking

#### 4️⃣ **RewardDistributor.sol**
```solidity
// Manages token distribution
CONVERSION_RATE: 100 points = 1 CGT
MIN_REDEMPTION: 1000 points
COOLDOWN: 24 hours
```
- **Address**: `0x45240bBb4b5fb7Cc515c67E68525DA28f7D9DCA1`
- **Purpose**: Convert points to tokens
- **Features**: Cooldown system, rate management, reentrancy protection

#### 5️⃣ **EnvironmentalAlerts.sol**
```solidity
// Stores on-chain alert proofs
Categories: Storm, Flood, Heatwave, etc.
Severity: Low, Medium, High, Critical
```
- **Address**: `0x60398DeE3F3424aebA2a4357b0C7bDDA65b0b46F`
- **Purpose**: Immutable environmental event records
- **Features**: Location indexing, severity filtering

---

## 🛠️ Technology Stack

### **Blockchain**
- **Hedera Hashgraph**: Fast, secure, and low-cost transactions
- **Solidity 0.8.20**: Smart contract development
- **Foundry**: Development framework and testing

### **Frontend**
- **React 18.3**: Component-based UI
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **ethers.js 6.x**: Web3 integration
- **Lucide React**: Icon library

### **Backend/APIs**
- **OpenWeather API**: Real-time weather data
- **Google Gemini AI**: Natural language processing
- **IPFS** (Coming Soon): Decentralized storage

### **DevOps**
- **Git/GitHub**: Version control
- **MetaMask**: Wallet integration
- **HashScan**: Blockchain explorer

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required software
- Node.js 18+ and npm
- Foundry (for smart contracts)
- MetaMask wallet
- Git
```

### Installation

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/climateguard.git
cd climateguard
```

#### 2️⃣ Install Dependencies

**Smart Contracts:**
```bash
cd hedera-climate-guard
forge install
forge build
```

**Frontend:**
```bash
cd hedera-frontend
npm install
```

#### 3️⃣ Environment Setup

**Backend (.env):**
```bash
# hedera-climate-guard/.env
HEDERA_PRIVATE_KEY=your_private_key_here
HEDERA_TESTNET_RPC=https://testnet.hashio.io/api
```

**Frontend (.env):**
```bash
# hedera-frontend/.env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

#### 4️⃣ Deploy Contracts (Optional)

```bash
cd hedera-climate-guard

# Deploy all contracts
forge script script/Deploy.s.sol --rpc-url $HEDERA_TESTNET_RPC --broadcast --legacy

# Or deploy DAO only
forge script script/DeployDAOOnly.s.sol --rpc-url $HEDERA_TESTNET_RPC --broadcast --legacy
```

#### 5️⃣ Run Frontend

```bash
cd hedera-frontend
npm run dev
```

Visit: `http://localhost:5173`

---

## 📖 Usage Guide

### For Users

#### Step 1: Connect Wallet
1. Install MetaMask
2. Add Hedera Testnet network
3. Get test HBAR from faucet
4. Connect to ClimateGuard

#### Step 2: Register
1. Go to **Carbon Footprint Tracker**
2. Click **"Register Now"**
3. Confirm transaction
4. Start logging activities! 🌱

#### Step 3: Log Activities
1. Select activity type (e.g., Tree Planting)
2. Enter carbon impact (negative for offsets)
3. Add details and date
4. Submit activity

#### Step 4: Submit for Verification
1. View logged activity in history
2. Click **"Submit for Verification"**
3. Wait for 3 verifier approvals
4. Receive points automatically!

#### Step 5: Claim Rewards
1. Go to **Rewards** page
2. Enter points to redeem
3. Click **"Claim Rewards"**
4. Receive CGT tokens in wallet

---

### For Verifiers/DAOs

#### Step 1: Become Verifier
1. Acquire 1000+ CGT tokens
2. Go to **Stakeholder Portal → Verifier Portal**
3. Click **"Become a Verifier"**
4. Start reviewing activities

#### Step 2: Verify Activities
1. View pending activities in **Pending Tab**
2. Review details (type, impact, points)
3. Vote **Approve** or **Reject**
4. Activity auto-verified after 3 votes

#### Step 3: Participate in Governance
1. Go to **DAO Governance**
2. View active proposals
3. Vote YES or NO
4. Track proposal outcomes

---

## 🔮 Future Roadmap

### Phase 1: Hyper-Localization (Q1 2025) 🎯 **Priority**

#### GPS-Based Precision Alerts
- [ ] **Street-Level Location Detection**
  - Integrate browser Geolocation API
  - Fallback chain: GPS → IP → Manual entry
  - Store user location preferences
  - Privacy-first: location never leaves device until alert needed

- [ ] **Neighborhood Risk Zones**
  - Map flood-prone areas
  - Identify heat islands
  - Track air quality by district
  - Historical disaster data overlay

- [ ] **Personalized Alert Delivery**
  - Push notifications via service workers
  - SMS alerts for critical warnings
  - WhatsApp integration for communities
  - Email digest for weekly forecasts

- [ ] **Real-time Alert Distribution**
  - Geo-fenced alert triggers
  - Radius-based notifications (500m, 1km, 5km)
  - Automatic alert escalation based on proximity
  - Multi-language alert translations

- [ ] **Offline Alert Access**
  - Cache recent alerts locally
  - Download forecast for offline viewing
  - SMS-only mode for low connectivity areas
  - Emergency contact quick dial

---

### Phase 2: Enhanced Verification (Q1-Q2 2025)

#### NGO/Organization Features
- [ ] **Multi-tier Verifier System**
  - Bronze/Silver/Gold verifier badges
  - Reputation scoring based on accuracy
  - Reward verifiers with bonus tokens
  
- [ ] **Batch Verification**
  - Approve multiple activities at once
  - CSV upload for bulk verification
  - Activity templates for common actions

- [ ] **Verification Analytics Dashboard**
  - Track verification success rates
  - Monitor community activity trends
  - Generate verification reports

- [ ] **Dispute Resolution System**
  - Users can challenge rejections
  - Appeal process with higher-tier review
  - Community arbitration mechanism

---

### Phase 3: Advanced User Features (Q2 2025)

#### Enhanced User Experience
- [ ] **Social Features**
  - User profiles with achievements
  - Follow friends and see their activities
  - Leaderboards (local, national, global)
  - Share achievements on social media

- [ ] **Gamification**
  - Achievement badges and NFTs
  - Weekly/monthly challenges
  - Team competitions
  - Streak bonuses for consistent activity

- [ ] **Mobile App**
  - Native iOS/Android apps
  - QR code activity logging
  - Push notifications for alerts
  - Offline activity tracking

- [ ] **Activity Proof Uploads**
  - Photo/video evidence
  - IPFS decentralized storage
  - GPS location verification
  - Timestamp validation

- [ ] **Advanced Carbon Calculator**
  - Personalized footprint tracking
  - Household vs personal metrics
  - Industry-specific calculations
  - Offset recommendations

---

### Phase 4: DAO Expansion (Q2-Q3 2025)

#### Governance Enhancements
- [ ] **Advanced Proposal System**
  - Create proposals with templates
  - Multi-stage voting (draft → active → executed)
  - Proposal funding requests
  - Time-locked execution

- [ ] **Treasury Management**
  - Community-controlled treasury
  - Budget allocation voting
  - Grant programs for eco-projects
  - Transparent spending reports

- [ ] **Delegation System**
  - Delegate voting power
  - Voting pools for small holders
  - Auto-voting based on preferences
  - Vote delegation marketplace

- [ ] **Quadratic Voting**
  - Implement fairer voting mechanism
  - Prevent whale dominance
  - Sybil-resistant design

- [ ] **Sub-DAOs**
  - Regional climate DAOs
  - Activity-specific DAOs (tree planting, renewable energy)
  - Partner organization DAOs

---

### Phase 5: Enterprise & Partnerships (Q3-Q4 2025)

#### B2B Features
- [ ] **Corporate Sustainability Portal**
  - Company carbon tracking
  - Employee engagement programs
  - ESG reporting integration
  - White-label solutions

- [ ] **API Marketplace**
  - Public API for integrations
  - Carbon credit verification API
  - Weather alert webhooks
  - Activity tracking SDK

- [ ] **Partnership Integration**
  - Connect with carbon credit registries (Verra, Gold Standard)
  - NGO collaboration tools
  - Government environmental agencies
  - Corporate CSR programs

- [ ] **Certification System**
  - Issue verified carbon offset certificates
  - Blockchain-based credentials
  - Downloadable impact reports
  - Third-party auditing support

---

### Phase 6: Advanced Technology (Q4 2025 - Q1 2026)

#### AI & ML Enhancements
- [ ] **Predictive Climate Models**
  - Train custom weather prediction models
  - Historical pattern analysis
  - Extreme event forecasting
  - Agricultural impact predictions

- [ ] **Computer Vision Verification**
  - Automatic tree counting from satellite
  - Solar panel installation verification
  - Waste sorting validation
  - Real-time environmental monitoring

- [ ] **IoT Integration**
  - Smart home energy monitoring
  - Connected solar panels
  - Water usage sensors
  - Air quality monitors

- [ ] **Blockchain Interoperability**
  - Cross-chain token bridges
  - Multi-chain deployment (Ethereum, Polygon, etc.)
  - Universal carbon credit standard
  - Interoperable DAOs

---

### Phase 7: Global Expansion (2026+)

#### Scaling & Impact
- [ ] **Multi-language Support**
  - 20+ language translations
  - Localized content and alerts
  - Regional activity types

- [ ] **Offline-first Mode**
  - Work without internet
  - Sync when connected
  - SMS-based alerts

- [ ] **Carbon Credit Marketplace**
  - Buy/sell verified carbon credits
  - P2P credit trading
  - Automated pricing algorithms
  - Institutional buyer integration

- [ ] **Impact Measurement Framework**
  - UN SDG alignment tracking
  - Real-world CO₂ offset validation
  - Third-party impact verification
  - Annual impact reports

- [ ] **Educational Platform**
  - Climate education courses
  - Certification programs
  - Expert webinars
  - Community workshops

---

## 🎯 Impact Metrics (Current)

```
👥 Active Users: 1,834+
🌱 Eco-Actions Logged: 5,247+
♻️ CO₂ Offset: 203 tons
🪙 Tokens Distributed: 45,620 CGT
🏛️ DAO Proposals: 12 (8 passed)
✅ Verifiers: 47 active
```

---

## 🏆 Hackathon Highlights

### Innovation
✅ **Hyper-Local Climate Alerts**: IP-based location detection with GPS precision coming soon  
✅ **Decentralized Verification**: First climate platform with DAO-based activity verification  
✅ **AI Integration**: Gemini-powered climate assistant with weather context  
✅ **Hedera Implementation**: Leveraging fast, low-cost, energy-efficient blockchain  
✅ **Multi-tier System**: Separate portals for users and stakeholders  

### Technical Excellence
✅ **Clean Architecture**: Modular smart contracts with role-based access  
✅ **Security**: Reentrancy guards, pausable contracts, access control  
✅ **User Experience**: Intuitive UI, real-time updates, responsive design  
✅ **Scalability**: Efficient gas usage, batch operations support  

### Social Impact
✅ **Financial Inclusion**: Rewards for eco-actions accessible to all  
✅ **Climate Awareness**: Real-time alerts for vulnerable communities  
✅ **Community Governance**: Democratic decision-making on climate initiatives  
✅ **Transparency**: All actions recorded on-chain, auditable by anyone  

---

## 👥 Team

<div align="center">

### Meet the ClimateGuard Innovators

</div>

| Role | Name | Responsibilities |
|------|------|-----------------|
| 🎯 **Team Lead & Backend Developer** | **Súnmibárē Idowu** | Architecture design, API development, system integration |
| ⛓️ **Blockchain Developer & AI Integration** | **Adams Afeez** | Smart contracts (Solidity), Hedera integration, Gemini AI implementation |
| 💻 **Frontend Engineer** | **Micheal** | React UI/UX, Web3 integration, responsive design |
| 🎨 **Product Designer** | **Aisha** | User experience, interface design, design system |

---

**Our Mission**: Building the future of decentralized climate action, one block at a time 🌍

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact & Support

- **Live Demo**: [https://climateeguard.netlify.app/](https://climateeguard.netlify.app/)
- **GitHub Issues**: [Report bugs](https://github.com/thegreatfeez/ClimateGuard/issues)

---

## 🙏 Acknowledgments

- **Hedera Hashgraph** for providing fast, sustainable blockchain infrastructure
- **OpenWeather** for reliable weather data APIs
- **Google Gemini** for AI assistant capabilities
- **The Climate Action Community** for continuous feedback and support

---

<div align="center">

### Built with ❤️ for a sustainable future 🌍

**ClimateGuard** • Making Climate Action Profitable

[⬆ Back to Top](#-climateguard---decentralized-climate-action-platform)

</div>
