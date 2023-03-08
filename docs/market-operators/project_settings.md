---
sidebar_position: 30
---

# Project settings

## Compilation

`yarn c` to compile contracts for all solidity versions.

## Testing with Hardhat
1. If contracts have not been compiled, run `yarn c`. This step can be skipped subsequently.
2. Run `yarn test`

### Example Commands
- `yarn test` (Runs all tests)
- `yarn test test/Pool.spec.ts` (Test only Pool.spec.ts)


## Coverage
`yarn coverage` (Runs coverage for all applicable files)

## Echidna
`docker-compose up -d` (Runs a new echidna-test container)

`docker exec -it elastic-echidna bash` (Accesses to the container)

- `./echidna.sh` (Runs echidna-test for all contracts)
- `echidna-test . --contract {{Contract Name}} --config echidna.config.yml --test-mode assertion` (Runs echidna-test for each contract)

## Deploy
`npx hardhat deployTokenPositionDescriptor --input xxx --network nnn` to deploy token descriptor proxy + implementation contracts.
- Example: `npx hardhat deployTokenPositionDescriptor --input mainnet.json --network mainnet`

`npx hardhat deployElastic --input xxx --gasprice ggg --network nnn` to deploy all contracts.
- Example: `npx hardhat deployElastic --input mainnet.json --gasprice 5 --network mainnet`

