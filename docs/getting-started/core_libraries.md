---
sidebar_position: 30
---

# Periphery Base Contracts

## DeadlineValidation
Validate if the block timestamp has not reached the deadline yet, use for transactions with a de

### Modifier: `onlyNotExpired()`
Reverts if the current block's timestamp is greater than the specified `deadline`.

| Field | Type | Explanation |
| ----- | ---- | ----------- |
| `deadline` | `uint256` | Timestamp to check against current block's timestamp|


### `_blockTimestamp()`
Returns the current block timestamp. Used for overriding by mock contracts for tests.

---

## ERC721Permit
Nonfungible tokens that support an approve via signature, i.e. permit for ERC721.


---

## ImmutableRouterStorage
Immutable variables that are used by Periphery contracts.

### Immutables
| Field | Type | Explanation |
| -------- | -------- |  -------- |
| `factory` | `address` | [Factory](#Factory) contract address |
| `WETH` | `address` | Canonical WETH address |
| `poolInitHash` | `bytes32` | keccak256 hash of the pool's creation code. Used to compute the p
without reading storage from the [Factory](#Factory) |


## RouterTokenHelper
A helper contract to handle transfers, wrapping and unwrapping of tokens.

### `unwrapWeth()`
Unwraps the contract's entire **WETH** balance to **ETH**, then transfers them to the recipient.

| Input Field | Type | Explanation |
| -------- | -------- |  -------- |
| `minAmount` | `uint256` | Contract's WETH balance should not be lower than this amount |
| `recioient` | `address` | Desired recipient of unwrapped ETH |


### `transferAllTokens()`
Transfers the contract's entire `token` balance to the recipient

| Input Field | Type | Explanation |
| -------- | -------- |  -------- |
| `token` | `address` | Token to transfer |
| `minAmount` | `uint256` | Contract's token balance should not be lower than this amount |
| `recipient` | `address` | Desired recipient of the token |


### `refundEth()`
Transfers all **ETH** balance to the sender.

### `_transferTokens()`
Internal function to help transfer tokens from the `sender` to the `recipient`. If `token` is **
contract has enough **ETH** balance, then wrap and transfer **WETH**, otherwise use [TokenHelper
transfers.

| Input Field | Type | Explanation |
| -------- | -------- |  -------- |
| `token` | `address` | Token to transfer |
| `sender` | `address` | Address to pull `token` funds from |
| `recipient` | `address` | Desired recipient of the token |
| `amount` | `uint256` | Amount to be transferred |

---

## RouterTokenHelperWithFee
Inherits [RouteTokenHelper](#RouterTokenHelper). Contains additional functions to charge a fee f
well.

### `unwrapWethWithFee()`
Unwraps the contract's entire **WETH** balance to **ETH**, then transfers them to the `recipient
fee which is transferred to `feeRecipient`

| Input Field | Type | Explanation |
| -------- | -------- |  -------- |
| `minAmount` | `uint256` | Contract's WETH balance should not be lower than this amount |
| `recipient` | `address` | Desired recipient of unwrapped ETH |
| `feeBps` | `uint256` | Fee to charge in basis points |
| `feeRecipient` | `address` | Address to receive the fee charged |

### `transferAllTokensWithFee()`

Transfers the contract's entire `token` balance to the recipient. Charges a fee which is transfe
`feeRecipient`.

| Input Field | Type | Explanation |
| -------- | -------- |  -------- |
| `token` | `address` | Token to transfer |
| `minAmount` | `uint256` | Contract's token balance should not be lower than this amount |
| `recipient` | `address` | Desired recipient of the token |
| `feeBps` | `uint256` | Fee to charge in basis points |
| `feeRecipient` | `address` | Address to receive the fee charged |

---

## Multicall
Enables calling multiple methods in a single call to the contract.

### `multicall()`
Uses **`delegateCall`** to sequentially execute functions, then return the result of each execut

#### Input
| Field | Type | Explanation |
| -------- | -------- |  -------- |
| `data` | `bytes[]` | encoded function data for each of the calls to make to this contract |

#### Output
| Field | Type | Explanation |
| -------- | -------- |  -------- |
| `results` | `bytes[]` | results from each of the calls passed in |

---

## LiquidityHelper
A helper contract to handle liquidity related actions, including mint/add/remove liquidity.

### Struct: AddLiquidityParams
Used when minting a new position or adding liquidity to an existing one.

| Field | Type | Explanation |
| -------- | -------- | -------- |
| `token0` | `address` | first token of the pool |
| `token1` | `address` | second token of the pool |
| `fee` | `uint16` | the pool's swap fee |
| `tickLower` | `int24` | position's lower tick |
| `tickUpper` | `int24` | position's upper tick |
| `ticksPrevious` | `int24[2]` | an array containing 2 values `tickLowerPrevious` and `tickUpper
are expected to be the nearest initialized tick <= `tickLower` and `tickUpper` respectively |
| `amount0Desired` | `uint256` | token0 amount user wants to add |
| `amount1Desired` | `uint256` | token1 amount user wants to add |
| `amount0Desired` | `uint256` | minimum token0 amount that should be used |
| `amount1Desired` | `uint256` | minimum token1 amount that should be used |


### Struct: CallbackData
Data for callback from Pool contract.

| Field | Type | Explanation |
| -------- | -------- | -------- |
| `token0` | `address` | first token of the pool |
| `token1` | `address` | second token of the pool |
| `fee` | `uint16` | the pool's swap fee |
| `source` | `address` | address to transfer token0/token1 from |

### `proAMMMintCallback()`
Mint callback function implementation called by a [Pool](#Pool).

| Input Field | Type | Explanation |
| -------- | -------- | -------- |
| `deltaQty0` | `uint256` | token0 amount requested by the pool |
| `deltaQty1` | `uint256` | token1 amount requested by the pool |
| `data` | `bytes` | Encoded `CallbackData` |

### `_addLiquidity()`
Add liquidity to a pool. *token0* and *token1* should be in the correct order, i.e *token0 < tok

#### Input
| Type | Explanation |
| -------- | -------- |
| [`AddLiquidityParams`](#Struct-AddLiquidityParams) | Parameters for addiing liquidity to a poo

#### Output
| Field | Type | Explanation |
| -------- | -------- | ------- |
| `liquidity` | `uint128` | amount of liquidity added |
| `amount0` | `uint256` | amount of token0 required |
| `amount1` | `uint256` | amount of token1 required |
| `feeGrowthInsideLast` | `uint256` | latest feeGrowthInsideLast calculated by the pool |
| `pool` | `IProAMMPool` | pool address |

### `_callbackData()`
Function to encode input parameters to [CallbackData](#Struct-CallbackData)

| Input Field | Type | Explanation |
| -------- | -------- | -------- |
| `token0` | `address` | first token of the pool |
| `token1` | `address` | second token of the pool |
| `fee` | `uint16` | the pool's swap fee |

### `_getPool()`
Function for computing the pool address with the given input parameters.

| Input Field | Type | Explanation |
| -------- | -------- | -------- |
| `token0` | `address` | first token of the pool |
| `token1` | `address` | second token of the pool |
| `fee` | `uint16` | the pool's swap fee |
