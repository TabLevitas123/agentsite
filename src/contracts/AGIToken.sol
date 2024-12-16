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
 * @dev Implementation of the Agent X AI Token
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
    ) ERC20("Agent X AI", "$AgentX") {
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

    // Rest of the contract implementation remains unchanged
    // ...
}
