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
git clone https://github.com/your-username/maisha-care.git
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

- VerifiedAddressRegistry: `0x1234...5678`
- RoleManager: `0x2345...6789`
- UpdateApproval: `0x3456...7890`
- MaishaToken: `0x4567...8901`
- PersonalInfo: `0x5678...9012`
- MedicalHistory: `0x6789...0123`
- CurrentHealth: `0x7890...1234`
- TreatmentRecords: `0x8901...2345`
- TemporaryAccess: `0x9012...3456`
- HealthRecordManager: `0x0123...4567`

Note: These are placeholder addresses. Replace them with the actual deployed contract addresses.

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
