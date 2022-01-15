# Modern Voting Booth

## Project Idea
This project excercise the idea of hosting a modern type of election using a decentralized blockchain.

## Why decentralise?
This way we prevent third-parties from manipulating the election. In addition, the election would be hosted in a safe environment and the result could be easily accessed and verified by every voter or observator.

## Workflow
Each voter can login with Metamask using his personal account and cast a vote to a selected candidate. After the transaction is processed, the results would be visible and updated in real-time.

## Deployed Version URL
TBC

## How to Run This Project Locally
1. To run this project locally, please ensure that you have installed `node` on your machine

2. Please install `metamask` wallet in your Chrome instance

3. Clone the repository and change directory to this repository's root.

4. Run `npm install` to install all dependencies liested in `package.json` file

5. Run local `testnet` in port `8545` wuth an Ethereum client, e.g. Ganache

6. Ensure that tests are passing by running `truffle test`

7. Deploy the smart contracts to the local testnet using `truffle migrate --network development`

8. Lauch the user interface in port 3000 by running `npm run dev`

9. Access the user interface at `http://localhost:3000`

10. Connect your Metamask wallet when prompted

## Directory Structure
* `src` — smart contracts and front-end code
* `migrations` — migration files for deploying contracts
* `test` — tests for smart contracts

## Simple Workflow
1. Login with Metamask
2. Cast a vote
3. Login with Metamask to a different account
4. Cast another vote

## Screencast Link
https://www.loom.com/share/6ec0669e77fc4785aedf56d784eefd02

## TODO
1. Working on adding an admin role that could grant and remove voting rights to specific accounts
2. Move to React
