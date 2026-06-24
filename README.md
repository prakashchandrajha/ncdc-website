## THE GOAL

Build a system that generates one structured JSON packet every minute during
Indian market hours (9:15 AM to 3:30 PM IST). That packet is the entire
product. GPT and Claude read it and execute limit orders via Zerodha through
OpenAlgo. They analyze nothing. They override nothing. Every signal, every
model, every mathematical calculation exists to produce that packet accurately.
The system improves itself daily, weekly, and monthly without human
intervention.

---

## AUDIT-VERIFIED CORRECTIONS IN THIS VERSION

**Bank Nifty monthly expiry is last TUESDAY, not last Wednesday.** The
September 2025 NSE/BSE restructuring moved all NSE monthly contracts to the
last Tuesday of the month. Bank Nifty, FinNifty, and Midcap Nifty monthly
contracts all settle on the last Tuesday. All BSE monthly contracts settle on
the last Thursday. No weekday is hardcoded anywhere in the system.

**torchegranate has been merged into pomegranate mainline.** The
`jmschrei/torchegranate` repository is now formally deprecated. Its PyTorch
backend, GPU support, MaskedTensor handling, and semi-supervised learning
capabilities have been absorbed into `jmschrei/pomegranate` v1.0+. Install
`pomegranate>=1.0.0` directly. Do not install the separate torchegranate
package.

**Chronos-2 fine-tuning requires >100 time series with median history
length >3× the prediction length.** Fine-tuning on insufficient data causes
severe overfitting. The plan schedules first fine-tuning at Month 6, not Month
3, to ensure adequate post-reform data depth.

**Nifty 50 weekly expiry is Tuesday, Sensex weekly is Thursday.** Both
resolved dynamically from the instrument master — never hardcoded.

---

## LOCKED PARAMETERS — AUDIT-VERIFIED

| Parameter | Value |
|---|---|
| Nifty 50 lot size | **65** (Jan 2026 onward) |
| Bank Nifty lot size | **30** (Jan 2026 onward) |
| FinNifty lot size | **60** (Jan 2026 onward) |
| Midcap Select lot size | **120** (Jan 2026 onward) |
| Nifty Next 50 lot size | **25** (unchanged) |
| Sensex BSE lot size | **20** |
| Bankex lot size | **30** (monthly only) |
| Nifty 50 | Weekly (TUESDAY) + Monthly (last TUESDAY) |
| Sensex BSE | Weekly (THURSDAY) + Monthly (last THURSDAY) |
| Bank Nifty | Monthly only — **last TUESDAY** of month |
| FinNifty | Monthly only — **last TUESDAY** of month |
| Midcap Nifty | Monthly only — **last TUESDAY** of month |
| Bankex BSE | Monthly only — **last THURSDAY** of month |
| All lot sizes + expiry dates | **Never hardcoded — from kite.instruments() daily** |
| Bhavcopy: June 2001–June 20, 2024 | Legacy CSV — archives.nseindia.com |
| Bhavcopy: June 21–July 5, 2024 | Dual format — both active simultaneously |
| Bhavcopy: July 6, 2024 onward | UDiFF exclusively — nsearchives.nseindia.com |
| Zerodha 1-min data | January 2015 — 59-day windows |
| Zerodha daily data | Late 1990s — 1,900-day windows |
| Zerodha hourly data | January 2015 — 390-day windows |
| Zerodha API rate (non-order) | 3 requests/second — throttle strictly |
| NSE Bhavcopy | June 2001–present — 25 years of daily strike OI |
| India VIX | **2008** — official launch, not before |
| Chronos-2 fine-tuning starts | **Month 6** (needs >100 post-reform series) |
| Kronos patches before use | Issues #168, #227, #295, #297 — all four mandatory |
| SVI Durrleman condition | g(k) ≥ 0 enforced across full strike grid |
| SVI variance positivity | a + b·σ·√(1−ρ²) ≥ 0 |
| Log-signature depth | Level 3 (mathematically optimal) |
| SEBI OPS ceiling | 10 orders/second per exchange |
| Static IP | Mandatory for all order-placement API calls |
| All orders | LIMIT only |
| OI logger | Starts today. Before any other task. Non-negotiable. |

---

## HISTORICAL LOT SIZE TABLE — NIFTY 50

| Epoch Start | Epoch End | Lot Size |
|---|---|---|
| 2000-06-01 | 2005-03-31 | 200 |
| 2005-04-01 | 2007-02-22 | 100 |
| 2007-02-23 | 2014-10-30 | 50 |
| 2014-10-31 | 2015-10-29 | 25 |
| 2015-10-30 | 2021-06-24 | 75 |
| 2021-06-25 | 2024-04-25 | 50 |
| 2024-04-26 | 2024-11-19 | 25 |
| 2024-11-20 | 2025-12-30 | 75 |
| 2025-12-31 | Present | 65 |

`get_lot_size(instrument, date)` is the first function written and
called by every downstream calculation. Never use a constant.

---

## CONFIRMED DATA SOURCES — 100% VERIFIED ONLY

| Source | Content | When |
|---|---|---|
| NSE Bhavcopy derivatives | Strike OI, volume, OHLC by expiry | June 2001–present, daily EOD, free |
| NSE Participant-Wise OI | FII / Client / Pro net positions | Daily ~7 PM, free HTML |
| NSE India VIX | Daily VIX OHLC | 2008–present, NSE indices page, free |
| NSE Option Chain | Live IV, OI, LTP, bid/ask, updated_at | Market hours, free JSON |
| NSE Market Activity Report | PCR, delivery %, VIX stats | Daily EOD, PDF, free |
| Zerodha KiteConnect REST | OHLCV daily/1-min/hourly, instrument master | Via API, paginated |
| Zerodha KiteTicker WebSocket | Live ticks, top-5 depth, OI | Market hours |

---

## HISTORICAL DATA — DOWNLOAD EVERYTHING

| Tier | Interval | Start | Windows | Why |
|---|---|---|---|---|
| Daily | 1-day | Late 1990s | 1,900-day | 6,500+ days — HMM and GARCH see full market cycles including 2008 GFC, 2011 Eurozone, 2018 NBFC crisis, 2020 COVID, 2022 rate hikes |
| 1-minute | 1-min | Jan 2015 | 59-day | ~1M bars — Matrix Profile, FAISS, Hurst, Kyle's lambda, path signatures |
| Hourly | 60-min | Jan 2015 | 390-day | ~17,000 bars — saturates Chronos-2's 8,192-step context |
| Bhavcopy OI | Daily | June 2001 | One-time bulk | 25 years of strike-level OI — only source for historical GEX/Max Pain |

Every row tagged `PRE_2024_REFORM` or `POST_2024_REFORM`. Live trading
and all ML model fine-tuning use post-reform data as primary weight.

---

## PYTHON STACK — COMPLETE

### Infrastructure

| Library | Purpose |
|---|---|
| kiteconnect | Zerodha API — data and orders |
| psycopg2-binary, sqlalchemy | TimescaleDB |
| redis | Real-time cache and inter-process communication |
| celery | Async worker queue for heavy computations |
| polars | Bhavcopy-scale batch — Rust-native, 10x faster than pandas |
| pandas, numpy | Standard computation |
| jax | Google JAX — GPU-accelerated numpy with automatic differentiation. Primary backend for GEX across 200 strikes, vol surface Greeks, VRP surface |
| numba | JIT for tight isolated scalar loops |
| scipy | SVI optimization, GPD fitting, statistics |
| xarray | N-dimensional labeled arrays — perfect for multi-dimensional vol surface storage and time-series cross-sectional data |
| zarr | Chunked compressed storage for vol surface history — better than Parquet for 3D+ arrays |
| great_expectations | Data pipeline validation |
| python-telegram-bot | Three-tier alerting |
| fastapi, uvicorn | Dashboard API |
| apscheduler | Scheduled jobs |
| aiohttp | Async HTTP |
| pdfplumber | NSE Market Activity PDF parsing |
| exchange_calendars | Authoritative NSE/BSE trading calendars |
| numexpr | 4x faster expression evaluation vs numpy for large arrays |
| bottleneck | Fast Cython moving-window functions |

### Mathematical and Signal

| Library | Purpose |
|---|---|
| arch | GJR-GARCH, FIGARCH (long-memory volatility), EGARCH — all in one library |
| pomegranate>=1.0.0 | HMM, Hidden Semi-Markov Models, Bayesian Networks — PyTorch backend, GPU-accelerated, MaskedTensor, replaces both hmmlearn and the deprecated torchegranate |
| py_vollib_vectorized | Vectorized Black-Scholes Greeks across full option chain in one JAX-compatible array pass |
| QuantLib-Python | Professional derivatives pricing — stochastic vol models, yield curves |
| statsmodels | AR(1) Fuller correction, Johansen cointegration, ADF, KPSS, ARFIMA (long-memory returns) |
| linearmodels | Panel regression, IV regression for cross-sectional factor analysis |
| filterpy | Kalman filter for dynamic hedge ratio estimation |
| nolds | Lyapunov exponent, Hurst DFA, correlation dimension |
| antropy | Permutation entropy, spectral entropy |
| dit | Transfer entropy and mutual information |
| ruptures | Change-point detection (PELT algorithm) |
| pywavelets | Discrete wavelet transform |
| PyEMD | Empirical Mode Decomposition — cross-validates wavelet |
| stumpy | Matrix Profile — motif discovery and streaming O(n log n) similarity search |
| tick | Hawkes process MLE |
| copulas | Cross-constituent tail dependence |
| networkx | Constituent causality and correlation network, eigenvector and PageRank centrality |
| POT | Wasserstein distance for distributional drift |
| giotto-tda | Persistent homology — topological regime detection |
| esig | Path signatures — Level-3 log-signature of 3D price-volume-delta path |
| tslearn | DTW-based time-series clustering — structurally similar historical periods |
| aeon | Comprehensive time-series ML in sklearn API |
| fracdiff | Fast fractional differentiation with optional GPU support — clean-room replacement for mlfinlab fracdiff |
| GPy | Gaussian Process Regression for vol surface interpolation with uncertainty quantification |
| stochastic | Simulate fractional Brownian motion and other stochastic processes for stress testing |
| MAPIE | Model-Agnostic Prediction Interval Estimation — conformal prediction intervals on XGBoost/LightGBM |
| pandas-ta | Fast technical analysis built on pandas — used for baseline ORB and spread-bar computation |

### Machine Learning

| Library | Purpose |
|---|---|
| torch | Kronos inference, autoencoder |
| chronos-forecasting | Amazon Chronos-2 — probabilistic forecasting, 8,192-step context |
| faiss-cpu | Large-scale nearest-neighbor vector search |
| scikit-learn | LASSO, preprocessing, pipelines |
| xgboost | Primary meta-learner |
| lightgbm | Secondary meta-learner — ensemble with XGBoost |
| shap | Game-theoretic per-signal attribution |
| optuna | Bayesian hyperparameter optimization |
| PyMC, arviz | Full Bayesian GJR-GARCH and FIGARCH posteriors with R-hat, ESS diagnostics |
| pgmpy | Bayesian Network regime fusion |
| river | ADWIN online concept-drift detection |
| cvxpy | Convex portfolio optimization when multiple signals fire |
| dowhy | Causal validation — FII→returns is causal, not spurious |
| econml | Heterogeneous treatment effects across regimes |
| statsforecast | Ultra-fast AutoARIMA, AutoETS — baseline comparison for Chronos-2 |
| neuralforecast | N-BEATS, N-HiTS, TFT models — ensemble with Chronos-2 |

### Backtesting and Reporting

| Library | Purpose |
|---|---|
| vectorbt | Fast vectorized backtesting |
| bt | Composable strategy backtesting |
| quantstats | Sharpe, Sortino, drawdown HTML reports |
| empyrical-reloaded | Financial return metrics |
| pyfolio-reloaded | Portfolio attribution |
| riskfolio-lib | Tail-risk portfolio construction |
| neuralprophet | Calendar-effect decomposition |
| tsfresh | Automated time-series feature extraction |
| tsbootstrap | Bootstrap confidence intervals on backtest results |
| alphalens-reloaded | Alpha factor IC, factor returns, turnover before any signal goes live |
| MAPIE | Conformal prediction intervals for signal output uncertainty |

### mlfinlab not included
Proprietary license. Replaced by: `fracdiff` (fractional differentiation),
custom combinatorial purged cross-validation from López de Prado (2018),
custom VPIN from Easley-López de Prado-O'Hara (2012).

---

## OPEN SOURCE PROJECTS

| Project | License | Role |
|---|---|---|
| OpenAlgo (marketcalls/openalgo) | AGPL-3.0 | Execution layer — Zerodha broker translation, daily session token refresh at 3 AM IST, AES-256-GCM credential encryption, position tracking, rate limiting. Self-hosted only — AGPL network clause does not apply to internal local use. |
| Kronos (shiyu-coder/Kronos) | MIT | Candlestick-native foundation model. Four patches mandatory before any inference: #168, #227, #295, #297. Zero-shot is empirically random — fine-tune first. |
| Chronos-2 (amazon-science/chronos-forecasting) | Apache 2.0 | Probabilistic forecasting. Base model runs immediately. Fine-tuning at Month 6 only. |
| jugaad-data (jugaad-py/jugaad-data) | MIT | NSE Bhavcopy parsing reference |
| Microsoft qlib (microsoft/qlib) | MIT | Full quant research platform — data server, alpha mining, model training, walk-forward backtesting. All 30 signals registered as qlib alpha factors. |
| alphalens-reloaded | Apache 2.0 | Every signal candidate through IC analysis before live packet admission |
| FinRL (AI4Finance-Foundation/FinRL) | MIT | Deep RL for dynamic position sizing |
| exchange_calendars | MIT | NSE/BSE trading calendars |
| fracdiff (fracdiff/fracdiff) | MIT | Fast fractional differentiation |
| statsforecast (Nixtla/statsforecast) | Apache 2.0 | Baseline forecasting — compare against Chronos-2 |
| neuralforecast (Nixtla/neuralforecast) | Apache 2.0 | N-BEATS and TFT ensemble |
| tsbootstrap | BSD | Time-series bootstrap |

Nautilus Trader deferred — system operates on 1-15 minute cycles.

---

## MATHEMATICS — DEEP AND COMPLETE

### Probability and Statistics

Fuller median-unbiased AR(1) bias correction on 30-day rolling P&L. Triggers size reduction only when corrected coefficient > 0.4 AND bootstrap lower bound > 0.15.

Bonferroni-corrected hypothesis testing with persistent global K counter. Threshold = 0.05 / K, tightening automatically as more hypotheses are tested.

Bootstrapped confidence intervals (1,000 resamples) on every threshold.

GPD fitted to worst 5% of rolling annual returns for EVT tail risk. Shape parameter ξ rising = invisible risk building.

Johansen cointegration + ADF + KPSS gate before any spread signal. All three must pass.

Variance Ratio Test (Cochrane 1988) at four horizons simultaneously — multi-scale momentum/mean-reversion diagnostic more rigorous than Hurst alone.

Amihud Illiquidity Ratio = |return| / volume, 30-minute rolling. Spikes precede volatility cascades.

Roll's Implicit Spread = √(−Cov(ΔP_t, ΔP_{t−1})) on 1-minute returns, 30-minute rolling. Informed flow indicator without order book data.

IV Rank = (IV_current − IV_52wk_low) / (IV_52wk_high − IV_52wk_low). Tells where current IV stands relative to its annual range.

IV Percentile = fraction of past 252 trading days where IV was lower than today. Tells whether today is in the top or bottom historical percentile for IV.

Risk Reversal = IV_25delta_put − IV_25delta_call. The standard institutional directional options signal. Negative risk reversal (puts more expensive) = institutional bearish hedging in progress.

Put-Call Parity Deviation = C − P − (F − K·e^(−rT)). When this deviates > 0.5% at any strike, it signals informed flow or acute liquidity stress. Computable every 15 minutes from option chain.

Opening Range statistics: ORB width as a fraction of prior 10-day ATR. When today's 15-minute ORB is in the top quartile historically for this time of month, day-type probability shifts to TREND DAY (72% historically). Bottom quartile = RANGE DAY (71% historically). Computable from 11 years of 1-minute data.

VSA Spread-to-Body Ratio = (High − Low) / |Close − Open| per bar. When ratio > 3 on above-average volume = institutional absorption/distribution in progress. High-effort, low-result bars with wide spread and small body signal supply/demand absorption.

### Calculus and Option Greeks

GEX: first derivative (gradient), second derivative (acceleration).

GEX per constituent: computed for top 10 Nifty stocks with active options (HDFC Bank, Reliance, ICICI Bank, Infosys, TCS, Bharti Airtel). When individual stock GEX maps align directionally with index GEX, signal conviction is significantly higher.

Greeks: Delta, Gamma, Vega, Theta (1st order), Vanna, Vomma (2nd order), Speed (∂Gamma/∂Spot), Color (∂Gamma/∂t) (3rd order).

Charm (∂Delta/∂t) — drives time-based dealer flows near expiry even in a flat market. Charm Exposure = Σ(charm_i × OI_i × lot_size). Critical in the final 90 minutes before any Tuesday (NSE) or Thursday (BSE) expiry.

Vega Exposure (VEX) = Σ(vega_i × OI_i × lot_size × sign_i). Whether a VIX spike amplifies or dampens the current move.

Delta-Adjusted OI (DAOI) = Σ(delta_i × OI_i × lot_size × sign_i). Net directional exposure of all option participants in underlying share units.

Almgren-Chriss optimal execution schedule fitted from historical Kyle's lambda. Every trade proposal includes a multi-child-order schedule over 5-15 minutes to minimize slippage.

### Volatility Models

Yang-Zhang: daily windows, includes overnight variance component, 14× more efficient than close-to-close. Rogers-Satchell: intraday windows within a session.

Realized Kernel Estimator (Barndorff-Nielsen et al. 2008): more robust than Yang-Zhang at 1-minute frequency due to Parzen kernel weighting that suppresses microstructure noise. Use as a cross-check on Yang-Zhang at high-frequency.

Rough Volatility: realized volatility has H ≈ 0.1, not 0.5. Fit the fractional kernel exponent from historical data. Correct all GARCH forecasts for this roughness. When H drops below 0.15, near-term vol prediction is maximally uncertain.

GJR-GARCH on full daily history (6,500+ days) with MAP regularization.

FIGARCH(d): captures long memory in volatility better than GARCH. The d parameter (typically 0.3-0.4 for equity indices) tells you how long volatility shocks persist. FIGARCH(0.35) correctly models the empirically observed slow decay of vol autocorrelation. Available in the arch library.

ARFIMA: autoregressive fractionally integrated moving average for returns with long memory. Better than ARIMA when returns have long-range dependence. Available in statsmodels.

Full Bayesian posterior over all GARCH parameters via PyMC. 10th/90th percentile of the posterior on tomorrow's volatility feeds into position sizing. Wide posterior = reduce size.

BNS Jump-Continuous Decomposition: Barndorff-Nielsen-Shephard decomposition of realized variance into a continuous diffusion component and a discrete jump component. When jump variance > 30% of total realized variance, the market is in a jump regime and mean-reversion strategies structurally fail. This is a major strategy filter nobody computes in Indian retail systems.

### Intraday Seasonality

Every intraday signal has a U-shaped seasonal pattern (high at open, low around noon, high near close). For each signal, compute its historical mean and standard deviation by 15-minute time-of-day bucket across all sessions. Seasonality-adjusted signal = (raw − bucket_mean) / bucket_std. All historical percentile lookups use seasonality-adjusted values.

### Information Theory and Causality

Transfer entropy from FII PWOI → next-day Nifty returns, 120-day rolling window, via dit.

Entropy cascade: Shannon entropy computed simultaneously on returns, cumulative delta, and GEX surface changes. All three below their rolling 20th percentile simultaneously = pre-move institutional positioning.

Vol-smile Shannon entropy across strikes — cross-sectional IV concentration measure.

Granger causality network: rolling 30-bar bivariate Granger causality tests across top 10 Nifty 50 constituents. Which stock Granger-causes the index right now? More rigorous than correlation-based centrality.

### Path Signatures

Level-3 log-signature of the 30-minute (price, volume, cumulative_delta) 3D path via esig. Gives a 13-dimensional coordinate-free geometric feature vector. Runs every 5 minutes as a Celery worker. Level 3 confirmed optimal by rough path theory and empirical benchmarks.

### Fibonacci

Retracement: 23.6%, 38.2%, 50%, 61.8%, 78.6%.
Extension: 127.2%, 161.8%, 261.8%.
Time Zones: vertical markers at bar counts 1, 2, 3, 5, 8, 13, 21, 34 from a significant high or low.
FiGaCS: (Gamma_at_level / total_GEX) × (1 / distance_to_fib). Higher = stronger expected reaction.

---

## NOVEL SIGNALS — ALL 30

Ten new signals added in this version. None exist in any Indian retail system.

**From previous versions — retained:**
GEX second derivative, FiGaCS, Matrix Profile archetypes, Entropy cascade, Lyapunov + permutation entropy, Vol-smile Shannon entropy, Transfer entropy (FII→returns), EVT tail index, Realized vs implied higher moments, Wavelet × EMD, Hawkes branching ratio, Copula tail dependence, Constituent correlation centrality, Speed and Color Greeks, Cointegration/stationarity gate, Bayesian Network regime fusion, Charm Exposure, Vega Exposure, DAOI, Amihud illiquidity, Roll's implicit spread, Path signatures, Variance Ratio Test.

**Seven new in this version:**

**BNS Jump-Continuous Decomposition** — Barndorff-Nielsen-Shephard test statistic distinguishes whether the last 30 minutes of price movement came from smooth diffusion or discrete jumps. When jump variance fraction > 30%, mean-reversion strategies are structurally inapplicable — market is in jump mode. This single filter eliminates the most common source of unexpected losses in options strategies. Nobody computes this in Indian retail.

**IV Rank and IV Percentile** — Both computed from 252-day rolling daily IV history. IV Rank = (IV_current − IV_min) / (IV_max − IV_min). IV Percentile = fraction of past days with lower IV. When IV Rank > 0.85 and IV Percentile > 90th percentile simultaneously, IV is historically extreme — structural premium selling edge exists. When IV Rank < 0.20, IV is historically suppressed — structural vol buying edge exists. These two numbers together determine whether the system is in a premium-selling regime or vol-buying regime.

**Risk Reversal (25-Delta Skew)** — IV_25delta_put − IV_25delta_call, computed from the SVI-calibrated surface. The most institutionally used directional options signal globally. Negative risk reversal (puts more expensive than calls) = institutional bearish hedging. Rapidly becoming more negative (steepening skew) = smart money increasing downside protection. This is the correct way to measure institutional directional sentiment in the options market — more reliable than PCR alone.

**Put-Call Parity Deviation** — Monitoring whether C − P = F − K·e^(−rT) holds across the ATM and near-ATM strikes every 15 minutes. Deviations > 0.5% signal informed flow or liquidity stress. This is a real-time arbitrage health check on the option chain. It detects when options markets are under stress before that stress shows in the underlying price.

**GEX Per Constituent** — GEX computed not just for the Nifty 50 index but separately for each of the top 10 Nifty 50 components that have active options. When both the index GEX and the major constituent GEX maps agree on gamma walls at the same price levels, signal conviction is materially higher than index GEX alone. When they disagree, it signals a rotation within the index — the index price may be stable but constituent-level rebalancing is underway.

**Opening Range Breakout Quantification** — The 15-minute ORB width as a multiple of the 10-day ATR, computed from 11 years of 1-minute data. Top-quartile ORB width historically produces TREND DAY 72% of the time. Bottom-quartile produces RANGE DAY 71% of the time. This single opening observation adjusts all subsequent signal interpretation for the session and is computed within 90 seconds of 9:30 AM each day.

**VSA Spread-to-Body Ratio** — (High − Low) / |Close − Open| per 1-minute bar. When this ratio > 3 on above-average session volume, a wide spread with a small body indicates institutional absorption or distribution in progress — effort without result. This is Volume Spread Analysis in precise numerical form rather than discretionary pattern reading. When occurring near a Gamma Wall with VSA ratio > 3 and volume > 150% of session average, it's the highest-conviction context for a directional trade in the near-term.

---

## COMPUTE ARCHITECTURE

**Main synchronous loop (every minute):** All 30 signals except the four below. JAX as primary backend for array operations. Numba for isolated scalar loops.

**Celery async workers (never block main loop):**
- Persistent homology (giotto-tda) — rolling filtration on multi-asset correlation matrix
- Hawkes process MLE (tick) — iterative MLE on streaming tick data
- Wasserstein distance (POT) — heavy linear programming for distributional drift
- Path signature computation (esig) — Level-3 log-signature, every 5 minutes

Workers write to Redis. Main loop reads most recent result. Results older than 5 minutes flagged STALE in packet.

**Infrastructure:** Static IPv4 Mumbai VPS mandatory for all order-placement. Market data and historical REST queries exempt. Docker stack: TimescaleDB, Redis, Celery workers, OpenAlgo (self-hosted), main pipeline — `docker compose up` starts everything.

---

## KRONOS — COMPLETE

**What it is:** Decoder-only transformer pretrained on 12 billion+ candlestick sequences across 45 global exchanges using Binary Spherical Quantization (BSQ) tokenization. Trained objective: the grammar of financial price action.

**What it is NOT:** A zero-shot oracle. Empirical GitHub Issue #325 benchmark across 4,682 live forecasts showed directional accuracy statistically indistinguishable from random. PR #227 revealed a data leakage bug in the normalization window — published benchmarks (93% RankIC boost) are therefore invalid.

**Four mandatory patches before any use:**
- PR #227 — data leakage in CustomKlineDataset normalization window
- Issue #168 — temporal embedding misalignment. Replace absolute time with: phi = (t − session_open) / (session_close − session_open)
- Issue #295 — codebook index extracted after scaling. Move `codes_to_indexes()` to immediately after `quantize()`, before any scalar multiplication
- Issue #297 — overnight gap handling. Apply exponentially weighted Yang-Zhang variance for BSQ normalization scale

**Two fine-tuned models:**
- NEAR_EXPIRY: trained on T-3 through T-0 window of any nearest active expiry
- NORMAL_SESSION: all other sessions
Split derived from live contract master. Never from a hardcoded weekday.

**Role:** Coverage-gated sidecar signal (minimum 52% coverage). Never the sole trigger.

---

## IMIP PACKET — COMPLETE SCHEMA

```json
{
  "packet_id": "uuid-v4",
  "generated_at": "2026-06-23T10:30:00Z",
  "session_phase": 0.43,

  "regime": {
    "bayesian_posterior": {"TRENDING": 0.71, "RANGING": 0.22, "NOISE": 0.07},
    "fused_regime": "TRENDING",
    "confidence": 0.71,
    "gex_value": -2847000000,
    "gex_regime": "NEGATIVE_GEX",
    "gex_gradient": -12000000,
    "gex_acceleration": -3000000,
    "flip_zone_nifty": 24250,
    "distance_to_flip": 180,
    "charm_exposure": -8400000,
    "vega_exposure": -1200000,
    "daoi": 4500,
    "constituent_gex_agreement": true,
    "hurst_micro": {"value": 0.61, "label": "TREND"},
    "hurst_swing": {"value": 0.57, "label": "TREND"},
    "hurst_macro": {"value": 0.53, "label": "TREND"},
    "rough_vol_H": 0.11,
    "variance_ratio_15min": 1.18,
    "variance_ratio_60min": 1.09,
    "vrt_direction": "INTENSIFYING",
    "lyapunov_label": "ORDERED",
    "permutation_entropy_pctile": 0.12,
    "hmm_state": "TRENDING",
    "hmm_confidence": 0.81,
    "dominant_freq_level": "32min",
    "wavelet_emu_agree": true,
    "hawkes_branching_ratio": 0.61,
    "copula_tail_dependence": 0.31,
    "hub_stock": "RELIANCE",
    "granger_hub_stock": "HDFC_BANK",
    "participant_signature": "FII_VS_RETAIL",
    "vov_level": "NORMAL",
    "autocorr_flag": "NORMAL",
    "bayesian_garch_vol_p10": 0.142,
    "bayesian_garch_vol_p50": 0.168,
    "bayesian_garch_vol_p90": 0.203,
    "figarch_d": 0.34,
    "jump_variance_fraction": 0.08,
    "jump_regime": false
  },

  "options_structure": {
    "atm_vrp": 3.8,
    "atm_vrp_pctile": 0.72,
    "iv_rank": 0.73,
    "iv_percentile": 0.81,
    "risk_reversal_25d": -2.8,
    "risk_reversal_trend": "STEEPENING",
    "pcp_deviation_atm": 0.18,
    "pcp_flag": "NORMAL",
    "garch_signal": "SELL_PREMIUM",
    "figarch_signal": "SELL_PREMIUM",
    "iv_term_slope": 1.08,
    "iv_term_flag": "BALANCED",
    "vol_smile_entropy": 2.31,
    "max_pain_level": 24200,
    "max_pain_gradient_flag": "MODERATE",
    "fibgacs_score": 0.73,
    "fib_time_zone_bars_to_next": 3,
    "vpin": 0.42,
    "amihud_ratio_pctile": 0.38,
    "roll_spread_pctile": 0.29,
    "evt_tail_index": 0.22,
    "evt_tail_trend": "STABLE",
    "realized_skew": -0.31,
    "implied_skew": -0.45,
    "bns_jump_fraction": 0.08
  },

  "session_context": {
    "orb_width_atr_multiple": 0.84,
    "day_type_probability": {"TREND": 0.61, "RANGE": 0.27, "CHOPPY": 0.12},
    "vsa_spread_body_ratio_last": 1.4,
    "vsa_flag": "NORMAL"
  },

  "ml_signals": {
    "chronos_direction": "UP",
    "chronos_uncertainty": 0.18,
    "chronos_usable": true,
    "kronos_direction": "UP",
    "kronos_coverage": 0.61,
    "kronos_usable": true,
    "archetype_id": 3,
    "archetype_match_distance": 0.041,
    "archetype_p30_mean": 0.0021,
    "path_sig_xgb_prob_up": 0.67,
    "faiss_nn50_mean_15min": 0.0034,
    "faiss_nn50_std_15min": 0.0022,
    "entropy_cascade_flag": false,
    "transfer_entropy_fii": 0.31,
    "te_fii_predictive": true
  },

  "proposed_trade": {
    "action": "LONG",
    "instrument": "NIFTY26JUN24350CE",
    "strategy_type": "MOMENTUM",
    "entry_price_limit": 85.50,
    "stop_loss": 58.00,
    "target_price": 135.00,
    "lots": 1,
    "lot_size": 65,
    "execution_schedule": [
      {"at_minutes": 0, "lots": 1, "limit_price": 85.50}
    ],
    "post_cost_ev_pct": 0.28,
    "semivariance_kelly_fraction": 0.18,
    "supporting_signals": ["NEGATIVE_GEX", "HURST_TRENDING", "HIGH_IV_RANK"],
    "contradicting_signals": ["RISK_REVERSAL_STEEPENING", "CHARM_EXPOSURE_NEGATIVE"],
    "reasoning_code": "NEG_GEX_MOMENTUM_HIGH_IVRANK_CONFIRMED"
  },

  "risk_flags": {
    "trading_locked": false,
    "daily_loss_consumed_pct": 0.12,
    "t1_expiry_risk": false,
    "jump_regime": false,
    "chaos_state": false,
    "change_point_recent": false,
    "all_clear": true
  },

  "data_freshness": {
    "option_chain_age_sec": 420,
    "pwoi_age_hours": 18.3,
    "homology_age_sec": 58,
    "hawkes_age_sec": 112,
    "path_sig_age_sec": 180,
    "overall": "ALL_FRESH"
  }
}
```

---

## HOW GPT AND CLAUDE USE THE PACKET

They check four things in order:
1. `risk_flags.all_clear` is true
2. `data_freshness.overall` is not `CRITICAL_STALENESS`
3. `proposed_trade.action` is not `NONE`
4. `proposed_trade.post_cost_ev_pct` > 0

If all four pass, they convert packet fields into an OpenAlgo webhook limit order
plus simultaneous stop-loss. They write the full exchange to the SEBI audit log.
Nothing else. No analysis. No overrides. No added directional view.

---

## POST-COST EV — IN OPTION PREMIUM UNITS

```
costs_per_lot =
    STT: 0.10% × entry_premium × lot_size
    Exchange fee: 0.035% × entry_premium × lot_size
    Brokerage: ₹20 flat
    GST: 18% × (brokerage + exchange_fee)
    Slippage: 0.07% × entry_premium × lot_size

ev_pct_of_premium = (gross_ev − costs_per_lot/lot_size) / entry_premium
signal valid only if ev_pct_of_premium > 0
```

Month 1 before win rates exist: cost-coverage check only:
`(target_premium − entry_premium) > (total_costs × 2.0)`

---

## COMPLIANCE

- Static IPv4 Mumbai VPS for all order-placement
- All orders LIMIT only — market orders rejected at exchange gateway
- 10 OPS leaky bucket — emergency orders priority 0, stop-loss priority 1, entry priority 2
- All LLM calls permanently logged — SEBI audit requirement
- OpenAlgo handles 3 AM IST daily session token refresh
- Algo identifier tag per order — verify format with Zerodha developer docs at build time

---

## PHASE 1 — FOUNDATION
*Get every confirmed data source flowing and every standard signal computing
every minute. The system gains complete sensory coverage of the market.*

The complete infrastructure comes online: TimescaleDB with hypertables, Redis,
Celery workers, OpenAlgo forked and configured for Zerodha, exchange_calendars
for authoritative NSE market hours and holidays — all in one `docker compose up`.
`get_lot_size(instrument, date)` is the first function written. The contract
master pulls from Zerodha's instrument API daily at session start, resolving lot
sizes, expiry dates, weekday assignments, and strike universes without any
hardcoding.

Every historical source downloads in full with a checkpoint/resume file so
nothing is lost on interruption: daily OHLCV from the late 1990s, 1-minute
OHLCV from January 2015 in 59-day windows, hourly OHLCV from January 2015 in
390-day windows, NSE Bhavcopy archive from June 2001 with a three-window parser
(legacy through June 20, dual format June 21–July 5, exclusive UDiFF from July
6). Every historical row carries the exact lot size from the epoch table.

Daily appenders run every evening for Bhavcopy, PWOI, VIX, and Market Activity
PDF. The NSE option chain is polled every 15 minutes with freshness timestamps
captured per strike. The WebSocket maintains approximately 135 dynamically
rotating tokens. The data validation pipeline fires Telegram alerts on any feed
failure.

The intraday OI logger runs from day one before anything else — 60-second
polling of all Nifty options within ±500 points of ATM. NSE does not archive
this retroactively. Every missed day is permanent data loss.

Standard signals computing every minute from day one: GEX with gradient,
acceleration, and per-constituent maps, Charm Exposure, Vega Exposure, DAOI,
Max Pain with gradient strength, full SVI vol surface with Durrleman g(k) ≥ 0,
Greeks through Speed and Color, VRP surface, IV Rank, IV Percentile, Risk
Reversal, Put-Call Parity Deviation, Yang-Zhang and Rogers-Satchell realized
vol, Realized Kernel Estimator, FIGARCH d parameter, BNS jump-variance fraction,
multi-timescale Hurst, intraday-seasonality-adjusted versions of all signals,
cumulative delta, Kyle's lambda by time-of-day bucket, VPIN, Fibonacci levels
and time zones, FiGaCS, Amihud illiquidity, Roll's implicit spread, Variance
Ratio Test at four horizons, Participant Flow Signature, realized higher moments,
Opening Range Breakout quantification, VSA Spread-to-Body Ratio, and the
cointegration-stationarity gate.

Alphalens-reloaded runs IC analysis on every signal candidate before any signal
is admitted to the live packet.

---

## PHASE 2 — INTELLIGENCE
*Add all 30 novel signals, every ML model, the path signature engine, and the
full Bayesian stack. The system goes from seeing the market to understanding it
at a depth no Indian retail system has reached.*

All novel signals come online including the seven new additions: BNS Jump
decomposition, IV Rank/Percentile, Risk Reversal, Put-Call Parity Deviation,
GEX per constituent, Opening Range Breakout quantification, and VSA
Spread-to-Body Ratio. The Granger causality network joins the constituent
centrality analysis. Heavy signals run as Celery workers.

The full ML layer: Bayesian GJR-GARCH and FIGARCH via PyMC (full posterior, not
a point estimate), HMM with Hidden Semi-Markov capability via pomegranate>=1.0.0
(PyTorch backend, GPU-accelerated, handles missing data), Kronos (patched with
all four fixes, fine-tuned on post-reform Nifty data under NEAR_EXPIRY /
NORMAL_SESSION split derived from the live contract master), Chronos-2 (base
model immediately, fine-tuning deferred until Month 6 when >100 post-reform
hourly series exist), statsforecast and neuralforecast as ensemble components,
variational autoencoder + FAISS for empirical conditional return distribution,
XGBoost + LightGBM meta-learner on the full signal stack including path
signature features, SHAP attribution, Optuna Bayesian optimization, custom
combinatorial purged cross-validation, MAPIE conformal prediction intervals on
meta-learner output.

DoWhy validates causality. EconML identifies regime-varying signal strength.
GPy provides Gaussian Process interpolation of the vol surface with uncertainty.
Microsoft qlib evaluates all 30 signals through its standardized alpha mining
pipeline.

Almgren-Chriss optimal execution schedule fitted from historical Kyle's lambda.
Every proposed trade includes a multi-child-order execution plan.

The packet assembles every minute. Bayesian Network regime fusion in one
coherent posterior. Every field freshness-timestamped. All LLM calls logged. A
human-review dashboard presents each proposed trade with full signal attribution
— no automated execution yet.

---

## PHASE 3 — EXECUTION AND AUTONOMY
*Trade real capital. Earn automation one signal type at a time. Run
self-improvement indefinitely without supervision.*

The hardcoded risk layer sits in front of every order. Cannot be overridden:
daily loss limit, GEX flip-zone proximity, VoV gate, loss autocorrelation
(Fuller-corrected), chaos state (Lyapunov), change-point recency, BNS jump
regime flag (blocks mean-reversion strategies during jump periods), and T-1
forced close for calendar spread legs derived dynamically from the live contract
master.

All orders route through OpenAlgo via static Mumbai VPS. 10 OPS leaky bucket.
Execution follows the Almgren-Chriss child order schedule. Child orders placed
over 5-15 minutes to minimize slippage.

Automation earned per signal type: positive 30-session walk-forward Sharpe,
positive SHAP contribution over 50+ trades, Bonferroni-significant win rate.
Automation revoked when rolling performance turns negative.

Self-improvement without intervention:
- **Daily 7 PM:** Bhavcopy + PWOI download, GEX baseline update, GARCH update
  with new observation, FIGARCH d parameter update, ADWIN drift checks, Telegram summary.
- **Weekly Saturday 9 AM:** LASSO signal reselection, FAISS index rebuild, HMM
  refit, VectorBT 30-session walk-forward, tsbootstrap confidence intervals,
  Optuna re-optimization, alphalens IC decay analysis, Bonferroni display.
- **Monthly (first Saturday after expiry):** Kronos fine-tuning (both models),
  Chronos-2 fine-tuning from Month 6, autoencoder retraining, Matrix Profile
  archetype library rebuild, qlib alpha mining re-evaluation, BNS jump fraction
  baseline recalibration, Kyle's lambda time-bucket recalibration, 3-month
  out-of-sample VectorBT, SEBI audit log summary.

Before first live order — all integration tests must pass:
- SVI rejects Durrleman-violating parameters, falls back correctly
- `get_lot_size('NIFTY50', date(2026,6,23))` returns 65
- `get_lot_size('NIFTY50', date(2024,10,1))` returns 25
- Bank Nifty monthly expiry resolves to last Tuesday from live instrument master
- T-1 forced close fires at correct time from live contract master
- `TRADING_LOCKED` file blocks all OpenAlgo webhooks
- Loss limit trigger creates lock file, sends close orders, fires CRITICAL
- Three Bhavcopy format windows parse without error
- Volume via cumulative delta subtraction matches broker candle volume within 2%
- BNS jump flag blocks mean-reversion signal during simulated jump period
- SEBI audit log records full LLM interaction end-to-end
- 15 simultaneous fake orders: first 10 execute, next 5 queue at bucket

---

## WHERE TO START — EXACT SEQUENCE

1. `oi_logger.py` — today, before anything else. Irreplaceable.
2. `constants.py` — `get_lot_size(instrument, date)`. First function.
3. `docker-compose.yml` — TimescaleDB, Redis, Celery, OpenAlgo. One command.
4. `zerodha_history.py` — backward pagination with checkpoint/resume.
5. `nse_bhavcopy_historical.py` — one-time bulk download, three-window parser.
6. All remaining Phase 1 data sources and standard signals.
7. Phase 2 novel signals, ML models, packet assembly.
8. Phase 3 risk layer, execution, and self-improvement loop.

---

## WHAT THIS COMPUTES THAT NO INDIAN RETAIL SYSTEM DOES

BNS jump-variance decomposition — whether price moved by diffusion or discrete jumps.
IV Rank and IV Percentile — where current IV stands historically, both measures.
Risk Reversal (25-delta skew) — institutional directional hedging signal.
Put-Call Parity deviation monitoring — real-time option chain health check.
GEX per constituent — whether index and component gamma walls align.
Opening Range Breakout quantification — day-type probability from first 15 minutes.
VSA Spread-to-Body Ratio — institutional absorption/distribution detection.
FIGARCH long-memory volatility — how long shocks actually persist, not assumed.
Realized Kernel Estimator — microstructure-noise-robust vol at 1-minute frequency.
Rough volatility H estimation — how rough is vol right now.
Bayesian posterior over all volatility parameters.
Granger causality network — which constituent actually causes index moves.
Path signatures at Level-3 — geometric characterization of price-volume paths.
Charm Exposure — time-driven dealer flows near Tuesday and Thursday expiry.
Vega Exposure — whether VIX spikes amplify or dampen price moves.
DAOI — net directional bet of all option market participants.
Almgren-Chriss execution schedule — optimal order splitting to minimize slippage.
Variance Ratio Test at four simultaneous horizons.
Intraday seasonality adjustment on all signals.
Full qlib alpha mining pipeline — every signal through one rigorous standard.
Bayesian Network regime fusion — one posterior replacing ad hoc rule stacking.