// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WanderersPlanet is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    string private baseURI;
    IERC721 public wanderers;

    // Mapping of whether a Wanderer has claimed their free home planet
    mapping(uint256 => bool) public claimed;

    // Mapping of Planet to who originally minted it
    mapping(uint256 => address) public minter;

    // Mapping of planet to state
    mapping(uint256 => uint256) public planetState;

    constructor(string memory baseURI_, address wanderers_) ERC721("Wanderers Planet", "WANDERER-PLANET") {
        baseURI = baseURI_;
        wanderers = IERC721(wanderers_);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function updateBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }

    // For minting one individual Wanderer's home planet
    function safeMint(address to, uint256 wandererID_) public {
        // Make sure token has not been used for claim already
        require(!claimed[wandererID_], "Token already used for claim");
        // Make sure sender actually owns the token
        require(wanderers.ownerOf(wandererID_) == msg.sender, "Sender is not owner of token");

        claimed[wandererID_] = true;
        minter[wandererID_] = msg.sender;

        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    // Batch mint for multiple Wanderers owned by same address
    function safeMint(address to, uint256[] memory wandererIDs) public {
        for (uint256 i = 0; i < wandererIDs.length; i++) {
            safeMint(to, wandererIDs[i]);
        }
    }

    // Update state for one planet
    function setPlanetState(uint256 id, uint256 state) public onlyOwner {
        planetState[id] = state;
    }

    // Update state for multiple planets
    function setPlanetState(uint256[] memory ids, uint256 state) public onlyOwner {
        for (uint256 i = 0; i < ids.length; i++) {
            setPlanetState(ids[i], state);
        }
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
    {
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
