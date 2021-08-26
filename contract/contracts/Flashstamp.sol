// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./WanderersPlanet.sol";
import "./WanderersPass.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Flashstamp is IERC721Receiver {
    WanderersPlanet public planetContract;
    WanderersPass public passContract;

    // Mapping of Planet IDs to owners.
    mapping(uint256 => address) planetOwners;

    // Mapping of Planet IDs to their fee.
    mapping(uint256 => uint256) planetFees;

    // Perform a flash-stamp of planetId onto passId.
    // Note: this requires an approval for passId, otherwise it will revert
    function flashStamp(uint256 planetId, uint256 passId) public payable {
        require(planetOwners[planetId] != address(0), "Planet not in contract");
        require(msg.value >= planetFees[planetId], "Fee too low");

        (bool success, ) = planetOwners[planetId].call{value: msg.value}("");
        require(success, "Could not send fee to planet owner");

        // Temporarily take Pass from sender
        passContract.safeTransferFrom(msg.sender, address(this), passId);

        // Stamp
        passContract.visitPlanet(passId, planetId);

        // Return it to the sender
        passContract.safeTransferFrom(address(this), msg.sender, passId);
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
