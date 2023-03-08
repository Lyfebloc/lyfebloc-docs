---
sidebar_position: 2
---

# Core Contracts

## Factory
Handles deployment of LyfeblocDMM v2 pools and where administrative configurations are held, such as the
whitelisting of NFT position managers, and government fee settings.

### `parameters`
Used by the Pool's constructor to fetch the parameters. The reason why they are not passed directly is for the
automatic contract verification on Etherscan.

| Field | Type | Explanation |
| ----- | ---- | ----------- |
| `factory` | `address` | this contract's address |
| `token0` | `address` | first pool token by address sort order|
| `token1` | `address` | second pool token by address sort order |
| `swapFeeBps` | `uint16` | fee to be collected upon every swap in the pool, in basis points |
| `_tickDistance` | `int24` | Minimum number of ticks between initialized ticks |

### `poolInitHash`
| Type | Explanation |
| ---- | ----------- |
| `bytes32` | keccak256 hash of the pool's creation code. This is accessed by periphery contracts for the
deterministic computation of a pool's address |

### `configMaster`
| Type | Explanation |
| ---- | ----------- |
| `address` | The address that is able to modify different settings and parameters |

### `whitelistDisabled`
| Type | Explanation |
| ---- | ----------- |
| `bool` | If true, anyone can directly mint liquidity from the pool. Otherwise, only whitelisted addresses are
able to do so |

### `vestingPeriod`
| Type | Explanation |
| ---- | ----------- |
| `uint32` | The maximum time duration for which LP fees are proportionally burnt upon LP removals |

### `feeAmountTickDistance()`
Returns the tick distance for a specified fee. Once added, cannot be updated or removed.

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| Input, `swapFeeBps` | `uint16` | swap fee, in basis points |
| Output | `int24` | configured tick distance |

### `feeConfiguration()`
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `_feeTo` | `address` | recipient of government fees|
| `_governmentFeeBps` | `uint16` | current government fee charged in basis points. Taken out of swap fee |


### `getPool()`
Returns the pool address for a given pair of tokens and a swap fee. Note that the token order does not matter.

#### Input
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `tokenA` | `address` | contract address of either token0 or token1 |
| `tokenB` | `address` | contract address of the other token |
| `swapFeeBps` | `uint16` | swap fee, in basis points |


#### Output
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `pool` | `address` | The pool address. Returns null address if it does not exist |

### `createPool()`
Creates a pool for the given two tokens and fee. The token order does not matter.

The call reverts under the following conditions:
1. Pool already exists
2. Invalid swap fee (tickDistance is zero)
3. Invalid token arguments

#### Input

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `tokenA` | `address` | contract address of either token0 or token1 |
| `tokenB` | `address` | contract address of the other token |
| `swapFeeBps` | `uint16` | swap fee, in basis points |

#### Output
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `pool` | `address` | created pool address |

### `isWhitelistedNFTManager()`
Checks if an address is a whitelisted NFT manager. Returns true if it is, false if it is not.

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `sender` | `address` | address to be checked |

### `getWhitelistedNFTManagers()`
Returns an array of addresses of all whitelisted NFT managers.

### `updateConfigMaster()`
To update the address of [`configMaster`](#configMaster). Can only be changed by `configMaster`.

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `_configMaster` | `address` | new config master address |

### `enableWhitelist()`
Sets [`whitelistDisabled`](#whitelistDisabled) to false, meaning, only whitelisted addresses are able to call
the Pool's mint method. Can only be called by `configMaster`.

### `disableWhitelist()`
Sets [`whitelistDisabled`](#whitelistDisabled) to true. Will allow anyone to call the Pool's mint method. Can
only be called by `configMaster`.

### `addNFTManager()`
Whitelists an NFT manager. Returns true if addition was successful, that is if it was not already present. Can
only be called by `configMaster`.

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `_nftManager` | `address` | address to be whitelisted |

### `removeNFTManager()`
Removes a whitelisted NFT manager. Returns true if removal was successful, that is if it was not already
present. Can only be called by `configMaster`.

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `_nftManager` | `address` | whitelisted address to be removed |

### `updateVestingPeriod()`
Updates the value of [`vestingPeriod`](#vestingPeriod). Can only be called by `configMaster`.

### `enableSwapFee()`
Enables a fee amount with the given tickDistance. The value cannot be updated or removed after setting. Can
only be called by `configMaster`.
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `swapFeeBps` | `uint16` | swap fee, in basis points |
| `tickDistance` | `int24` | desired tick distance |

### `updateFeeConfiguration()`
Updates the address receiving government fees and government fee to be charged (taken out of swap fee).
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `feeTo` | `address` | recipient of government fees|
| `governmentFeeBps` | `uint16` | government fee charged in basis points |

---

## Pool
Primarily contains the implementation of actionable items by users, such as adding or removing liquidity,
executing swaps or flash loans, and burning reinvestment tokens in exchange for fees collected.



### `unlockPool()`
Provides initial liquidity and sets initial price for the pool. All other actions cannot be performed prior to
the execution of this function.

Note that this function should also be called at most once.

#### Input

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `initialSqrtP` | `uint160` | Initial sqrt price, multiplied by $2^{96}$ |
| `data` | `bytes` | Data, if any, to be passed into the callback function |

#### Output
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `qty0` | `uint256` | token0 quantity permanently locked in the pool |
| `qty1` | `uint256` | token1 quantity permanently locked in the pool |

### `mint()`
Adds liquidity to a specified recipient/tickLower/tickUpper position. Any token0 or token1 owed for the
liquidity provision have to be paid for in the callback function.

Also sends reinvestment tokens (fees) to the recipient for any fees collected by the position. Reinvestment
tokens have to be burnt via [burnRTokens](#burnRTokens) in exchange for token0 and token1.

#### Input

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `recipient` | `address` | address for which the added liquidity is credited to. Equivalent to position owner |
| `tickLower` | `int24` | position's lower tick |
| `tickUpper` | `int24` | position's upper tick |
| `ticksPrevious` | `int24[2]` | an array containing 2 values `tickLowerPrevious` and `tickUpperPrevious` which
are expected to be the nearest initialized tick <= `tickLower` and `tickUpper` respectively |
| `qty` | `uint128` | Liquidity quantity to mint |
| `data` | `bytes` | Data, if any, to be passed into the callback function |

#### Output

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `qty0` | `uint256` | token0 quantity sent to the pool in exchange for specified liquidity quantity |
| `qty1` | `uint256` | token1 quantity sent to the pool in exchange for specified liquidity quantity |
| `feeGrowthInside` | `uint256` | position's updated feeGrowthInside value |


### `burn()`
Removes liquidity from the caller. In other words, the caller is treated as the position owner.

Also sends reinvestment tokens (fees) to the caller for any fees collected by the position. Reinvestment tokens
have to be burnt via [burnRTokens](#burnRTokens) in exchange for token0 and token1.

#### Input

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `tickLower` | `int24` | position's lower tick |
| `tickUpper` | `int24` | position's upper tick |
| `qty` | `uint128` | Liquidity quantity to burn |

#### Output

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `qty0` | `uint256` | token0 quantity sent to the caller |
| `qty1` | `uint256` | token1 quantity sent to the caller |
| `feeGrowthInside` | `uint256` | position's updated feeGrowthInside value |

### `burnRTokens()`
Burns reinvestment tokens in exchange to receive the fees collected in token0 and token1.

#### Input

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `qty` | `uint256` | Reinvestment token quantity to burn |
| `bool` | `isLogicalBurn` | `false` = burning tokens without receiving any fees in exchange. `true` = fees
should be calculated and sent |

The use-case for burning tokens whilst leaving the collected fees in the pool is the anti-snipping attack
mechanism.

#### Output

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `qty0` | `uint256` | token0 quantity sent to the caller |
| `qty1` | `uint256` | token1 quantity sent to the caller |


### `swap()`
Swap token0 -> token1, or vice versa. Note that swaps will either fully use up the specified swap quantity, or
swap up to the specified price limit, depending on whichever condition is satisfied first.

#### Input

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `recipient` | `address` | address to receive the swap output |
| `swapQty` | `int256` | swap quantity, which implicitly configures the swap as exact input (>0), or exact
output (<0) |
| `isToken0` | `bool` | whether the swapQty is specified in token0 (true) or token1 (false) |
| `limitSqrtP` | `uint160` | sqrt price limit to reach |
| `data` | `bytes` | Data, if any, to be passed into the callback function |

##### Note
To specify an unlimited price limit for a swap, use the following values.

| `isToken0` | `swapQty` | Value |
| ---- | ----------- | ------ |
| `true` | > 0 | `MIN_SQRT_RATIO + 1` |
| `true` | < 0 | `MAX_SQRT_RATIO - 1` |
| `false` | > 0 | `MAX_SQRT_RATIO - 1` |
| `false` | < 0 | `MIN_SQRT_RATIO + 1` |

#### Output

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `qty0` | `int256` | exact token0 qty sent to recipient if < 0. Minimally received quantity if > 0 |
| `qty1` | `int256` | exact token1 qty sent to recipient if < 0. Minimally received quantity if > 0 |

### `flash()`
Request for token0 and/or token1 and pay it back in the same transaction, plus a fee, in the callback. Fees
collected are distributed to all rToken holders since no rTokens are minted from it.

#### Input

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `recipient` | `address` | address which will receive the token0 and token1 quantities |
| `qty0` | `uint256` | token0 quantity to be loaned to the recipient |
| `qty1` | `uint256` | token1 quantity to be loaned to the recipient |
| `data` | `bytes` | Data, if any, to be passed into the callback function |

---

## PoolStorage
Contains all variables and getter methods to be used by the Pool contract. Inherited by [PoolTickState]
(#PoolTicksState).

### `factory`
| Type | Explanation |
| ---- | ----------- |
| `IFactory` | Canonical factory address fetched upon pool creation |

### `token0`
| Type | Explanation |
| ---- | ----------- |
| `IERC20` | First of the two tokens of the pool, sorted by address |

### `token1`
| Type | Explanation |
| ---- | ----------- |
| `IERC20` | Second of the two tokens of the pool, sorted by address |

### `maxTickLiquidity`
| Type | Explanation |
| ---- | ----------- |
| `uint128` | Maximum gross liquidity that an initialized tick can have. This is to prevent overflow the pool's
active base liquidity (uint128) |

### `swapFeeBps`
| Type | Explanation |
| ---- | ----------- |
| `uint16` | fee to be charged for a swap in basis points |

### `tickDistance`
| Type | Explanation |
| ---- | ----------- |
| `int24` | Ticks can only be initialized and used at multiples of this value |

For instance, a tickDistance of 5 means ticks can be initialized every 5th tick, i.e., ..., -10, -5, 0, 5,
10, ...

### `ticks()`
Retrieve information about a specified `int24` tick.

| Output Field | Type | Explanation |
| ---- | ----------- | ------ |
| `liquidityGross` | `uint128` | total liquidity amount from positions that uses this tick as a lower or upper
tick |
| `liquidityNet` | `int128` | how much liquidity changes when the pool tick crosses up this tick |
| `feeGrowthOutside` | `uint256` | fee growth on the other side of the tick relative to the current tick. <br/
>  [Appendix-A](#Appendix-A-Range-Mechanism) |
| `secondsPerLiquidityOutside` | `uint128` | seconds spent on the other side of the tick relative to the
current tick. <br/>  [Appendix-A](#Appendix-A-Range-Mechanism) |

### `initializedTicks()`
Returns the previous and next initialized ticks from the specified tick.

#### Note
If the specified tick is uninitialized, the returned values are zero.

| Output Field | Type | Explanation |
| ---- | ----------- | ------ |
| `previous` | `int24`| Next initalized tick ***below*** the specified tick |
| `next` | `int24`| Next initalized tick ***above*** the specified tick |

### `getPositions()`
Returns the information about a position.

#### Inputs
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `owner` | `address` | position owner |
| `tickLower` | `int24` | position's lower tick |
| `tickUpper` | `int24` | position's upper tick |

#### Outputs
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `liquidity` | `uint128` | position's liquidity amount |
| `feeGrowthInsideLast` | `uint256` | last cached fee growth inside the position as of the last action
performed |

### `getPoolState()`
Primarily returns the pool's current price and ticks, and whether it is locked.

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `sqrtP` | `uint160` | current sqrt price, multiplied by $2^{96}$ |
| `currentTick` | `int24` | current tick that closely reflects `sqrtP` |
| `nearestCurrentTick` | `int24` | nearest initialized tick that is <= `currentTick` |
| `locked` | `bool` | true if pool is locked, false otherwise |

### `getLiquidityState()`
Fetches the pool's liquidity values.

| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `baseL` | `uint128` | total liquidity provided by active positions |
| `reinvestL` | `uint128` | liquidity is reinvested into the pool |
| `reinvestLLast` | `uint128` | last cached value of `reinvestL`, used for calculating reinvestment token qty |

### `getFeeGrowthGlobal()`
Returns the all-time fee growth per unit of liquidity of the pool. More information can be found [here]
(##Global-value).

### `getSecondsPerLiquidityData()`
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `secondsPerLiquidityGlobal` | `uint128` | all-time seconds per unit of liquidity of the pool. More
information can be found [here](##Global-value) |
| `lastUpdateTime` | `uint32` | timestamp of last performed updated to `secondsPerLiquidityGlobal` |

### `getSecondsPerLiquidityInside()`
Calculates and returns the active time per unit of liquidity until up to the current timestamp.

#### Input
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `tickLower` | `int24` | a lower tick |
| `tickUpper` | `int24` | an upper tick |

#### Output
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `secondsPerLiquidityInside` | `uint128` | active time between `tickLower` and `tickUpper`. Note that its
value is multiplied by $2^{96}$. More information can be found [here](#Calculating-value-inside-ticks) |


### `_initPoolStorage()`
Used by the pool to initialize relevant pool variables.

### `_positionKey()`
Calculates the key to the positions mapping. It is simply the keccak256 hash of a specified address and lower
and upper ticks.

---

## PoolTicksState
Inherits [PoolStorage](#PoolStorage). Contains functions for updating a tick's, position's or pool's state.

<!-- ### struct: UpdatePositionData
| Field | Type | Explanation |
| ---- | ----------- | ------ |
| `owner` | `address` | position owner |
| `tickLower` | `int24` | position's lower tick |
| `tickUpper` | `int24` | position's upper tick |
| `tickLowerPrevious` | `int24` | the expected nearest initialized tick that is <= `tickLower`|
| `tickUpperPrevious` | `int24` | the expected nearest initialized tick that is <= `tickLower`|
| `liquidityDelta` | `int128` | any change in liquidity | -->

### `_updatePosition()`
Calls [`_updateTick`](#_updateTick) on a position's lower and upper tick, calculates the fee growth inside
between the 2 ticks and updates the position by calling [`_updatePositionData()`](#_updatePositionData).

Returns the calculated reinvestment tokens to be minted for the position's accumulated fees.

### `_updateLiquidityAndCrossTick()`
Called by the pool when crossing a tick. Updates the tick's outside values (read more [here](#Crossing-ticks)),
and applies any change in liquidity to the pool's base liquidity.

Returns the new base liquidity and next tick values.

### `_updatePoolData()`
Called after a pool swap's calculations are completed, and new values are to be assigned to the pool's price,
liquidity and tick values.

### `_getInitialSwapData()`
Returns the stored pool's price, liquidity and tick values before swap calculations are to be performed.

### `_updatePositionData()`
Updates a position's liquidity and feeGrowthInside value. Also calculates the reinvestment tokens to be minted
for the position's accumulated fees.

### `_updateTick()`
Initializes / updates / deletes a tick's state (liquidity, outside values) and if required, inserts and removes
the tick from the linked list by calling [`_updateTickList()`](#_updateTickList).

### `_updateTickList()`
Add / remove a specified tick to / from the linked list. No changes are applied if the specified tick is either
the `MIN_TICK` or `MAX_TICK`.

---
