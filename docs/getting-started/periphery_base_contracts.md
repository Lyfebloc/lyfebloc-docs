---
sidebar_position: 20
---

# Core Libraries


## BaseSplitCodeFactory
Inherited by the Factory contract. Main purpose is to hold the LyfeblocDMMv2Pool creation code in a separate
address, since its creation code is close to the bytecode size limit of 24kB.


### `getCreationCodeContracts()`
Returns the 2 addresses where the creation code of the contract created by this factory is stored.

### `getCreationCode()`
Returns the creation code of the contract this factory creates.

---

## FullMath
Taken from [https://xn--2-umb.com/21/muldiv](https://xn--2-umb.com/21/muldiv). Facilitates multiplication and
division that can have overflow of an intermediate value without any loss of precision. Handles "phantom
overflow" i.e., allows multiplication and division where an intermediate value overflows 256 bits.

### `mulDivFloor()`
Returns `(a * b / denominator)` rounded down.
| Input | Type | Explanation |
| -------- | -------- | -------- |
| `a`     | `uint256` | multiplicand |
| `b`     | `uint256` | multiplier |
| `denominator` | `uint256` | divisor |



### `mulDivCeiling()`
Similar to [`mulDivFloor`](#mulDivFloor), but rounded up.

---

## LinkedList
A doubly linked list to be used for tick management.

### Struct: Data
| Field | Type | Explanation |
| -------- | -------- | -------- |
| `previous` | `int24` | previous tick |
| `next`     | `int24` | next tick |

### `init()`
Initializes the LinkedList with the lowestValue and highestValue, where
- `lowestValue.previous = lowestValue`
- `lowestValue.next` = `highestValue`
- `highestValue.previous = lowestValue`
- `highestValue.next = highestValue`

| Field | Type | Explanation |
| -------- | -------- | -------- |
| `self` | `mapping(int24 => Data)` | A mapping of `int24` values to the [`Data`](#Struct-Data) struct|
| `lowestValue` | `int24` | lowest value |
| `highestValue` | `int24` | highest value |

### `insert()`
Inserts a new value into the LinkedList, given an existing lower value. The new value to be inserted should not
be an existing value. Also, the condition `lowerValue < newValue < lowerValue.next` should be satisfied.

| Field | Type | Explanation |
| -------- | -------- | -------- |
| `self` | `mapping(int24 => Data)` | A mapping of `int24` values to the [`Data`](#Struct-Data) struct|
| `newValue` | `int24` | value to be inserted |
| `lowerValue` | `int24` | highest existing value in the linked list that is `< newValue` |

### `remove()`
Removes an existing value from the LinkedList. Returns the next lowest value (`existingValue.previous`).

Note that no removal is performed if `removedValue` happens to be the `lowestValue` or `highestValue` passed in
[`init()`](#init).

| Field | Type | Explanation |
| -------- | -------- | -------- |
| `self` | `mapping(int24 => Data)` | A mapping of `int24` values to the [`Data`](#Struct-Data) struct|
| `removedValue` | `int24` | value to be removed |


---

## LiqDeltaMath
Contains a function to assist with the addition of signed liquidityDelta to unsigned liquidity.

### `applyLiquidityDelta()`
Adds or remove `uint128` liquidityDelta to `uint128` liquidity
| Field | Type | Explanation |
| -------- | -------- | -------- |
| `liquidity` | `uint128` | Liquidity to be adjusted|
| `liquidityDelta` | `int128` | quantity change to be applied |
| `isAddLiquidity` | `bool` | true = add liquidity, false = remove liquidity |

---

## MathConstants
Contains constants commonly used by multiple files.

---

## QtyDeltaMath
Contains functions for calculating token0 and token1 quantites from differences in prices or from burning
reinvestment tokens

### `getQtysForInitialLockup()`
Calculate the token0 and token1 quantities needed for unlocking the pool given an initial price and liquidity.
| Input Field | Type | Explanation |
| -------- | -------- | -------- |
| `initialSqrtP` | `uint160` | initial sqrt price raised by `2**96` |
| `liquidity` | `uint128` | initial liquidity. should be `MIN_LIQUIDITY = 100000` |

| Return Field | Type | Explanation |
| -------- | -------- | -------- |
| `qty0` | `uint256` | token0 quantity required |
| `qty1` | `uint256` | token1 quantity required |

### `calcRequiredQty0()`
Calculates the token0 quantity between 2 sqrt prices for a given liquidity quantity.

Note that the function assumes that `upperSqrtP > lowerSqrtP`.

#### Input

| Field | Type | Explanation |
| -------- | -------- | -------- |
| `lowerSqrtP` | `uint160` | the lower sqrt price |
| `upperSqrtP` | `uint128` | the upper sqrt price |
| `liquidity`  | `int128` | liquidity quantity |
| `isAddLiquidity` | `bool` | true = add liquidity, false = remove liquidity |

#### Output
| Type | Explanation |
| -------- | ------- |
| `int256` | token0 qty required for position with liquidity between the 2 sqrt prices |

Generally, if the return value > 0, it will be transferred into the pool. Conversely, if the return value < 0,
it will be transferred out of the pool.

### `calcRequiredQty1()`
Calculates the token1 quantity between 2 sqrt prices for a given liquidity quantity.

Note that the function assumes that `upperSqrtP > lowerSqrtP`.

#### Input

| Field | Type | Explanation |
| -------- | -------- | -------- |
| `lowerSqrtP` | `uint160` | the lower sqrt price |
| `upperSqrtP` | `uint128` | the upper sqrt price |
| `liquidity`  | `int128` | liquidity quantity |
| `isAddLiquidity` | `bool` | true = add liquidity, false = remove liquidity |

#### Output
| Type | Explanation |
| -------- | ------- |
| `int256` | token0 qty required for position with liquidity between the 2 sqrt prices |

Generally, if the return value > 0, it will be transferred into the pool. Conversely, if the return value < 0,
it will be transferred out of the pool.

### `getQty0FromBurnRTokens()`
Calculates the token0 quantity to be sent to the user for a given amount of reinvestment tokens to be burnt.

| Input Field | Type | Explanation |
| -------- | -------- | -------- |
| `sqrtP` | `uint160` | the current sqrt price |
| `liquidity` | `uint128` | expected change in reinvestment liquidity due to the burning of reinvestment
tokens |

### `getQty1FromBurnRTokens()`
Calculates the token1 quantity to be sent to the user for a given amount of reinvestment tokens to be burnt.

| Input Field | Type | Explanation |
| -------- | -------- | -------- |
| `sqrtP` | `uint160` | the current sqrt price |
| `liquidity` | `uint128` | expected change in reinvestment liquidity due to the burning of reinvestment
tokens |

### `divCeiling()`
Returns `ceil(x / y)`. `y` should not be zero.

---

## QuadMath

### `getSmallerRootOfQuadEqn()`
Given a variant of the quadratic equation $ax^2 - 2bx + c - 0$ where $a$, $b$ and $c > 0$, calculate the
smaller root via the quadratic formula.

Returns $\frac{b - \sqrt{b^2 - ac}}{a}$
| Input Field | Type |
| -------- | -------- |
| `a` | `uint256` |
| `b` | `uint256` |
| `c` | `uint256` |

### `sqrt()`
Unchanged from [DMMv1](https://github.com/dynamic-amm/smart-contracts/blob/master/contracts/libraries/MathExt.
sol#L36-L48). Calculates the square root of a value using the Babylonian method.

---

## ReinvestmentMath
Contains a helper function to calculate reinvestment tokens to be minted given an increase in reinvestment
liquidity.

### `calcRMintQty()`
Given the difference between `reinvestL` and `reinvestLLast`, calculate how many reinvestment tokens are to be
minted.
$rMintQty = rTotalSupply * \frac{reinvestL - reinvestL_{Last}}{reinvestL_{Last}} * \frac{baseL}{baseL +
reinvestL}$
| Input Field | Type | Explanation |
| -------- | -------- | -------- |
| `reinvestL` | `uint256` | latest reinvestment liquidity value. Should be `>= reinvestLLast` |
| `reinvestLLast` | `uint256` | reinvestmentLiquidityLast value
| `baseL` | `uint256` | active base liquidity |
| `rTotalSupply` | `uint256` | total supply of reinvestment token |

---

## SafeCast
Contains methods for safely casting between different types.

### `toUint32()`
Casts a `uint256` to a `uint32`. Reverts on overflow.

### `toInt128()`
Casts a `uint128` to a `int128`. Reverts on overflow.

### `toUint128()`
Casts a `uint256` to a `uint128`. Reverts on overflow.

### `revToUint128()`
Given `int128 y`, returns `uint128 z = -y`.

### `toUint160()`
Casts a `uint256` to a `uint160`. Reverts on overflow.

### `toInt256()`
Casts a `uint256` to a `int256`. Reverts on overflow.

### `revToInt256()`
Cast a `uint256` to a `int256` and reverses the sign. Reverts on overflow.

### `revToUint256()`
Given `int256 y`, returns `uint256 z = -y`.

---

## SwapMath
Contains the logic needed for computing swap input / output amounts and fees. The primary function to look at
is [`computeSwapStep`](#computeSwapStep), as it is where the bulk of the swap flow logic is in, and where calls
to the other functions in the library are made.

### `computeSwapStep()`
Computes the actual swap input / output amounts to be deducted or added, the swap fee to be collected and the
resulting price.

#### Inputs

| Field | Type | Explanation |
| ----- | ---- | ----------- |
| `liquidity` | `uint256` | active base liquidity + reinvestment liquidity |
| `currentSqrtP` | `uint160` | current sqrt price |
| `targetSqrtP` | `uint160` | sqrt price limit `nextSqrtP` can take |
| `feeInBps` | `uint256` | swap fee in basis points |
| `specifiedAmount` | `int256` | amount remaining to be used for the swap |
| `isExactInput` | `bool` | true if `specifiedAmount` refers to input amount, false if `specifiedAmount` refers
to output amount |
| `isToken0` | `bool` | true if `specifiedAmount` is in token0, false if `specifiedAmount` is in token1 |

#### Outputs

| Field | Type | Explanation |
| ----- | ---- | ----------- |
| `usedAmount` | `int256` | actual amount to be used for the swap. >= 0 if `isExactInput` = true, <= 0 if
`isExactInput` = false |
| `returnedAmount` | `int256` | output qty (<= 0) to be accumulated if `isExactInput` = true, input qty (>= 0)
if `isExactInput` = false |
| `deltaL` | `uint256` | collected swap fee, to be incremented to reinvest liquidity |
|`nextSqrtP` | `uint160` | new sqrt price after the computed swap step |


#### Note
`nextSqrtP` should not exceed `targetSqrtP`.

### `calcReachAmount()`
Calculates the amount needed to reach `targetSqrtP` from `currentSqrtP`. Note that `currentSqrtP` and
`targetSqrtP` are casted from uint160 to uint256 as they are multiplied by `TWO_BPS (20_000)` or `feeInBps`.

The mathematical formulas are provided below for reference.
| isExactInput | isToken0 | Formula |
| ----- | ------------ | ------------ |
| `true` | `true` | $\frac{2*BPS*L(\sqrt{p_c} - \sqrt{p_n})}{\sqrt{p_c}(2*BPS*\sqrt{p_n} - fee\sqrt{p_c})}$
(>0) |
| `true` | `false` | $\frac{2*BPS*\sqrt{p_c}*L(\sqrt{p_n} - \sqrt{p_c})}{(2*BPS*\sqrt{p_c} - fee\sqrt{p_n})}$
(>0) |
| `false` | `true` | $-\frac{2*BPS*L(\sqrt{p_n} - \sqrt{p_c})}{\sqrt{p_c}(2*BPS*\sqrt{p_n} - fee\sqrt{p_c})}$
(<0) |
| `false` | `false` | $-\frac{2*BPS*\sqrt{p_c}*L(\sqrt{p_c} - \sqrt{p_n})}{(2*BPS*\sqrt{p_c} - fee\sqrt{p_n})}$
(<0) |

Note that while cases 1 and 3 and cases 2 and 4 are mathematically equivalent, the implementation differs by
performing a double negation for the exact output cases. It takes the difference of $\sqrt{p_n}$ and $\sqrt{p_c}
$ in the numerator (>0), then performing a second negation.

| Input Field | Type | Formula Variable | Explanation |
| ----- | ---- | -------- | ---------------------- |
| `liquidity` | `uint256` | $L$ | active base liquidity + reinvestment liquidity |
| `currentSqrtP` | `uint160` | $\sqrt{p_c}$ | current sqrt price |
| `targetSqrtP` | `uint160` | $\sqrt{p_n}$ | sqrt price limit `nextSqrtP` can take |
| `feeInBps` | `uint256` | $fee$ | swap fee in basis points |
| `isExactInput` | `bool` | N.A. | true / false if specified swap amount refers to input / output amount
respectively |
| `isToken0` | `bool` | N.A. | true / false if specified swap amount is in token0 / token1 respectively |


### `estimateIncrementalLiquidity()`
Estimates `deltaL`, the swap fee to be collected based on amountSpecified. This is called only for the final
swap step, where the next (temporary) tick will not be crossed.

In the case where exact input is specified, the formula is rather straightforward.
| isToken0 | Formula |
| -------- | ------- |
| `true` | $\frac{delta*fee*\sqrt{p_c}}{2*BPS}$ |
| `false` | $\frac{delta*fee}{2*BPS*\sqrt{p_c}}$ |

In the case where exact ouput is specified, a quadratic equation has to be solved. The desired result is the
smaller root of the quadratic equation.

| isToken0 | Formula |
| -------- | ------- |
| `true` | $fee*(\Delta{L})^2-2[(BPS-fee)*L-BPS*delta*\sqrt{p_c}]\Delta{L}+fee*L*delta*\sqrt{p_c}=0$ |
| `false` | $fee*(\Delta{L})^2-2[(BPS-fee)*L-\frac{BPS*delta}{\sqrt{p_c}}]\Delta{L}+\frac{fee*L*delta}{\sqrt
{p_c}}=0$ |


| Input Field | Type | Formula Variable | Explanation |
| ----- | ---- | ----------- | ---------------------- |
| `absDelta` | `uint256` | $delta$ | ${\|}$`usedAmount`${\|}$, absolute value of `usedAmount` (actual amount
used for swap) |
| `liquidity` | `uint256` | $L$ | active base liquidity + reinvestment liquidity |
| `currentSqrtP` | `uint160` | $\sqrt{p_c}$ | current sqrt price |
| `feeInBps` | `uint256` | $fee$ | swap fee in basis points |
| `isExactInput` | `bool` | N.A. | true / false if specified swap amount refers to input / output amount
respectively |
| `isToken0` | `bool` | N.A. | true / false if specified swap amount is in token0 / token1 respectively |


### `calcIncrementalLiquidity()`
Calculates `deltaL`, the swap fee to be collected based on amountSpecified. This is called for an intermediate
swap step, where the next (temporary) tick will be crossed.

The mathematical formulas are provided below for reference.
| isExactInput | isToken0 | Formula |
| ------------ | -------- | ------- |
| `true` | `true` | $\sqrt{p_n}*(\frac{L}{\sqrt{p_c}}+\|delta\|)-L$ |
| `true` | `false` | $\frac{(L*\sqrt{p_c})+\|delta\|}{\sqrt{p_n}}-L$ |
| `false` | `true` | $\sqrt{p_n}*(\frac{L}{\sqrt{p_c}}-\|delta\|)-L$ |
| `false` | `false` | $\frac{(L*\sqrt{p_c})-\|delta\|}{\sqrt{p_n}}-L$ |

| Input Field | Type | Formula Variable |Explanation |
| ----- | ---- | ----------- | ------------ |
| `absDelta` | `uint256` | \|$delta$\| | ${\|}$`usedAmount`${\|}$, absolute value of `usedAmount` (actual
amount used for swap) |
| `liquidity` | `uint256` | $L$ | active base liquidity + reinvestment liquidity |
| `currentSqrtP` | `uint160` | $\sqrt{p_c}$ | current sqrt price |
| `nextSqrtP` | `uint160` | $\sqrt{p_n}$ | next sqrt price |
| `isExactInput` | `bool` | N.A. | true / false if specified swap amount refers to input / output amount
respectively |
| `isToken0` | `bool` | N.A. | true / false if specified swap amount is in token0 / token1 respectively |

### `calcFinalPrice()`
Calculates the sqrt price of the final swap step where the next (temporary) tick will not be crossed.

The mathematical formulas are provided below for reference.
| isExactInput | isToken0 | Formula |
| ------------ | -------- | ------- |
| `true` | `true` | $\frac{(L+\Delta{L})\sqrt{p_c}}{L+\|delta\|\sqrt{p_c}}$ |
| `true` | `false` | $\frac{L\sqrt{p_c}+\|delta\|}{L+\Delta{L}}$ |
| `false` | `true` | $\frac{(L+\Delta{L})\sqrt{p_c}}{L-\|delta\|\sqrt{p_c}}$ |
| `false` | `false` | $\frac{L\sqrt{p_c}-\|delta\|}{L+\Delta{L}}$ |


| Input Field | Type | Formula Variable | Explanation |
| ----- | ---- | ----------- | ------------ |
| `absDelta` | `uint256` | \|$delta$\| | ${\|}$`usedAmount`${\|}$, absolute value of `usedAmount` (actual
amount used for swap) |
| `liquidity` | `uint256` | $L$ | active base liquidity + reinvestment liquidity |
| `deltaL` | `uint256` | $\Delta{L}$ | collected swap fee |
| `currentSqrtP` | `uint160` | $\sqrt{p_c}$ | current sqrt price |
| `isExactInput` | `bool` | N.A. | true / false if specified swap amount refers to input / output amount
respectively |
| `isToken0` | `bool` | N.A. | true / false if specified swap amount is in token0 / token1 respectively |


### `calcReturnedAmount()`
Calculates `returnedAmount` for the [`computeSwapStep`](#computeSwapStep) function. Rounds down when
`isExactInput = true` (calculating output < 0) so that we avoid sending too much. Conversely, rounds up when
`isExactInput = false` to ensure sufficient input > 0 will be received.

The mathematical formulas are provided below for reference.

#### `isToken0 = true`
The formula is actually the same, with the difference being made to the operands to ensure the price difference
is non-negative.

| isExactInput | Formula |
| -------- | ------- |
| `true` | $\Delta{L}\sqrt{p_n}-L(\sqrt{p_c}-\sqrt{p_n})$ |
| `false` | $\Delta{L}\sqrt{p_n}+L(\sqrt{p_n}-\sqrt{p_c})$|

#### `isToken0 = false`
$\frac{L+\Delta{L}}{\sqrt{p_n}} - \frac{L}{\sqrt{p_c}}$

| Input Field | Type | Formula Variable | Explanation |
| ----- | ---- | ----------- | ------------ |
| `liquidity` | `uint256` | $L$ | active base liquidity + reinvestment liquidity |
| `currentSqrtP` | `uint160` | $\sqrt{p_c}$ | current sqrt price |
| `nextSqrtP` | `uint160` | $\sqrt{p_n}$ | next sqrt price |
| `deltaL` | `uint256` | $\Delta{L}$ | collected swap fee |
| `isExactInput` | `bool` | N.A. | true / false if specified swap amount refers to input / output amount
respectively |
| `isToken0` | `bool` | N.A. | true / false if specified swap amount is in token0 / token1 respectively |

---

## TickMath

Contains functions for computing square root prices from ticks and vice versa. Adapted from [Uniswap V3's
TickMath library](https://github.com/Uniswap/v3-core/blob/main/contracts/libraries/TickMath.sol).

### Constants
| Field | Type | Value | Explanation |
| -------- | -------- | --------- | -------- |
| `MIN_TICK` | `int24` | `-887272` | Minimum possible tick = ${log_{1.0001}2^{-128}}$ |
| `MAX_TICK` | `int24` | `887272` | Minimum possible tick = ${log_{1.0001}2^{128}}$ |
| `MIN_SQRT_RATIO` | `uint160` |`4295128739` | `getSqrtRatioAtTick(MIN_TICK)` |
| `MAX_SQRT_RATIO` | `uint160` |`1461446703485210103287273052203988822378723970342` | `getSqrtRatioAtTick
(MAX_TICK)` |

### `getSqrtRatioAtTick()`
Given a `int24 tick`, calculates ${\sqrt{1.0001^{tick}} * 2^{96}}$.

### `getTickAtSqrtRatio()`
Given a square root price ratio `uint160 sqrtP`, calculates the greatest `tick` such that `getSqrtRatioAtTick
(tick) <= sqrtP`.

Note that `MIN_SQRT_RATIO <= sqrtP <= MAX_SQRT_RATIO`, otherwise the function will revert.

### `getMaxNumberTicks()`
Used to calculate the maximum liquidity allowable per tick. This function calculates the maximum number of
ticks that can be inserted into the LinkedList, given a `tickDistance`.

| Field | Type | Explanation |
| ----- | ---- | ----------- |
| `_tickDistance` | `int24` | Ticks can only be initialized at multiples of this value. |

---
