// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WanderersPass is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => string) public passName;
    mapping(uint256 => uint256[]) public stamps;

    IERC721 public planet;

    constructor(address planet_) ERC721("WanderersPass", "WANDERER-PASS") {
        planet = IERC721(planet_);
    }

    function safeMint(address to, string memory name) public {
        passName[_tokenIdCounter.current()] = name;
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function visitPlanet(uint256 id, uint256 planetId) public {
        // Make sure planet is owned by sender
        require(planet.ownerOf(planetId) == msg.sender, "Not owner of planet");
        // Make sure pass is owned by sender
        require(ownerOf(id) == msg.sender, "Not owner of pass");

        stamps[id].push(planetId);
    }

    function visitPlanet(uint256 id, uint256[] memory planetIds) public {
        // Make sure pass is owned by sender
        require(ownerOf(id) == msg.sender, "Not owner of pass");

        for (uint256 i = 0; i < planetIds.length; i++) {
            // Make sure planet is owned by sender
            require(planet.ownerOf(planetIds[i]) == msg.sender, "Not owner of planet");

            stamps[id].push(planetIds[i]);
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
