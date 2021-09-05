// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./WanderersPlanet.sol";
import "./WanderersPass.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";

contract TravelAgency is IERC721Receiver, Ownable, Pausable {
    using BytesLib for bytes;

    // Basis point: part per 10,000.
    uint256 public constant BASIS_POINTS_DIVISOR = 10000;

    WanderersPlanet public planetContract;
    WanderersPass public passContract;
    IERC20 public wrappedEthContract;

    // Fee charged by the contract deployer in basis points
    uint256 public operatorFeeBp;

    // Fee accured by contract owner
    uint256 public operatorFeeAccrued;

    // Mapping of Planet IDs to owners.
    mapping(uint256 => address) public planetOwners;

    // Mapping of Planet IDs to their fee.
    mapping(uint256 => uint256) public planetFees;

    // Mapping of owners to fees accured
    mapping(address => uint256) public ownerFeesAccrued;

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

    function updateOperatorFeeBp(uint256 _operatorFeeBp) public onlyOwner {
        operatorFeeBp = _operatorFeeBp;
    }

    // Perform a flash-stamp of planetId onto passId.
    // Note: this requires an approval from Planet Pass for passId, otherwise it will revert.
    // Note: this requqires ERC-20 spending approval for WETH, otherwise it will revert.
    function flashStamp(uint256 planetId, uint256 passId) public whenNotPaused {
        require(planetOwners[planetId] != address(0), "Planet not in contract");

        uint256 fee = planetFees[planetId];
        address planetOwner = planetOwners[planetId];

        // Send WETH to contract
        // The owner of the planet never pays any fees
        if (fee != 0 && msg.sender != planetOwner) {
            // Calculate contract deployer's cut and planet owner's cut
            uint256 ownerFee = calculateOperatorFee(fee);
            uint256 payoutFee = fee - ownerFee;

            ownerFeesAccrued[planetOwner] += payoutFee;
            operatorFeeAccrued += ownerFee;

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

    function calculateOperatorFee(uint256 fee) internal view returns (uint256) {
        return (fee * operatorFeeBp) / BASIS_POINTS_DIVISOR;
    }

    function withdrawOperatorFees(address to) public onlyOwner {
        uint256 transferAmount = operatorFeeAccrued;
        operatorFeeAccrued = 0;

        bool success = wrappedEthContract.transfer(
            to,
            transferAmount
        );
        require(success, "Token transfer failed");
    }

    function withdrawOwnerFees(address to) public {
        uint256 transferAmount = ownerFeesAccrued[msg.sender];
        ownerFeesAccrued[msg.sender] = 0;

        bool success = wrappedEthContract.transfer(
            to,
            transferAmount
        );
        require(success, "Token transfer failed");
    }

    // Withdraws the specified Planet to a designated address.
    function withdraw(address to, uint256 tokenId) public {
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
    ) external whenNotPaused override returns (bytes4) {
        if (msg.sender == address(planetContract)) {
            uint256 fee = data.toUint256(0);
            planetOwners[tokenId] = operator;
            planetFees[tokenId] = fee;
        } else if (msg.sender == address(passContract)) {} else {
            revert("Token not accepted");
        }

        // Make compiler shut up
        from;

        return IERC721Receiver.onERC721Received.selector;
    }
}
