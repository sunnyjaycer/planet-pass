// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Nameable.sol";

contract WanderersPlanet is
    ERC721,
    ERC721Enumerable,
    Ownable,
    Pausable,
    Nameable
{
    using Strings for uint256;

    /// Base URI for metadata
    string private baseURI;

    /// Root of merkle tree used for airdrop
    bytes32 public immutable root;

    /// Claiming enabled or disabled
    bool public claimEnabled;

    /// Mapping of Planets to states (see internal docs for what they represent)
    mapping(uint256 => uint256) public planetState;


    /// Event emitted when the state of a Planet is updated.
    /// @param id the token ID of the Planet
    /// @param state the new state of the Planet
    event StateUpdate(
        uint256 indexed id,
        uint256 indexed state
    );

    constructor(string memory baseURI_, bytes32 _root)
        ERC721("Wanderers Planet", "WANDERER-PLANET")
    {
        baseURI = baseURI_;
        root = _root;
        claimEnabled = false;
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

    /// @dev override for base URI
    /// @return the variable `baseURI`
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /// Updates the base URI.
    /// @param newBaseURI the new base URI to be used
    function updateBaseURI(string calldata newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }

    /// Enables the airdrop claim functionality.
    function enableClaim() external onlyOwner {
        claimEnabled = true;
    }

    /// Disables the airdrop claim functionality.
    function disableClaim() external onlyOwner {
        claimEnabled = false;
    }

    /// Claim a Planet according to merkle proof.
    /// @param to the address to send the Planet to
    /// @param id the token ID of the Planet being claimed
    /// @param proof the merkle tree proof that the sender is entitled to the Planet
    function claim(
        address to,
        uint256 id,
        bytes32[] calldata proof
    ) external whenNotPaused {
        // Make sure claim is enabled
        require(claimEnabled, "Claim disabled");
        // Make sure merkle proof is valid
        require(_verify(_leaf(id, msg.sender), proof), "Bad merkle proof");

        _safeMint(to, id);
    }

    /// @dev reconstructs the leaf hash of a claim
    /// @param id the token ID of the leaf
    /// @param account the account of the leaf
    /// @return hash of the leaf
    function _leaf(uint256 id, address account)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(id, account));
    }

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

    /// Mint a Planet. Tokens 0-8887 inclusive are reserved for the airdrop.
    /// @param to the address to send the Planet to
    /// @param id the token ID of the Planet to mint
    function safeMint(address to, uint256 id) external onlyOwner {
        _safeMint(to, id);
    }

    /// Mint Planets. Tokens 0-8887 inclusive are reserved for the airdrop.
    /// @param to the address to send the Planet to
    /// @param id an array of token IDs of Planets to mint
    function safeMint(address to, uint256[] calldata id) external onlyOwner {
        for (uint256 i = 0; i < id.length; i++) {
            _safeMint(to, id[i]);
        }
    }

    /// Update the state of a Planet.
    /// @param id the token ID of the Planet
    /// @param state the state to update to
    function setPlanetState(uint256 id, uint256 state) external onlyOwner {
        planetState[id] = state;
        emit StateUpdate(id, state);
    }

    /// Update the states of Planets.
    /// @param id the token IDs of Planets
    /// @param state the state to update to
    function setPlanetState(uint256[] calldata id, uint256 state)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < id.length; i++) {
            planetState[id[i]] = state;
            emit StateUpdate(id[i], state);
        }
    }

    /// Return the tokens owned by a owner
    /// @param owner the owner address
    /// @return an array of all tokens owned by the address
    function tokensOfOwner(address owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory tokens = new uint256[](balanceOf(owner));

        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokens;
    }

    /// @dev override for token URI
    /// @return the token URI of a given token, at its current state
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return tokenURIWithState(tokenId, planetState[tokenId]);
    }

    /// @dev token URI with state override
    /// @return the token URI of a given token, with a given state
    function tokenURIWithState(uint256 tokenId, uint256 state)
        public
        view
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return
            bytes(_baseURI()).length > 0
                ? string(
                    abi.encodePacked(
                        _baseURI(),
                        state.toString(),
                        "/",
                        tokenId.toString()
                    )
                )
                : "";
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
