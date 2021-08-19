// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract WanderersPlanet is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    string private baseURI;
    bytes32 immutable root;

    // Whether an address has claimed already
    mapping(address => bool) public claimed;

    // Original minter of a planet
    mapping(uint256 => address) public minter;

    // Current planet state (see internal docs for what they represent)
    mapping(uint256 => uint256) public planetState;

    constructor(string memory baseURI_, bytes32 root_)
        ERC721("Wanderers Planet", "WANDERER-PLANET")
    {
        baseURI = baseURI_;
        root = root_;
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
        uint256 quantity,
        bytes32[] calldata proof
    ) public {
        // Make sure merkle proof is valid
        require(
            _verify(_leaf(msg.sender, quantity), proof),
            "Bad merkle proof"
        );
        // Make sure address has not claimed already
        require(!claimed[msg.sender], "Already claimed");

        claimed[msg.sender] = true;

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, _tokenIdCounter.current());
            _tokenIdCounter.increment();
        }
    }

    function _leaf(address account, uint256 quantity)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(account, quantity));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof)
        internal
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }

    // Owner can mint more
    function safeMint(address to) public onlyOwner {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function safeMint(address to, uint256 quantity) public onlyOwner {
        for (uint256 i = 0; i < quantity; i++) {
            safeMint(to);
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
