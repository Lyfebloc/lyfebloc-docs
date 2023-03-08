---
sidebar_position: 2
---
# Periphery Libraries Contracts

## AntiSnippingAttack

The motivation and explanation of the mechanism can be found [here](https://docs.google.com/document/d/1F50RWQRRyaNxnW5RvKgw09fN2FofIVLVccijgcOt-Iw/edit#heading=h.trv8zmis8u4c). The function
containing the bulk of the logic is [`update()`](#update).

### Struct: Data
| Field | Type | Formula Variable | Explanation |
| ----- | ---- | ----------- | ------------ |
| `lastActionTime` | `uint32` | $t_{last}$ | timestamp of last action performed |
| `lockTime`     | `uint32` | $t_{lock}$ | average start time of lock schedule |
| `unlockTime`     | `uint32` | $t_{unlock}$ | average unlock time of locked fees |
| `feesLocked`     | `uint32` | $fee_{locked}$ | locked rToken qty since last update |

### `initialize()`
Initializes [Data](#Struct-Data1) values for a new position. The time variables are set to the current timestamp, while `feesLocked` is set to zero.

### `update()`
Updates [Data](#Struct-Data1) values for an existing position. Calculates the amount of claimable reinvestment tokens to be sent to the user and, in the case of liquidity removal, the amount of
burnable reinvestment tokens as well.

#### Formula
$claimBps_{new} = min(BPS, \frac{t_{now}-t_{lock}}{t_{target}})$
$claimBps_{current} = min(BPS, \frac{t_{now}-t_{last}}{t_{unlock} - t_{target}})$ if $t_{unlock} > t_{target}$, $BPS$ otherwise
$fee_{harvest}$ and $fee_{lock}$ updated through [`calcFeeProportions()`](#calcFeeProportions)
$t_{unlock} = \frac{(t_{lock} + t_{target}) * (BPS - claimBps_{new}) * fee_{collect} + t_{unlock} * (BPS - claimBps_{current}) * fee_{locked}}{fee_{lock} * BPS}$
- If adding liquidity, update $t_{lock} = ceil(\frac{max(t_{lock}, t_{now} - t_{target})*L + t_{now} * \Delta{L}}{L + \Delta{L}})$
- If removing liquidity,
    - $fee_{burn} = fee_{harvest} * \frac{\Delta{L}}{L}$
    - $fee_{harvest}$ -= $fee_{burn}$

#### Input
| Field | Type | Formula Variable | Explanation |
| ----- | ---- | ----------- | ------------ |
| `self` | [`Data`](#Struct-Data1) | N.A. | stored data values for an existing position |
| `currentLiquidity`| `uint128` | $L$ | current position liquidity |
| `liquidityDelta`| `uint128` | $\Delta{L}$ | quantity change to be applied |
| `currentTime` | `uint32` | $t_{now}$ | current block timestamp |
| `isAddLiquidity` | `bool` | N.A. | true = add liquidity, false = remove liquidity |
| `feesSinceLastAction` | `uint256` | $fee_{collect}$ | fees accrued since last action |
| `vestingPeriod` | `uint256` | $t_{target}$ | maximum time duration for which LP fees are proportionally burnt upon LP removals |

#### Output
| Field | Type | Formula Variable | Explanation |
| ----- | ---- | ----------- | ------------ |
| `feesClaimable` | `uint256` | $fee_{harvest}$ | claimable reinvestment token amount  |
| `feesBurnable` | `uint256` | $fee_{burn}$ | reinvestment token amount to burn |

### `calcFeeProportions()`
Calculates the proportion of locked fees and claimable fees given the fee amounts and claimable fee basis points.

#### Formula
$fee_{harvest} = \frac{claimBps_{current}}{BPS} * fee_{locked} + \frac{claimBps_{new}}{BPS} * fee_{collect}$
$fee_{lock} = fee_{locked} + fee_{collect} - fee_{harvest}$

#### Input

| Field | Type | Formula Variable | Explanation |
| ----- | ---- | ----------- | ------------ |
| `currentFees` | `uint256` | $fee_{locked}$ | currently locked fees |
| `nextFees` | `uint256` | $fee_{collect}$ | fees since last action |
| `currentClaimableBps` | `uint256` | $claimBps_{current}$ | proportion of claimable / unlocked `currentFees` in basis points|
| `nextClaimableBps` | `uint256` | $claimBps_{new}$ | proportion of claimable `nextFees` in basis points |

#### Output

| Field | Type | Formula Variable | Explanation |
| ----- | ---- | ----------- | ------------ |
| `feesLockedNew` | `uint256` | $fee_{lock}$ | new fee amount to be locked |
| `feesClaimable` | `uint256` | $fee_{harvest}$ | claimable fees to be sent to user |



---

## BytesLib

Solidity Bytes Arrays Utils @author Gonçalo Sá <goncalo.sa@consensys.net>
Bytes tightly packed arrays utility library for ethereum contracts written in Solidity. The library lets you slice and type cast bytes arrays both in memory and storage.

---

## LiquidityMath

Contract to calculate the expected amount of **liquidity** given the amounts of tokens.

### `getLiquidityFromQty0()`
    Params:
        uint160 lowerSqrtP     // a lower sqrt price of the position
        uint160 upperSqrtP     // a upper sqrt price of the position
        uint256 qty0           // the amount of token0 to add
    Returns:
        uint128 liquidity       // amount of liquidity to receive

Get liquidity from **qty0** of the first token given the price range.

### `getLiquidityFromQty1()`
    Params:
        uint160 lowerSqrtP     // a lower sqrt price of the position
        uint160 upperSqrtP     // a upper sqrt price of the position
        uint256 qty1           // the amount of token1 to add
    Returns:
        uint128 liquidity       // amount of liquidity to receive

Get liquidity from **qty1** of the second token given the price range.


### `getLiquidityFromQties()`
    Params:
        uint160 currentSqrtP    // the current price, e.g the pool's current price
        uint160 lowerSqrtP      // a lower sqrt price of the position
        uint160 upperSqrtP      // a upper sqrt price of the position
        uint256 qty0            // the amount of token0 to add
        uint256 qty1            // the amount of token1 to add
    Returns:
        uint128 liquidity       // amount of liquidity to receive

Get liquidity given the price range and amounts of 2 tokens

---

## PathHelper

Functions for manipulating path data for multihop swaps

### Variables
    ADDR_SIZE = 20 // length of the address, i.e 20 bytes
    FEE_SIZE = 2 // length of the fee, i.e 2 bytes
    TOKEN_AND_POOL_OFFSET = ADDR_SIZE + FEE_SIZE// the offset of a single token address + pool fee
    POOL_DATA_OFFSET = TOKEN_AND_POOL_OFFSET + ADDR_SIZE // the offset of 2 token addresses + pool fee
    MULTIPLE_POOLS_MIN_LENGTH = POOL_DATA_OFFSET + TOKEN_AND_POOL_OFFSET // min length that contains at least 2 pools

### `hasMultiplePools()`
    Params:
        bytes path
    Returns:
        bool

Return true if the path contains 2 or more pools, false otherwise

### `numPools()`
    Params:
        bytes path
    Returns:
        uint256

Returns the number of pools in the path.

### `decodeFirstPool()`
    Params:
        bytes path
    Returns:
        address tokenA
        address tokenB
        uint16 fee

Return the first pool's data from the **path**, including **tokenA**, **tokenB** and **fee**.

### `getFirstPool()`
    Params:
        bytes path
    Returns:
        bytes data

Return the segment corresponding to the first pool in the path.

### `skipToken()`
    Params:
        bytes path
    Returns:
        bytes newPath

Skip a token + fee from the buffer and returns the remainder.

---

## PoolAddress

Provides a function for deriving a pool address from the factory, tokens, and swap fee

### `computeAddress()`
    Params:
        address factory   // DMMv2 factory contract
        address token0    // the first token of the pool
        address token1    // the second token of the pool
        uint16 swapFee    // the fee of the pool
        bytes32 poolInitHash    // the keccake256 hash of the Pool creation code
    Returns:
        address pool    // the pool address

Deterministically computes the pool address from the given data.

---

## PoolTicksCounter

### `countInitializedTicksCrossed()`
    Params:
        IProAMMPool
        int24 nearestCurrentTickBefore
        int24 nearestCurrentTickAfter
    Returns:
        uint32 initializedTicksCrossed

Count the number of initialized ticks have been crossed given the previous/current nearest initialized ticks to the current tick.

---

## TokenHelper

A helper contract to transfer token/ETH.

### `transferToken()`
    Params:
        IERC20 token
        uint256 amount
        address sender
        address receiver

Transfer an **amount** of ERC20 **token** from the **sender** to the **receiver**.


#### `transferEth()`
    Params:
        uint256 amount
        address receiver

Transfer an **amount** of ETH to the **receiver**.

---
