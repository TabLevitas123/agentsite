// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title AgentNFT
 * @dev Implementation of the Agent NFT contract with marketplace functionality
 * @notice This contract implements ERC721 token with skill management and leasing capabilities
 * @author Original + Audited Version
 */
contract AgentNFT is ERC721, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    using Address for address payable;

    Counters.Counter private _tokenIds;

    // Constants
    uint256 public constant CUSTOM_SKILL_PRICE = 0.03 ether;
    uint256 public constant ITEM_AGI_COST = 0.01 ether; // Equivalent in AGI tokens
    uint256 public constant MARKETPLACE_FEE = 15; // 15%
    uint256 public constant MAX_SKILLS = 50; // Maximum number of skills per agent
    uint256 public constant MAX_CUSTOM_SKILLS = 20; // Maximum number of custom skills per agent
    uint256 public constant MAX_NAME_LENGTH = 100; // Maximum length of agent name
    uint256 public constant MIN_LEASE_PRICE = 0.001 ether; // Minimum lease price

    // Immutable addresses
    IERC20 public immutable agiToken;
    address public immutable devWallet;
    AggregatorV3Interface public immutable ethUsdPriceFeed;

    // Agent struct to store metadata
    struct Agent {
        string name;
        string imageURI;
        string[] skills;
        string[] customSkills;
        string[] selectedItems;  // New field for selected items
        bool isListed;
        uint256 leasePrice;
        uint256 lastLeaseTime;
    }

    // Mapping from token ID to Agent struct
    mapping(uint256 => Agent) public agents;
    
    // Mapping for lease agreements
    mapping(uint256 => address) public activeLeases;

    // Events
    event AgentMinted(uint256 indexed tokenId, address indexed owner, string name, string[] selectedItems);
    event SkillAdded(uint256 indexed tokenId, string skill);
    event CustomSkillRequested(uint256 indexed tokenId, string skillDescription);
    event AgentListed(uint256 indexed tokenId, uint256 price);
    event AgentUnlisted(uint256 indexed tokenId);
    event AgentLeased(uint256 indexed tokenId, address indexed lessee, uint256 price);
    event LeaseEnded(uint256 indexed tokenId, address indexed lessee);
    event EmergencyWithdraw(address indexed token, uint256 amount);
    event PaymentReceived(address indexed from, uint256 amount);

    /**
     * @dev Constructor initializes the NFT contract
     * @param _agiToken Address of the AGI token contract
     * @param _devWallet Address of the dev wallet
     * @param _ethUsdPriceFeed Address of the ETH/USD Chainlink price feed
     */
    constructor(
        address _agiToken,
        address _devWallet,
        address _ethUsdPriceFeed
    ) ERC721("Agentic General Intelligence", "AGI") {
        require(_agiToken != address(0), "Invalid AGI token address");
        require(_devWallet != address(0), "Invalid dev wallet address");
        require(_ethUsdPriceFeed != address(0), "Invalid price feed address");
        
        agiToken = IERC20(_agiToken);
        devWallet = _devWallet;
        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdPriceFeed);
    }

    /**
     * @dev Get the latest ETH/USD price from Chainlink
     */
    function getEthUsdPrice() public view returns (uint256) {
        (, int256 price,,,) = ethUsdPriceFeed.latestRoundData();
        require(price > 0, "Invalid price feed response");
        return uint256(price);
    }

    /**
     * @dev Calculate AGI token amount based on ETH value
     */
    function calculateAgiAmount(uint256 ethValue) public view returns (uint256) {
        uint256 ethUsdPrice = getEthUsdPrice();
        // Convert to AGI tokens with same USD value
        // Assuming AGI token has 18 decimals like ETH
        return (ethValue * ethUsdPrice) / ethUsdPrice;
    }

    /**
     * @dev Mint a new agent NFT
     * @param name Name of the agent
     * @param imageURI URI of the agent's image
     * @param initialSkills Array of initial skills
     * @param selectedItems Array of selected items
     */
    function mintAgent(
        string memory name,
        string memory imageURI,
        string[] memory initialSkills,
        string[] memory selectedItems
    ) public payable nonReentrant whenNotPaused {
        require(bytes(name).length > 0 && bytes(name).length <= MAX_NAME_LENGTH, "Invalid name length");
        require(bytes(imageURI).length > 0, "Image URI required");
        require(initialSkills.length > 0 && initialSkills.length <= MAX_SKILLS, "Invalid skills count");
        
        // Calculate costs
        uint256 agiCost = calculateAgiAmount(ITEM_AGI_COST * selectedItems.length);
        
        // Check ETH payment
        require(msg.value >= CUSTOM_SKILL_PRICE, "Insufficient ETH payment");

        // Transfer AGI tokens to dev wallet
        require(agiToken.transferFrom(msg.sender, devWallet, agiCost), "AGI transfer failed");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        
        agents[newTokenId] = Agent({
            name: name,
            imageURI: imageURI,
            skills: initialSkills,
            customSkills: new string[](0),
            selectedItems: selectedItems,
            isListed: false,
            leasePrice: 0,
            lastLeaseTime: 0
        });

        emit AgentMinted(newTokenId, msg.sender, name, selectedItems);
    }

    /**
     * @dev Add skills to an existing agent
     * @param tokenId ID of the agent
     * @param newSkills Array of new skills to add
     */
    function addSkills(
        uint256 tokenId,
        string[] memory newSkills
    ) public payable nonReentrant whenNotPaused {
        require(_exists(tokenId), "Agent does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(newSkills.length > 0, "No skills provided");
        require(
            agents[tokenId].skills.length + newSkills.length <= MAX_SKILLS,
            "Exceeds maximum skills"
        );
        
        require(msg.value >= CUSTOM_SKILL_PRICE, "Insufficient ETH payment");

        for(uint i = 0; i < newSkills.length; i++) {
            require(bytes(newSkills[i]).length > 0, "Empty skill");
            agents[tokenId].skills.push(newSkills[i]);
            emit SkillAdded(tokenId, newSkills[i]);
        }
    }

    /**
     * @dev Request a custom skill for an agent
     * @param tokenId ID of the agent
     * @param skillDescription Description of the custom skill
     */
    function requestCustomSkill(
        uint256 tokenId,
        string memory skillDescription
    ) public payable nonReentrant whenNotPaused {
        require(_exists(tokenId), "Agent does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(bytes(skillDescription).length > 0, "Empty skill description");
        require(
            agents[tokenId].customSkills.length < MAX_CUSTOM_SKILLS,
            "Exceeds maximum custom skills"
        );
        
        require(msg.value >= CUSTOM_SKILL_PRICE, "Insufficient ETH payment");

        agents[tokenId].customSkills.push(skillDescription);
        emit CustomSkillRequested(tokenId, skillDescription);
    }

    /**
     * @dev View function to get agent details
     * @param tokenId ID of the agent
     */
    function getAgent(uint256 tokenId) public view returns (
        string memory name,
        string memory imageURI,
        string[] memory skills,
        string[] memory customSkills,
        string[] memory selectedItems,
        bool isListed,
        uint256 leasePrice,
        address currentLessee
    ) {
        require(_exists(tokenId), "Agent does not exist");
        Agent memory agent = agents[tokenId];
        return (
            agent.name,
            agent.imageURI,
            agent.skills,
            agent.customSkills,
            agent.selectedItems,
            agent.isListed,
            agent.leasePrice,
            activeLeases[tokenId]
        );
    }

    /**
     * @dev Emergency function to pause all operations
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Function to unpause all operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency function to recover stuck tokens
     * @param tokenAddress Address of token to recover
     */
    function emergencyWithdraw(address tokenAddress) external onlyOwner {
        if (tokenAddress == address(0)) {
            // Withdraw ETH
            uint256 balance = address(this).balance;
            require(balance > 0, "No ETH to withdraw");
            payable(owner()).sendValue(balance);
            emit EmergencyWithdraw(address(0), balance);
        } else {
            // Withdraw ERC20 tokens
            IERC20 token = IERC20(tokenAddress);
            uint256 balance = token.balanceOf(address(this));
            require(balance > 0, "No tokens to withdraw");
            require(token.transfer(owner(), balance), "Transfer failed");
            emit EmergencyWithdraw(tokenAddress, balance);
        }
    }

    /**
     * @dev Function to receive ETH
     */
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }
}
