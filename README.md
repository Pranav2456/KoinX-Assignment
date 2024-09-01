# Ethereum Transaction Tracker Backend

## Overview

This backend application is designed to track Ethereum transactions and provide analytics on user expenses. It fetches transaction data from Etherscan and Ethereum prices from CoinGecko, storing them in a database for efficient querying and analysis.

## Features

- Fetch and store Ethereum transactions for a given address
- Calculate user expenses based on gas fees
- Retrieve current Ethereum price
- RESTful API endpoints for data retrieval
- Automated Ethereum price updates

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB (with Mongoose)
- Jest for testing
- ESLint for linting

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- Etherscan API key
- CoinGecko API access

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Pranav2456/KoinX-Assignment.git
   cd KoinX-Assignment
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ETHERSCAN_API_KEY=your_etherscan_api_key
   COINGECKO_API_URL=api.coingecko.com/api/v3
   ```

4. Build the project:
   ```
   npm run build
   ```

## Running the Application

- For development:
  ```
  npm run dev
  ```

- For production:
  ```
  npm start
  ```

## Scripts

- `npm start`: Runs the compiled application
- `npm run dev`: Runs the application in development mode with hot-reloading
- `npm run build`: Compiles TypeScript to JavaScript
- `npm run lint`: Runs ESLint to check for code style issues
- `npm test`: Runs Jest tests

## API Endpoints

1. Get Transactions
   - Endpoint: `GET /api/transactions/:address`
   - Description: Fetches transactions for a given Ethereum address

2. Get User Expenses
   - Endpoint: `GET /api/expenses/:address`
   - Description: Calculates total expenses (gas fees) for a given Ethereum address

3. Health Check
   - Endpoint: `GET /`
   - Description: Returns the status of the server

## Automated Tasks

The application includes a scheduled task to fetch and store the current Ethereum price at regular intervals.

## Error Handling

Custom error handling middleware is implemented to provide consistent error responses across the application.

## Testing

Jest is used for unit and integration testing. Run tests using:
```
npm test
```
## REST API Documentation
Import [KoinX-Take-Home-Assignment.postman_collection.json](./KoinX-Take-Home-Assignment.postman_collection.json) into [Postman](https://www.postman.com/)