---
sidebar_position: 5
---

# Lyfe Price Index

LPI a stablecoin pegged to a basket of real-world consumer items as defined by the US CPI-U average. Using on-chain stability mechanisms, the LPI stablecoin retains its purchasing power based on the CPI basket prices.
The Lyfe Price Index Share (LPIS) token is the governance token of the LPI system, as well as entitled to seigniorage from the protocol. Excess yield will be distributed to LPIS holders. New LPIS may be minted and sold to increase the treasury if the LPI treasury is not producing enough yield to maintain the increased backing per LPI due to inflation.

## Inflation Calculation Method

The LPI relies on the CPI-U unadjusted 12 month inflation rate as reported by the US Federal Government. Through a specialized Chainlink oracle, this information is immediately recorded on-chain upon public release. The reported inflation rate is then utilized in determining the redemption price of LPI stablecoins within the system contract, which experiences continuous growth or occasional deflation. Updates to the peg calculation rate occur every 30 days coinciding with bls.gov's monthly CPI price data releases.




![](https://raw.githubusercontent.com/Lyfebloc/lyfebloc-docs/main/12-month-percentage-chan.png)
