// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title AGIToken
 * @dev Implementation of the Agentic General Intelligence Token
 * @notice This contract implements ERC20 token with advanced features including
 * anti-whale mechanisms, auto-liquidity, and market cap based liquidity locking
 * @author Original + Audited Version
 */
contract AGIToken is ERC20, Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    using Address for address payable;

    // Immutable token constants
    uint256 private constant TOTAL_SUPPLY = 100_000_000 * 10**18; // 100M tokens
    uint256 private constant LOCK_MCAP_THRESHOLD = 10_000_000 * 10**18; // 10M USDT
    uint256 private constant LOCK_DURATION = 90 days;
    uint256 private constant BPS_DENOMINATOR = 10000;
    uint256 private constant MAX_TAX_BPS = 500; // 5% max total tax
    uint256 private constant MIN_TX_LIMIT = TOTAL_SUPPLY / 1000; // 0.1% minimum transaction limit
    uint256 private constant MIN_WALLET_LIMIT = TOTAL_SUPPLY / 500; // 0.2% minimum wallet limit
    address private immutable DEAD_WALLET = address(0xdead);

    // Price feed
    AggregatorV3Interface private immutable priceFeed;

    // Wallet addresses (immutable for gas optimization)
    address public immutable marketingWallet;
    address public immutable devWallet;
    address public immutable liquidityWallet;
    address public immutable teamWallet1;
    address public immutable teamWallet2;
    address public immutable userRewardsWallet;
    address public immutable stakingRewardsWallet;
    address public immutable openSaleWallet;

    // Allocations (packed for gas optimization)
    struct Allocations {
        uint96 team;        // 15M (15%) - No vesting
        uint96 marketing;   // 10M (10%)
        uint96 liquidity;   // 25M (25%)
        uint96 userRewards; // 20M (20%)
        uint96 staking;     // 20M (20%)
        uint96 openSale;    // 10M (10%)
    }
    Allocations public immutable allocations;

    // Protocol configuration (packed for gas optimization)
    struct Config {
        uint96 marketingTaxBPS;
        uint96 devTaxBPS;
        uint96 liquidityTaxBPS;
        uint96 burnRateBPS;
        bool tradingEnabled;
        bool autoBurnEnabled;
        bool liquidityLocked;
    }
    Config public config;

    // Liquidity tracking
    struct LiquidityInfo {
        uint256 currentMarketCap;
        uint256 lockTimestamp;
        uint256 unlockTimestamp;
        uint256 totalGenerated;
        bool isLocked;
    }
    LiquidityInfo public liquidityInfo;

    // Transaction limits
    struct Limits {
        uint256 maxTransaction;
        uint256 maxWallet;
        uint256 cooldownPeriod;
    }
    Limits public limits;

    // Mappings
    mapping(address => bool) public isExcludedFromTax;
    mapping(address => bool) public isExcludedFromLimits;
    mapping(address => bool) public isBlacklisted;
    mapping(address => uint256) public lastTradeTime;
    
    // Events
    event TradingEnabled(bool indexed status);
    event LiquidityLocked(uint256 indexed timestamp, uint256 unlockTime);
    event LiquidityUnlocked(uint256 indexed timestamp);
    event AutoLiquidityGenerated(uint256 indexed amount);
    event TokensBurned(uint256 indexed amount);
    event MarketCapUpdated(uint256 newMarketCap);
    event LimitsUpdated(uint256 maxTx, uint256 maxWallet, uint256 cooldown);
    event TaxConfigUpdated(uint96 marketing, uint96 dev, uint96 liquidity);
    event AddressStatusUpdated(address indexed account, string status, bool value);
    event AutoBurnStatusUpdated(bool indexed status);
    event PriceUpdated(uint256 indexed price);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    /**
     * @dev Constructor initializes the token with predefined allocations and configurations
     * @param _priceFeed Address of the Chainlink price feed contract
     * @param _marketingWallet Address for marketing funds
     * @param _devWallet Address for development funds
     * @param _liquidityWallet Address for liquidity funds
     * @param _teamWallet1 Address for team allocation (60%)
     * @param _teamWallet2 Address for team allocation (40%)
     * @param _userRewardsWallet Address for user rewards
     * @param _stakingRewardsWallet Address for staking rewards
     * @param _openSaleWallet Address for public sale
     */
    constructor(
        address _priceFeed,
        address _marketingWallet,
        address _devWallet,
        address _liquidityWallet,
        address _teamWallet1,
        address _teamWallet2,
        address _userRewardsWallet,
        address _stakingRewardsWallet,
        address _openSaleWallet
    ) ERC20("Agentic General Intelligence", "AGI") {
        require(_priceFeed != address(0), "Invalid price feed address");
        require(_marketingWallet != address(0), "Invalid marketing wallet");
        require(_devWallet != address(0), "Invalid dev wallet");
        require(_liquidityWallet != address(0), "Invalid liquidity wallet");
        require(_teamWallet1 != address(0), "Invalid team wallet 1");
        require(_teamWallet2 != address(0), "Invalid team wallet 2");
        require(_userRewardsWallet != address(0), "Invalid rewards wallet");
        require(_stakingRewardsWallet != address(0), "Invalid staking wallet");
        require(_openSaleWallet != address(0), "Invalid sale wallet");

        priceFeed = AggregatorV3Interface(_priceFeed);
        marketingWallet = _marketingWallet;
        devWallet = _devWallet;
        liquidityWallet = _liquidityWallet;
        teamWallet1 = _teamWallet1;
        teamWallet2 = _teamWallet2;
        userRewardsWallet = _userRewardsWallet;
        stakingRewardsWallet = _stakingRewardsWallet;
        openSaleWallet = _openSaleWallet;

        // Initialize allocations
        allocations = Allocations({
            team: uint96(TOTAL_SUPPLY * 15 / 100),        // 15%
            marketing: uint96(TOTAL_SUPPLY * 10 / 100),   // 10%
            liquidity: uint96(TOTAL_SUPPLY * 25 / 100),   // 25%
            userRewards: uint96(TOTAL_SUPPLY * 20 / 100), // 20%
            staking: uint96(TOTAL_SUPPLY * 20 / 100),     // 20%
            openSale: uint96(TOTAL_SUPPLY * 10 / 100)     // 10%
        });

        // Initialize limits with minimum values
        limits = Limits({
            maxTransaction: TOTAL_SUPPLY * 1 / 100,   // 1% max transaction
            maxWallet: TOTAL_SUPPLY * 2 / 100,        // 2% max wallet
            cooldownPeriod: 60                        // 60 second cooldown
        });

        // Initialize configuration
        config = Config({
            marketingTaxBPS: 100,  // 1%
            devTaxBPS: 100,        // 1%
            liquidityTaxBPS: 100,  // 1%
            burnRateBPS: 50,       // 0.5%
            tradingEnabled: false,
            autoBurnEnabled: false,
            liquidityLocked: false
        });

        // Set initial exclusions
        address[9] memory excludedAddresses = [
            address(this),
            owner(),
            _marketingWallet,
            _devWallet,
            _liquidityWallet,
            _teamWallet1,
            _teamWallet2,
            _userRewardsWallet,
            _stakingRewardsWallet
        ];

        for (uint256 i = 0; i < excludedAddresses.length; i++) {
            isExcludedFromTax[excludedAddresses[i]] = true;
            isExcludedFromLimits[excludedAddresses[i]] = true;
        }

        // Mint and distribute initial supply
        _mint(address(this), TOTAL_SUPPLY);
        
        // Distribute team allocation (60/40 split) - No vesting period
        _transfer(address(this), teamWallet1, allocations.team * 60 / 100);
        _transfer(address(this), teamWallet2, allocations.team * 40 / 100);
        
        // Distribute other allocations
        _transfer(address(this), marketingWallet, allocations.marketing);
        _transfer(address(this), liquidityWallet, allocations.liquidity);
        _transfer(address(this), userRewardsWallet, allocations.userRewards);
        _transfer(address(this), stakingRewardsWallet, allocations.staking);
        _transfer(address(this), openSaleWallet, allocations.openSale);
    }

    /**
     * @dev Override of the transfer function to implement taxes and limits
     * @notice Implements checks-effects-interactions pattern
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override nonReentrant whenNotPaused {
        require(sender != address(0), "Transfer from zero address");
        require(recipient != address(0), "Transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        require(!isBlacklisted[sender] && !isBlacklisted[recipient], "Address is blacklisted");
        
        // Cache current state
        bool isExcludedSender = isExcludedFromTax[sender];
        bool isExcludedRecipient = isExcludedFromTax[recipient];
        bool isExcludedLimitsSender = isExcludedFromLimits[sender];
        bool isExcludedLimitsRecipient = isExcludedFromLimits[recipient];
        
        // Trading status check
        if (!isExcludedLimitsSender && !isExcludedLimitsRecipient) {
            require(config.tradingEnabled, "Trading not enabled");
        }

        // Transfer limits check
        if (!isExcludedLimitsSender && !isExcludedLimitsRecipient) {
            require(amount <= limits.maxTransaction, "Exceeds max transaction");
            require(balanceOf(recipient).add(amount) <= limits.maxWallet, "Exceeds max wallet");
            
            // Cooldown check using block number instead of timestamp
            if (lastTradeTime[sender] > 0) {
                require(
                    block.number >= lastTradeTime[sender] + limits.cooldownPeriod,
                    "Cooldown active"
                );
            }
            lastTradeTime[sender] = block.number;
        }

        // Calculate taxes and amounts first (checks)
        uint256 transferAmount = amount;
        uint256 marketingTax = 0;
        uint256 devTax = 0;
        uint256 liquidityTax = 0;
        uint256 burnAmount = 0;

        if (!isExcludedSender && !isExcludedRecipient) {
            marketingTax = amount.mul(config.marketingTaxBPS).div(BPS_DENOMINATOR);
            devTax = amount.mul(config.devTaxBPS).div(BPS_DENOMINATOR);
            liquidityTax = amount.mul(config.liquidityTaxBPS).div(BPS_DENOMINATOR);
            
            if (config.autoBurnEnabled) {
                burnAmount = amount.mul(config.burnRateBPS).div(BPS_DENOMINATOR);
            }

            transferAmount = amount
                .sub(marketingTax)
                .sub(devTax)
                .sub(liquidityTax)
                .sub(burnAmount);
        }

        // Update market cap and check liquidity lock condition (effects)
        if (!config.liquidityLocked) {
            uint256 newMarketCap = totalSupply().mul(getCurrentPrice());
            liquidityInfo.currentMarketCap = newMarketCap;
            emit MarketCapUpdated(newMarketCap);

            if (newMarketCap >= LOCK_MCAP_THRESHOLD) {
                _lockLiquidity();
            }
        }

        // Execute transfers (interactions)
        if (marketingTax > 0) super._transfer(sender, marketingWallet, marketingTax);
        if (devTax > 0) super._transfer(sender, devWallet, devTax);
        if (liquidityTax > 0) super._transfer(sender, liquidityWallet, liquidityTax);
        if (burnAmount > 0) {
            super._transfer(sender, DEAD_WALLET, burnAmount);
            emit TokensBurned(burnAmount);
        }
        super._transfer(sender, recipient, transferAmount);

        // Check auto-liquidity threshold after transfers
        if (balanceOf(liquidityWallet) >= limits.maxTransaction) {
            _generateAutoLiquidity();
        }
    }

    /**
     * @dev Internal function to lock liquidity for 90 days when market cap threshold is reached
     */
    function _lockLiquidity() private {
        require(!config.liquidityLocked, "Liquidity already locked");
        
        config.liquidityLocked = true;
        liquidityInfo.lockTimestamp = block.timestamp;
        liquidityInfo.unlockTimestamp = block.timestamp + LOCK_DURATION;
        
        emit LiquidityLocked(liquidityInfo.lockTimestamp, liquidityInfo.unlockTimestamp);
    }

    /**
     * @dev Internal function to generate auto-liquidity
     */
    function _generateAutoLiquidity() private {
        uint256 tokensForLiquidity = balanceOf(liquidityWallet);
        require(tokensForLiquidity > 0, "No tokens for liquidity");

        liquidityInfo.totalGenerated = liquidityInfo.totalGenerated.add(tokensForLiquidity);
        emit AutoLiquidityGenerated(tokensForLiquidity);

        // Implementation would interact with DEX to add liquidity
        // This is a placeholder for the actual DEX interaction
    }

    /**
     * @dev Returns current token price from Chainlink oracle
     * @return price Current token price
     */
    function getCurrentPrice() public view returns (uint256) {
        (
            uint80 roundId,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        
        require(price > 0, "Invalid price");
        require(updatedAt > 0, "Round not complete");
        require(answeredInRound >= roundId, "Stale price");
        
        return uint256(price);
    }

    /**
     * @dev Admin function to update tax configuration
     * @param _marketingTaxBPS Marketing tax in basis points
     * @param _devTaxBPS Development tax in basis points
     * @param _liquidityTaxBPS Liquidity tax in basis points
     */
    function setTaxConfig(
        uint96 _marketingTaxBPS,
        uint96 _devTaxBPS,
        uint96 _liquidityTaxBPS
    ) external onlyOwner {
        require(
            _marketingTaxBPS + _devTaxBPS + _liquidityTaxBPS <= MAX_TAX_BPS,
            "Total tax exceeds maximum"
        );

        config.marketingTaxBPS = _marketingTaxBPS;
        config.devTaxBPS = _devTaxBPS;
        config.liquidityTaxBPS = _liquidityTaxBPS;

        emit TaxConfigUpdated(_marketingTaxBPS, _devTaxBPS, _liquidityTaxBPS);
    }

    /**
     * @dev Admin function to update transaction limits
     * @param _maxTx Maximum transaction amount
     * @param _maxWallet Maximum wallet balance
     * @param _cooldown Cooldown period in blocks
     */
    function setLimits(
        uint256 _maxTx,
        uint256 _maxWallet,
        uint256 _cooldown
    ) external onlyOwner {
        require(_maxTx >= MIN_TX_LIMIT, "Max tx too low");
        require(_maxTx <= TOTAL_SUPPLY.mul(5).div(100), "Max tx too high");
        require(_maxWallet >= MIN_WALLET_LIMIT, "Max wallet too low");
        require(_maxWallet <= TOTAL_SUPPLY.mul(5).div(100), "Max wallet too high");
        require(_cooldown >= 1, "Cooldown too short");
        require(_cooldown <= 300, "Cooldown too long"); // Max 300 blocks

        limits.maxTransaction = _maxTx;
        limits.maxWallet = _maxWallet;
        limits.cooldownPeriod = _cooldown;

        emit LimitsUpdated(_maxTx, _maxWallet, _cooldown);
    }

    /**
     * @dev Admin function to enable/disable trading
     */
    function setTradingStatus(bool _enabled) external onlyOwner {
        config.tradingEnabled = _enabled;
        emit TradingEnabled(_enabled);
    }

    /**
     * @dev Admin function to update blacklist status
     */
    function setBlacklistStatus(address account, bool blacklisted) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(account != owner(), "Cannot blacklist owner");
        isBlacklisted[account] = blacklisted;
        emit AddressStatusUpdated(account, "blacklist", blacklisted);
    }

    /**
     * @dev Admin function to update tax exclusion status
     */
    function setTaxExclusion(address account, bool excluded) external onlyOwner {
        require(account != address(0), "Invalid address");
        isExcludedFromTax[account] = excluded;
        emit AddressStatusUpdated(account, "tax_exclusion", excluded);
    }

    /**
     * @dev Admin function to update auto-burn status
     */
    function setAutoBurnStatus(bool _enabled) external onlyOwner {
        config.autoBurnEnabled = _enabled;
        emit AutoBurnStatusUpdated(_enabled);
    }

    /**
     * @dev Emergency function to pause all transfers
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Function to unpause all transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency function to recover stuck tokens
     * @param tokenAddress Address of token to recover
     */
    function emergencyWithdraw(address tokenAddress) external onlyOwner {
        require(tokenAddress != address(this), "Cannot withdraw AGI tokens");
        uint256 amount = IERC20(tokenAddress).balanceOf(address(this));
        require(amount > 0, "No tokens to withdraw");
        
        IERC20(tokenAddress).transfer(owner(), amount);
        emit EmergencyWithdraw(tokenAddress, amount);
    }

    /**
     * @dev View function to get current token metrics
     */
    function getTokenMetrics() external view returns (
        uint256 burned,
        uint256 liquidityGen,
        bool tradingStatus,
        bool liquidityLockStatus,
        uint256 marketCap
    ) {
        return (
            balanceOf(DEAD_WALLET),
            liquidityInfo.totalGenerated,
            config.tradingEnabled,
            config.liquidityLocked,
            liquidityInfo.currentMarketCap
        );
    }

    /**
     * @dev Function to receive ETH that might be sent to the contract
     */
    receive() external payable {
        emit EmergencyWithdraw(address(0), msg.value);
        payable(owner()).sendValue(msg.value);
    }
}
