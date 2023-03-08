---
sidebar_position: 1
---

# AntiSniping Attack

New AMM, which compounds different positions such as Uniswap v3, provides tools for liquidity providers to add and remove liquidity easily in specific ranges. The feature leads to a novel attack, called sniping, where the attacker tries to jump in front of normal liquidity providers by adding and removing liquidity just before and right after a huge swap.

We have collected some data to show the impact of the attack.

The sandwich attack can be effectively restrained on the taker's side thanks to parameters limiting how much slippage can be tolerated. However, there is no similar anti-sniping attack mechanism for liquidity providers. Hence, the protocol should introduce a feature that protects liquidity providers from this type of attack.

`Lyfebloc Automatic Anti-Sniping Feature`  is introduced as a lock of reward, which is vested based on the duration of liquidity contribution. The principal difference between attacks and normal activities of liquidity providers is their contributing duration. When liquidity providers supply their funds to the protocol, they take the risk of impermanent loss. However, in the case of an attacker who withdraws their fund immediately, the impermanent loss can be pre-calculated so that their profit is guaranteed.

![](https://raw.githubusercontent.com/Lyfebloc/lyfebloc-docs/main/wed.jpg)

![](https://raw.githubusercontent.com/Lyfebloc/lyfebloc-docs/main/wer.jpg)
