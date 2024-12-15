// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AgentNFT is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Pricing
    uint256 public constant SKILL_PRICE_PRESALE = 0.002 ether;
    uint256 public constant SKILL_PRICE_LAUNCH = 0.005 ether;
    uint256 public constant BUNDLE_PRICE = 0.1 ether;
    uint256 public constant CUSTOM_SKILL_PRICE_PRESALE = 0.1 ether;
    uint256 public constant CUSTOM_SKILL_PRICE_LAUNCH = 0.15 ether;

    // Presale status
    bool public presaleActive = true;
    uint256 public constant MARKETPLACE_FEE = 15; // 15%

    // Agent struct to store metadata
    struct Agent {
        string name;
        string imageURI;
        string[] skills;
        string[] customSkills;
        bool isListed;
        uint256 leasePrice;
    }

    // Mapping from token ID to Agent struct
    mapping(uint256 => Agent) public agents;
    
    // Mapping for lease agreements
    mapping(uint256 => address) public activeLeases;

    // Events
    event AgentMinted(uint256 indexed tokenId, address indexed owner);
    event SkillAdded(uint256 indexed tokenId, string skill);
    event CustomSkillRequested(uint256 indexed tokenId, string skillDescription);
    event AgentListed(uint256 indexed tokenId, uint256 price);
    event AgentLeased(uint256 indexed tokenId, address indexed lessee);

    constructor() ERC721("Agentic General Intelligence", "AGI") {}

    function mintAgent(
        string memory name,
        string memory imageURI,
        string[] memory initialSkills
    ) public payable nonReentrant {
        require(bytes(name).length > 0, "Name required");
        require(bytes(imageURI).length > 0, "Image URI required");
        
        uint256 totalCost = presaleActive ? 
            initialSkills.length * SKILL_PRICE_PRESALE :
            initialSkills.length * SKILL_PRICE_LAUNCH;
            
        require(msg.value >= totalCost, "Insufficient payment");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        
        agents[newTokenId] = Agent({
            name: name,
            imageURI: imageURI,
            skills: initialSkills,
            customSkills: new string[](0),
            isListed: false,
            leasePrice: 0
        });

        emit AgentMinted(newTokenId, msg.sender);
    }

    function addSkills(
        uint256 tokenId,
        string[] memory newSkills
    ) public payable nonReentrant {
        require(_exists(tokenId), "Agent does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        uint256 cost = presaleActive ? 
            newSkills.length * SKILL_PRICE_PRESALE :
            newSkills.length * SKILL_PRICE_LAUNCH;
            
        require(msg.value >= cost, "Insufficient payment");

        for(uint i = 0; i < newSkills.length; i++) {
            agents[tokenId].skills.push(newSkills[i]);
            emit SkillAdded(tokenId, newSkills[i]);
        }
    }

    function requestCustomSkill(
        uint256 tokenId,
        string memory skillDescription
    ) public payable nonReentrant {
        require(_exists(tokenId), "Agent does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        uint256 cost = presaleActive ? 
            CUSTOM_SKILL_PRICE_PRESALE :
            CUSTOM_SKILL_PRICE_LAUNCH;
            
        require(msg.value >= cost, "Insufficient payment");

        agents[tokenId].customSkills.push(skillDescription);
        emit CustomSkillRequested(tokenId, skillDescription);
    }

    function listForLease(uint256 tokenId, uint256 price) public {
        require(_exists(tokenId), "Agent does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(activeLeases[tokenId] == address(0), "Already leased");

        agents[tokenId].isListed = true;
        agents[tokenId].leasePrice = price;
        
        emit AgentListed(tokenId, price);
    }

    function leaseAgent(uint256 tokenId) public payable nonReentrant {
        require(_exists(tokenId), "Agent does not exist");
        require(agents[tokenId].isListed, "Not listed for lease");
        require(msg.value >= agents[tokenId].leasePrice, "Insufficient payment");
        require(activeLeases[tokenId] == address(0), "Already leased");

        uint256 platformFee = (msg.value * MARKETPLACE_FEE) / 100;
        uint256 ownerPayment = msg.value - platformFee;
        
        // Transfer payments
        payable(owner()).transfer(platformFee);
        payable(ownerOf(tokenId)).transfer(ownerPayment);
        
        activeLeases[tokenId] = msg.sender;
        emit AgentLeased(tokenId, msg.sender);
    }

    function endLease(uint256 tokenId) public {
        require(_exists(tokenId), "Agent does not exist");
        require(
            msg.sender == ownerOf(tokenId) || 
            msg.sender == activeLeases[tokenId],
            "Not authorized"
        );

        activeLeases[tokenId] = address(0);
        agents[tokenId].isListed = false;
        agents[tokenId].leasePrice = 0;
    }

    function togglePresale() public onlyOwner {
        presaleActive = !presaleActive;
    }

    // View functions
    function getAgent(uint256 tokenId) public view returns (
        string memory name,
        string memory imageURI,
        string[] memory skills,
        string[] memory customSkills,
        bool isListed,
        uint256 leasePrice
    ) {
        require(_exists(tokenId), "Agent does not exist");
        Agent memory agent = agents[tokenId];
        return (
            agent.name,
            agent.imageURI,
            agent.skills,
            agent.customSkills,
            agent.isListed,
            agent.leasePrice
        );
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
