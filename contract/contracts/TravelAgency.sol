// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./WanderersPlanet.sol";
import "./WanderersPass.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract TravelAgency is IERC721Receiver, Ownable, Pausable {
    // Basis point: part per 10,000.
    uint256 public constant BASIS_POINTS_DIVISOR = 10000;

    WanderersPlanet public planetContract;
    WanderersPass public passContract;
    IERC20 public wrappedEthContract;

    // Fee charged by the contract deployer in basis points
    uint256 public ownerFeeBp;

    // Fee accured by contract owner
    uint256 public ownerFeesAccrued;

    // Mapping of Planet IDs to owners.
    mapping(uint256 => address) planetOwners;

    // Mapping of Planet IDs to their fee.
    mapping(uint256 => uint256) planetFees;

    // Mapping of owners to fees accured
    mapping(address => uint256) feesAccrued;

    constructor(
        uint256 _ownerFeeBp,
        WanderersPlanet _planetContract,
        WanderersPass _passContract,
        IERC20 _wrappedEthContract
    ) {
        ownerFeeBp = _ownerFeeBp;
        planetContract = _planetContract;
        passContract = _passContract;
        wrappedEthContract = _wrappedEthContract;
        pause();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function updatePlanetContract(WanderersPlanet _planetContract)
        public
        onlyOwner
    {
        planetContract = _planetContract;
    }

    function updatePassContract(WanderersPass _passContract) public onlyOwner {
        passContract = _passContract;
    }

    function updateWrappedEthContract(IERC20 _wrappedEthContract)
        public
        onlyOwner
    {
        wrappedEthContract = _wrappedEthContract;
    }

    // Perform a flash-stamp of planetId onto passId.
    // Note: this requires an approval from Planet Pass for passId, otherwise it will revert.
    // Note: this requqires ERC-20 spending approval for WETH, otherwise it will revert.
    function flashStamp(uint256 planetId, uint256 passId) public {
        require(planetOwners[planetId] != address(0), "Planet not in contract");

        uint256 fee = planetFees[planetId];
        address planetOwner = planetOwners[planetId];

        // Send WETH to contract
        if (fee != 0) {
            // Calculate contract deployer's cut and planet owner's cut
            uint256 ownerFee = calculateOwnerFee(fee);
            uint256 payoutFee = fee - ownerFee;

            feesAccrued[planetOwner] += payoutFee;
            ownerFeesAccrued += ownerFee;

            bool success = wrappedEthContract.transferFrom(
                msg.sender,
                address(this),
                payoutFee
            );
            require(success, "Token transfer failed");
        }

        // Temporarily take Pass from sender
        passContract.safeTransferFrom(msg.sender, address(this), passId);

        // Stamp
        passContract.visitPlanet(passId, planetId);

        // Return it to the sender
        passContract.safeTransferFrom(address(this), msg.sender, passId);
    }

    function calculateOwnerFee(uint256 fee) internal view returns (uint256) {
        return (fee * ownerFeeBp) / BASIS_POINTS_DIVISOR;
    }

    function withdrawOwnerFees(address to) public onlyOwner {
        uint256 transferAmount = ownerFeesAccrued;
        ownerFeesAccrued = 0;

        bool success = wrappedEthContract.transferFrom(
            address(this),
            to,
            transferAmount
        );
        require(success, "Token transfer failed");
    }

    function withdrawFees(address to) public {
        uint256 transferAmount = feesAccrued[msg.sender];
        feesAccrued[msg.sender] = 0;

        bool success = wrappedEthContract.transferFrom(
            address(this),
            to,
            transferAmount
        );
        require(success, "Token transfer failed");
    }

    // Deposits the specified Planet with a fee for flash-stamping using it
    function deposit(uint256 tokenId, uint256 fee) public {
        planetFees[tokenId] = fee;
        planetContract.safeTransferFrom(msg.sender, address(this), tokenId);
    }

    // Deposits multiple Planets
    function deposit(uint256[] calldata tokenId, uint256[] calldata fee)
        public
    {
        require(tokenId.length == fee.length, "Argument length mismatch");
        for (uint256 i = 0; i < tokenId.length; i++) {
            deposit(tokenId[i], fee[i]);
        }
    }

    // Withdraws the specified Planet to a designated address.
    function withdraw(address to, uint256 tokenId) public {
        require(planetOwners[tokenId] == msg.sender, "Not owner of planet");

        planetOwners[tokenId] = address(0);
        planetFees[tokenId] = 0;

        planetContract.safeTransferFrom(address(this), to, tokenId);
    }

    // IERC721Receiver implementation
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        require(
            msg.sender == address(planetContract) ||
                msg.sender == address(passContract),
            "Token not planet nor pass"
        );

        // Makes the compiler shut up
        from;
        data;

        // Update owner of planet to operator
        if (msg.sender == address(planetContract)) {
            planetOwners[tokenId] = operator;
        }

        return IERC721Receiver.onERC721Received.selector;
    }
}
