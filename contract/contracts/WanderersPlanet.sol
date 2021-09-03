// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract WanderersPlanet is ERC721, ERC721Enumerable, Ownable {
    string private baseURI;
    bytes32 immutable public root;

    // Current planet state (see internal docs for what they represent)
    mapping(uint256 => uint256) public planetState;

    constructor(string memory baseURI_, bytes32 _root)
        ERC721("Wanderers Planet", "WANDERER-PLANET")
    {
        baseURI = baseURI_;
        root = _root;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function updateBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }

    // Claim planets according to merkle proof
    function claim(
        address to,
        uint256 planetId,
        bytes32[] calldata proof
    ) public {
        // Make sure merkle proof is valid
        require(
            _verify(_leaf(planetId, msg.sender), proof),
            "Bad merkle proof"
        );

        _safeMint(to, planetId);
    }

    function _leaf(uint256 planetId, address account)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(planetId, account));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof)
        internal
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }

    // Owner can mint more
    function safeMint(address to, uint256 planetId) public onlyOwner {
        _safeMint(to, planetId);
    }

    function safeMint(address to, uint256[] calldata planetId)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < planetId.length; i++) {
            safeMint(to, planetId[i]);
        }
    }

    // Update state for one planet
    function setPlanetState(uint256 id, uint256 state) public onlyOwner {
        planetState[id] = state;
    }

    // Update state for multiple planets
    function setPlanetState(uint256[] calldata ids, uint256 state)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < ids.length; i++) {
            setPlanetState(ids[i], state);
        }
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
