// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "../TravelAgency.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract AgencyMagic is Ownable {
    TravelAgency public travelAgencyContract;
    bytes32 private root;

    constructor(TravelAgency _travelAgencyContract, bytes32 _root) {
        root = _root;
        travelAgencyContract = _travelAgencyContract;
    }

    /// Updates the location of the Travel Agency contract.
    /// @param _travelAgencyContract the new location of the Travel Agency contract
    function updateTravelAgencyContract(TravelAgency _travelAgencyContract)
        external
        onlyOwner
    {
        travelAgencyContract = _travelAgencyContract;
    }

    /// Updates the merkle root for the list of Planets.
    /// @param _root the new root
    function updateRoot(bytes32 _root) external onlyOwner {
        root = _root;
    }

    /// @dev enforces the caller to be the Travel Agency.
    modifier onlyTravelAgency() {
        require(
            msg.sender == address(travelAgencyContract),
            "Caller not travel agency"
        );
        _;
    }

    /// @dev checks that the planet can be proven to be in the merkle tree.
    /// @param planetId the token ID of the Planet
    /// @param proof the proof that the planet ID is part of the tree
    modifier containsPlanet(uint256 planetId, bytes32[] memory proof) {
        require(_verify(_leaf(planetId), proof), "Planet not eligible for action");
        _;
    }

    /// @dev override function for what action should be performed when a planet is visited.
    /// @param user the user that initiated the Visit (through the Agency)
    /// @param planetId the token ID of the Planet being visited
    /// @param passId the token ID of the Pass being visited
    /// @param stampId the token ID of the Stamp being used
    /// @param spent the amount of WETH spent on the visit
    /// @param proof the proof that the planet ID is part of the tree
    function performMagic(
        address user,
        uint256 planetId,
        uint256 passId,
        uint256 stampId,
        uint256 spent,
        bytes32[] memory proof
    ) public virtual;

    /// @dev verifies if the leaf can be proven to be part of the merkle tree defined by `root`.
    /// @param leaf the leaf to prove
    /// @param proof the proof that the leaf is part of the tree
    /// @return whether the leaf is part of the tree
    function _verify(bytes32 leaf, bytes32[] memory proof)
        internal
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }

    
    /// @dev reconstructs the leaf hash of a claim
    /// @param planetId the token ID of the planet
    /// @return hash of the leaf
    function _leaf(uint256 planetId)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(planetId));
    }
}
