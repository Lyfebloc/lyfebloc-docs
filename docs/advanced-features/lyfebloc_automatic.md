---
sidebar_position: 40
---

# Lyfebloc Automatic Walkthrough

## Concentrated liquidity

A tick is the price that is equal to the power of 1.0001

![](https://raw.githubusercontent.com/Lyfebloc/lyfebloc-docs/main/2d.jpg)

## Compounding fee

In Standard AMM protocols, the fees are taken in the form of token0 & token1 separately, which do not contribute to the pool's liquidity. This limit makes all other market makers not directly compoundable inside the protocol. However, the Lyfebloc Automatic protocol inherits the liquidity concentration of all pools and achieves customizability of automatic market making while preserving the compounding feature. Eventually, the protocol places the collected fees into a reinvestment curve, which is aggregated with the pool.

The reinvestment curve is a compoundable constant product curve that supports the price range from 0 to infinity. The reinvestment curve is aggregated with the pool so that they maintain a common price while behaving differently. Price ranges of the pool have different amounts of liquidity, which are not affected by exchange activities. Meanwhile, the reinvestment curve's liquidity remains the same on all ticks and increases based on the accumulating fee after each swap.

## Reinvestment curve

![](https://raw.githubusercontent.com/Lyfebloc/lyfebloc-docs/main/ree.png)

![](https://raw.githubusercontent.com/Lyfebloc/lyfebloc-docs/main/21.png)

![](https://raw.githubusercontent.com/Lyfebloc/lyfebloc-docs/main/22.png)


## Pool Unlocking / Initialization

Overview

No action (minting / burning / swaps) can be performed prior to pool initialization.

In addition to setting the initial sqrt price, a small amount of token0 and token1 is required to be seeded for the initialization of `reinvestL` to the value of `MIN_LIQUIDITY`. This is required to prevent division by zero in the `calcRMintQty()` function when swaps are performed.

`MIN_LIQUIDITY` was chosen to be reasonably small enough to avoid calculation inaccuracies for swaps, and from taking unreasonably large capital amounts from the caller.
