// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract AGIToken is ERC20, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    uint256 public constant TOTAL_SUPPLY = 100_000_000 * 10**18; // 100M tokens

    // Token distribution
    uint256 public constant TEAM_ALLOCATION = 15_000_000 * 10**18;     // 15%
    uint256 public constant MARKETING_ALLOCATION = 10_000_000 * 10**18; // 10%
    uint256 public constant LIQUIDITY_ALLOCATION = 25_000_000 * 10**18; // 25%
    uint256 public constant USER_REWARDS = 20_000_000 * 10**18;        // 20%
    uint256 public constant STAKING_REWARDS = 20_000_000 * 10**18;     // 20%
    uint256 public constant OPEN_SALE = 10_000_000 * 10**18;          // 10%

    // Tax configuration
    uint256 public marketingTaxBPS = 200;  // 2%
    uint256 public devTaxBPS = 100;        // 1%
    uint256 public liquidityTaxBPS = 200;  // 2%
    uint256 public constant MAX_TAX_BPS = 500; // 5% max total tax
    uint256 public constant BPS_DENOMINATOR = 10000;

    // Anti-whale configuration
    uint256 public maxTransactionAmount;    // Maximum amount per transaction
    uint256 public maxWalletAmount;         // Maximum amount per wallet
    uint256 public tradingCooldown;         // Cooldown period between trades
    mapping(address => uint256) public lastTradeTime;

    // Auto-liquidity configuration
    uint256 public autoLiquidityThreshold;  // Threshold for auto-liquidity generation
    uint256 public totalLiquidityGenerated;
    
    // Auto-burn configuration
    bool public autoBurnEnabled;
    uint256 public burnRateBPS = 50;        // 0.5% auto-burn rate
    uint256 public totalBurned;

    // Wallet addresses
    address public marketingWallet = address(0x1111111111111111111111111111111111111111);
    address public devWallet = address(0x2222222222222222222222222222222222222222);
    address public liquidityWallet = address(0x3333333333333333333333333333333333333333);
    address public constant DEAD_WALLET = address(0x000000000000000000000000000000000000dEaD);
    
    // Team wallet addresses (60/40 split)
    address public teamWallet1 = address(0x4444444444444444444444444444444444444444); // 60%
    address public teamWallet2 = address(0x5555555555555555555555555555555555555555); // 40%

    // Other allocation addresses
    address public userRewardsWallet = address(0x6666666666666666666666666666666666666666);
    address public stakingRewardsWallet = address(0x7777777777777777777777777777777777777777);
    address public openSaleWallet = address(0x8888888888888888888888888888888888888888);

    // Security mappings
    mapping(address => bool) public isExcludedFromTax;
    mapping(address => bool) public isExcludedFromLimits;
    mapping(address => bool) public isBlacklisted;

    // Trading status
    bool public tradingEnabled;

    // Events
    event TaxWalletsUpdated(address marketing, address dev, address liquidity);
    event TaxRatesUpdated(uint256 marketing, uint256 dev, uint256 liquidity);
    event TaxExclusionUpdated(address account, bool excluded);
    event LimitsUpdated(uint256 maxTx, uint256 maxWallet);
    event TradingStatusUpdated(bool enabled);
    event AddressBlacklisted(address account, bool blacklisted);
    event AutoBurnStatusUpdated(bool enabled, uint256 rate);
    event TokensBurned(uint256 amount);
    event AutoLiquidityGenerated(uint256 amount);
    event EmergencyWithdraw(address token, uint256 amount);

    constructor() ERC20("Agentic General Intelligence", "AGI") {
        // Set initial limits
        maxTransactionAmount = TOTAL_SUPPLY.mul(1).div(100);   // 1% max transaction
        maxWalletAmount = TOTAL_SUPPLY.mul(2).div(100);        // 2% max wallet
        tradingCooldown = 60;                                  // 60 second cooldown
        autoLiquidityThreshold = TOTAL_SUPPLY.mul(1).div(1000); // 0.1% threshold

        // Initial exclusions
        isExcludedFromTax[address(this)] = true;
        isExcludedFromTax[owner()] = true;
        isExcludedFromLimits[address(this)] = true;
        isExcludedFromLimits[owner()] = true;

        // Exclude key wallets from taxes and limits
        address[9] memory excludedAddresses = [
            marketingWallet, devWallet, liquidityWallet,
            teamWallet1, teamWallet2, userRewardsWallet,
            stakingRewardsWallet, openSaleWallet, DEAD_WALLET
        ];

        for (uint256 i = 0; i < excludedAddresses.length; i++) {
            isExcludedFromTax[excludedAddresses[i]] = true;
            isExcludedFromLimits[excludedAddresses[i]] = true;
        }

        // Mint and distribute initial supply
        _mint(address(this), TOTAL_SUPPLY);
        
        // Distribute team allocation (60/40 split)
        _transfer(address(this), teamWallet1, TEAM_ALLOCATION.mul(60).div(100));
        _transfer(address(this), teamWallet2, TEAM_ALLOCATION.mul(40).div(100));
        
        // Distribute other allocations
        _transfer(address(this), marketingWallet, MARKETING_ALLOCATION);
        _transfer(address(this), liquidityWallet, LIQUIDITY_ALLOCATION);
        _transfer(address(this), userRewardsWallet, USER_REWARDS);
        _transfer(address(this), stakingRewardsWallet, STAKING_REWARDS);
        _transfer(address(this), openSaleWallet, OPEN_SALE);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        require(sender != address(0), "Transfer from zero address");
        require(recipient != address(0), "Transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        require(!isBlacklisted[sender] && !isBlacklisted[recipient], "Address is blacklisted");
        
        // Check trading status
        if (!isExcludedFromLimits[sender] && !isExcludedFromLimits[recipient]) {
            require(tradingEnabled, "Trading not enabled");
        }

        // Apply transfer limits
        if (!isExcludedFromLimits[sender] && !isExcludedFromLimits[recipient]) {
            require(amount <= maxTransactionAmount, "Amount exceeds max transaction");
            require(balanceOf(recipient).add(amount) <= maxWalletAmount, "Amount exceeds max wallet");
            
            // Apply trading cooldown
            if (lastTradeTime[sender] > 0) {
                require(block.timestamp >= lastTradeTime[sender] + tradingCooldown, "Cooldown active");
            }
            lastTradeTime[sender] = block.timestamp;
        }

        // Calculate and apply taxes
        if (!isExcludedFromTax[sender] && !isExcludedFromTax[recipient]) {
            uint256 marketingTax = amount.mul(marketingTaxBPS).div(BPS_DENOMINATOR);
            uint256 devTax = amount.mul(devTaxBPS).div(BPS_DENOMINATOR);
            uint256 liquidityTax = amount.mul(liquidityTaxBPS).div(BPS_DENOMINATOR);
            uint256 totalTax = marketingTax.add(devTax).add(liquidityTax);

            // Auto-burn if enabled
            if (autoBurnEnabled) {
                uint256 burnAmount = amount.mul(burnRateBPS).div(BPS_DENOMINATOR);
                super._transfer(sender, DEAD_WALLET, burnAmount);
                totalBurned = totalBurned.add(burnAmount);
                totalTax = totalTax.add(burnAmount);
                emit TokensBurned(burnAmount);
            }

            uint256 transferAmount = amount.sub(totalTax);

            // Transfer taxes
            super._transfer(sender, marketingWallet, marketingTax);
            super._transfer(sender, devWallet, devTax);
            super._transfer(sender, liquidityWallet, liquidityTax);

            // Check auto-liquidity threshold
            if (balanceOf(liquidityWallet) >= autoLiquidityThreshold) {
                generateAutoLiquidity();
            }

            // Transfer remaining amount
            super._transfer(sender, recipient, transferAmount);
        } else {
            super._transfer(sender, recipient, amount);
        }
    }

    // Auto-liquidity generation
    function generateAutoLiquidity() internal {
        uint256 amount = balanceOf(liquidityWallet);
        totalLiquidityGenerated = totalLiquidityGenerated.add(amount);
        emit AutoLiquidityGenerated(amount);
        // Implementation would interact with DEX to add liquidity
    }

    // Admin functions
    function setTaxWallets(
        address _marketingWallet,
        address _devWallet,
        address _liquidityWallet
    ) external onlyOwner {
        require(_marketingWallet != address(0), "Invalid marketing wallet");
        require(_devWallet != address(0), "Invalid dev wallet");
        require(_liquidityWallet != address(0), "Invalid liquidity wallet");

        marketingWallet = _marketingWallet;
        devWallet = _devWallet;
        liquidityWallet = _liquidityWallet;

        emit TaxWalletsUpdated(_marketingWallet, _devWallet, _liquidityWallet);
    }

    function setTaxRates(
        uint256 _marketingTaxBPS,
        uint256 _devTaxBPS,
        uint256 _liquidityTaxBPS
    ) external onlyOwner {
        require(_marketingTaxBPS.add(_devTaxBPS).add(_liquidityTaxBPS) <= MAX_TAX_BPS, 
                "Total tax exceeds maximum");

        marketingTaxBPS = _marketingTaxBPS;
        devTaxBPS = _devTaxBPS;
        liquidityTaxBPS = _liquidityTaxBPS;

        emit TaxRatesUpdated(_marketingTaxBPS, _devTaxBPS, _liquidityTaxBPS);
    }

    function setLimits(
        uint256 _maxTx,
        uint256 _maxWallet
    ) external onlyOwner {
        require(_maxTx <= TOTAL_SUPPLY.mul(5).div(100), "Max tx too high");
        require(_maxWallet <= TOTAL_SUPPLY.mul(5).div(100), "Max wallet too high");
        
        maxTransactionAmount = _maxTx;
        maxWalletAmount = _maxWallet;
        
        emit LimitsUpdated(_maxTx, _maxWallet);
    }

    function setTradingStatus(bool _enabled) external onlyOwner {
        tradingEnabled = _enabled;
        emit TradingStatusUpdated(_enabled);
    }

    function setBlacklistStatus(address account, bool blacklisted) external onlyOwner {
        require(account != address(0), "Invalid address");
        isBlacklisted[account] = blacklisted;
        emit AddressBlacklisted(account, blacklisted);
    }

    function setAutoBurnStatus(bool _enabled, uint256 _rateBPS) external onlyOwner {
        require(_rateBPS <= 1000, "Burn rate too high"); // Max 10%
        autoBurnEnabled = _enabled;
        if (_enabled) {
            burnRateBPS = _rateBPS;
        }
        emit AutoBurnStatusUpdated(_enabled, _rateBPS);
    }

    function setTaxExclusion(address account, bool excluded) external onlyOwner {
        require(account != address(0), "Invalid address");
        isExcludedFromTax[account] = excluded;
        emit TaxExclusionUpdated(account, excluded);
    }

    // Emergency functions
    function emergencyWithdraw(address token) external onlyOwner {
        require(token != address(this), "Cannot withdraw AGI tokens");
        uint256 amount = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(owner(), amount);
        emit EmergencyWithdraw(token, amount);
    }

    // View functions
    function getTaxRates() external view returns (uint256, uint256, uint256) {
        return (marketingTaxBPS, devTaxBPS, liquidityTaxBPS);
    }

    function getTotalTaxBPS() external view returns (uint256) {
        return marketingTaxBPS.add(devTaxBPS).add(liquidityTaxBPS);
    }

    function getTokenomics() external view returns (
        uint256 burned,
        uint256 liquidityGen,
        uint256 maxTx,
        uint256 maxWallet
    ) {
        return (
            totalBurned,
            totalLiquidityGenerated,
            maxTransactionAmount,
            maxWalletAmount
        );
    }
}
