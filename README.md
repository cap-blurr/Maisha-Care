# Maisha Care

# Maisha-Care: Blockchain-Powered Electronic Health Record System

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
   - [Client Setup](#client-setup)
   - [Backend Setup](#backend-setup)
4. [Running the Application](#running-the-application)
5. [Smart Contract Addresses](#smart-contract-addresses)
6. [Project Structure](#project-structure)
7. [License](#license)

## Project Overview

Maisha-Care is a decentralized application (dApp) for healthcare data management. The system allows:
- Patients to securely store and control access to their health records
- Doctors to view and update patient records with proper authorization
- Secure storage and retrieval of anonymized health data

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm or pnpm
- Git

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/cap-blurr/Maisha-Care.git
cd maisha-care
```

### Step 2: Client Setup

1. Open a terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   # or if you're using pnpm
   pnpm install
   ```

### Step 3: Backend Setup

1. Open a new terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the necessary packages:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Go to the [Pinata website](https://www.pinata.cloud/) and sign up for an account
   - Retrieve your API keys
   - Create a `.env` file in the backend directory and add the following:
     ```
     JWT=your_pinata_jwt_token
     PINATA_API_KEY=your_pinata_api_key
     PINATA_GATEWAY=your_pinata_gateway
     ```

## Running the Application

### Step 1: Start the Backend Server

1. In the backend terminal, run:
   ```bash
   npm start
   ```
   This will start the backend server.

### Step 2: Run the Client Frontend

1. In the client terminal, run:
   ```bash
   npm run dev
   # or if you're using pnpm
   pnpm run dev
   ```

2. Open your browser and navigate to the localhost link provided in the terminal (usually `http://localhost:3000`)

You should now be able to use the Maisha-Care application normally.

## Smart Contract Addresses

Here are the addresses for the deployed smart contracts:

  Deployed contract addresses
  - VerifiedAddressRegistry deployed to: 0x0FeF1C3Fa2c01E512939fbD2b8069Ed97fc9fe91   
  - RoleManager deployed to: 0xf29F5ba6f29F885008680D1B866bcA6102D5da60
  - UpdateApproval deployed to: 0x0F1b14764bFE8C67158F5Be10EdC1Eee212382EC
  - MaishaToken deployed to: 0xe3fEd9dF9a71b75E6a59cDAEFb0d5e47902C4bfb
  - MedicalRecords deployed to: 0xfb8B4e4b84F472306B64d16Abcc8dA9d946AeFDE
  - TemporaryAccess deployed to: 0xFceb81c34E9685365fCAf7dE493B7d6F09E42D4e
  - HealthRecordManager deployed to: 0x7a473659CE83D536C282F308C4deA4E897B12E1d 

## Project Structure

```
maisha-care/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   └── package.json
├── contracts/
│   ├── src/
│   └── lib/
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
