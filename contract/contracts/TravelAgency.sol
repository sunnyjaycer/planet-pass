// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./WanderersPlanet.sol";
import "./WanderersPass.sol";
import "./agency_magic/AgencyMagic.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";

contract TravelAgency is IERC721Receiver, Ownable, Pausable {
    using BytesLib for bytes;

    /// Basis point: part per 10,000.
    uint256 public constant BASIS_POINTS_DIVISOR = 10000;

    /// Location of Planet contract.
    WanderersPlanet public planetContract;

    /// Location of Pass contract.
    WanderersPass public passContract;

    /// Location of WETH contract.
    IERC20 public wrappedEthContract;

    /// Fee charged by the contract deployer in basis points
    uint256 public operatorFeeBp;

    /// Fee accured by contract owner
    uint256 public operatorFeeAccrued;

    /// Mapping of Planet IDs to owners.
    mapping(uint256 => address) public planetOwners;

    /// Mapping of Planet IDs to their fee.
    mapping(uint256 => uint256) public planetFees;

    /// Mapping of owners to fees accured
    mapping(address => uint256) public ownerFeesAccrued;

    /// Mapping of MAGIC (unique bytes32 identifier) to contract address.
    mapping(bytes32 => AgencyMagic) public magicContracts;

    /// Event emitted when the travel agency is used.
    event FlashStamp(
        address indexed from,
        address indexed planetOwner,
        uint256 indexed planetId,
        uint256 passId
    );

    /// Event emitted when a Planet's fee is updated.
    event UpdatePlanetFee(
        address indexed from,
        uint256 indexed planetId,
        uint256 fee
    );

    constructor(
        uint256 _operatorFeeBp,
        WanderersPlanet _planetContract,
        WanderersPass _passContract,
        IERC20 _wrappedEthContract
    ) {
        operatorFeeBp = _operatorFeeBp;
        planetContract = _planetContract;
        passContract = _passContract;
        wrappedEthContract = _wrappedEthContract;
        _pause();
    }

    /// Pauses the contract.
    function pause() external onlyOwner {
        _pause();
    }

    /// Unpauses the contract.
    function unpause() external onlyOwner {
        _unpause();
    }

    /// Updates the location of the Planet contract.
    /// @param _planetContract the new location of the Planet contract
    function updatePlanetContract(WanderersPlanet _planetContract)
        external
        onlyOwner
    {
        planetContract = _planetContract;
    }

    /// Updates the location of the Pass contract.
    /// @param _passContract the new location of the Pass contract
    function updatePassContract(WanderersPass _passContract)
        external
        onlyOwner
    {
        passContract = _passContract;
    }

    /// Updates the location of the WETH contract.
    /// @param _wrappedEthContract the new location of the WETH contract
    function updateWrappedEthContract(IERC20 _wrappedEthContract)
        external
        onlyOwner
    {
        wrappedEthContract = _wrappedEthContract;
    }

    /// Updates the fee charged by the contract deployer.
    /// @param _operatorFeeBp the new fee charged, in basis points
    function updateOperatorFeeBp(uint256 _operatorFeeBp) external onlyOwner {
        operatorFeeBp = _operatorFeeBp;
    }

    /// Updates the contract address associated with a magic identifier.
    /// @param magic the magic identifier
    /// @param action the new contract associated with the magic
    function setContractForMagic(bytes32 magic, AgencyMagic action) external onlyOwner {
        magicContracts[magic] = action;
    }

    /// Perform a flash-stamp of planetId onto passId.
    /// Note: this requires visitDelegationApproval from Planet Pass for this contract, otherwise it will revert.
    /// Note: this requqires ERC-20 spending approval for WETH, otherwise it will revert.
    /// @param planetId token ID of the planet to visit.
    /// @param passId token ID of the pass that will used for visit.
    /// @param stampId token ID of the stamp that will be used for the visit.
    /// @param maxSpend the maximum amount in WETH the user is willing to spend for this visit.
    function flashStamp(uint256 planetId, uint256 passId, uint256 stampId, uint256 maxSpend)
        external
        whenNotPaused
    {
        require(planetOwners[planetId] != address(0), "Planet not in contract");

        uint256 fee = planetFees[planetId];
        address planetOwner = planetOwners[planetId];

        // If the fee exceeds maximum spend (e.g. fee was updated between tx submission and tx mined), revert.
        require(fee <= maxSpend, "Fee exceeds maximum spend");

        // Send WETH to contract
        // The owner of the planet never pays any fees
        if (fee != 0 && msg.sender != planetOwner) {
            // Calculate operator's cut and owner's cut
            (uint256 operatorCut, uint256 ownerCut) = calculateFee(fee);

            ownerFeesAccrued[planetOwner] += ownerCut;
            operatorFeeAccrued += operatorCut;

            bool success = wrappedEthContract.transferFrom(
                msg.sender,
                address(this),
                fee
            );
            require(success, "Token transfer failed");
        }

        passContract.delegateVisitPlanet(msg.sender, passId, planetId, stampId);

        emit FlashStamp(msg.sender, planetOwner, planetId, passId);
    }

    /// @dev calculates the fee designated for operator (owner of contract) and owner (owner of planet).
    /// @param fee the fee charged by the planet owner
    function calculateFee(uint256 fee)
        internal
        view
        returns (uint256 operatorCut, uint256 ownerCut)
    {
        operatorCut = (fee * operatorFeeBp) / BASIS_POINTS_DIVISOR;
        ownerCut = fee - operatorCut;
    }

    /// Updates the fee charged by the Planet owner.
    /// @param id the token ID of the planet
    /// @param _fee the new fee charged by the planet owner
    function updatePlanetFee(uint256 id, uint256 _fee) external whenNotPaused {
        require(msg.sender == planetOwners[id], "Not owner of planet");
        planetFees[id] = _fee;
        emit UpdatePlanetFee(msg.sender, id, _fee);
    }

    /// Withdraws the accured operator fees to a designated address.
    /// @param to the address to send fees to
    function withdrawOperatorFees(address to) external onlyOwner {
        uint256 transferAmount = operatorFeeAccrued;
        operatorFeeAccrued = 0;

        bool success = wrappedEthContract.transfer(to, transferAmount);
        require(success, "Token transfer failed");
    }

    /// Withdraws Planets owner's accured fees to a designated address.
    /// @param to the address to send fees to
    function withdrawOwnerFees(address to) external {
        uint256 transferAmount = ownerFeesAccrued[msg.sender];
        ownerFeesAccrued[msg.sender] = 0;

        bool success = wrappedEthContract.transfer(to, transferAmount);
        require(success, "Token transfer failed");
    }

    /// Withdraws a Planet token to a designated address.
    /// @param to the address to send the Planet to
    /// @param tokenId the token ID of the Planet
    function withdraw(address to, uint256 tokenId) external {
        require(planetOwners[tokenId] == msg.sender, "Not owner of planet");

        planetOwners[tokenId] = address(0);
        planetFees[tokenId] = 0;

        planetContract.safeTransferFrom(address(this), to, tokenId);
    }

    // IERC721Receiver implementation
    // Note: If the token is a Planet, then `data` must contain the fee (zero or otherwise).
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override whenNotPaused returns (bytes4) {
        if (msg.sender != address(planetContract)) {
            revert("Token not accepted");
        }
        uint256 fee = data.toUint256(0);
        planetOwners[tokenId] = operator;
        planetFees[tokenId] = fee;

        // Make compiler shut up
        from;

        return IERC721Receiver.onERC721Received.selector;
    }
}
