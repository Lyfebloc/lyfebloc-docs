---
sidebar_position: 1
---

# Appendix

## Appendix A: Range Mechanism

### Objective

The goal is to accurately account a position's accured fees accured and duration for which it is active. A
position is defined to be active if the current pool tick lies within the lower and upper ticks of the position.

### Global value

The `feeGrowthGlobal` and `secondsPerLiquidityGlobal` variables represent the total amount for 1 unit of
unbounded liquidity.
![](https://i.imgur.com/DoPB569.png)

### Outside value

The outside value (`feeGrowthOutside` and `secondsPerLiquidityOutside`) for a tick represents the accumulated
value relative to the currentTick. By definition, we can visually represent it to be as such:

- tick <= currentTick ![](https://i.imgur.com/IW8y1Gd.png)
- tick > currentTick ![](https://i.imgur.com/X0uXxvB.png)

#### Initialization

When a tick is initialized, all growth is assumed to happen below it. Hence, the outside value is initialized
to the following values under these cases:

- tick <= currentTick: `outside value := global value`
- tick > currentTick: `outside value := 0`

### Crossing ticks

Due to the definition of the outside value, a tick's outside value is reversed whenever the pool tick crosses
it. Specifically, `outside value := global value - outside value`.

#### Note

When swapping downtick, the current tick is further decremented by 1. This is to ensure a tick's outside value
is interpreted correctly.
`swapData.currentTick = willUpTick ? tempNextTick : tempNextTick - 1;`

### Calculating value inside ticks

The current tick can be

1. below a position (currentTick < lowerTick)
![](https://i.imgur.com/s3jWPgr.png)
The value inside can therefore be calculated as `tickLower's outside value - tickUpper's outside value`
2. within a position (lowerTick <= currentTick < upperTick)
![](https://i.imgur.com/pO9HPYb.png)
The value inside can therefore be calculated as `global value - (lower + upper tick's outside values)`
3. above a position (upperTick <= currentTick)
![](https://i.imgur.com/Yi8iwu0.png)
The value inside can therefore be calculated as `tickUpper's outside value - tickLower's outside value`

## Appendix B: Tick-range Mechanism

- To represent liquidity mapping, LyfeblocDMM uses linked list, the linked list always starts by MIN_TICK and
ends by MAX_TICK.

- The pool also need to track to the highest initialized tick which is lower than or equal to currentTick (aka
`nearestCurrentTick`).

For example:

- the pool is initalized at tick 5, the linked list will be `[MIN_TICK, MAX_TICK]` and`nearestCurrentTick` will
be MIN_TICK.
- A adds liquidity at tick `[-5, 10]`,  the linked list will be `[MIN_TICK, -5, 10, MAX_TICK]` and
`nearestCurrentTick` will be -5.
- C adds liquidity at tick `[0, 100]`, the linked list will be `[MIN_TICK, -5, 0, 10, 100, MAX_TICK]` and
`nearestCurrentTick` will be 0.
- B swaps and currentTick = 15, then  `nearestCurrentTick` will be 10
- A remove all liquidity at tick `[-5, 10]`, the linked list will be `[MIN_TICK, 0, 100, MAX_TICK]`
and`nearestCurrentTick` will be 0.

## Appendix C: Reinvest Mechanism

LyfeblocDMM does not take fee in forms of token0 and token1, the fee will be both tokens and reinvested into
tick range from [0, infinity]

- `baseL` is the liquidity from lp provider and `reinvestL` is the liquidity from the fee
- User can still earn fee from `reinvestL`, so we create **reinvestment token** to represent the proportion of
user in `reinvestL`.
- Each time, users add/remove liquidity or cross a tick, we have to mint the reinvestment token equavalent to
the increment of `reinvestL` by `baseL`. The formula to calculate mintQty is at `ReinvestmentMath.calcrMintQty
- reinvestment token: after London hardfork, it is [costly](https://hackmd.io/@fvictorio/
gas-costs-after-berlin) to warm up another contract. Therfore, we decided to merge the reinvestment token and
pool contract and the pool contract will be inherited from ERC20.
