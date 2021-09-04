// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./WanderersPlanet.sol";

contract WanderersPass is ERC721, ERC721Enumerable, Ownable, Pausable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Mapping of ID to names
    mapping(uint256 => string) public passName;

    // Struct containing a single stamp.
    struct PassStamp {
        uint256 planetId;
        uint256 state;
    }

    // Mapping of ID to an array of stamps
    mapping(uint256 => PassStamp[]) private stamps;

    // Planet contract
    WanderersPlanet public planet;

    // Event emitted when a stamp occurs
    event Stamp(
        address indexed from,
        uint256 indexed passId,
        uint256 indexed planetId,
        uint256 planetState
    );

    constructor(address _planet) ERC721("WanderersPass", "WANDERER-PASS") {
        planet = WanderersPlanet(_planet);
        pause();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, string memory _name) public whenNotPaused {
        passName[_tokenIdCounter.current()] = _name;
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function makePassStamp(uint256 planetId)
        internal
        view
        returns (PassStamp memory)
    {
        return PassStamp(planetId, planet.planetState(planetId));
    }

    function getStamps(uint256 id) public view returns (PassStamp[] memory) {
        return stamps[id];
    }

    function visitPlanet(uint256 id, uint256 planetId) public whenNotPaused {
        // Make sure planet is owned by sender
        require(planet.ownerOf(planetId) == msg.sender, "Not owner of planet");
        // Make sure pass is owned by sender
        require(ownerOf(id) == msg.sender, "Not owner of pass");

        stamps[id].push(makePassStamp(planetId));

        emit Stamp(msg.sender, id, planetId, planet.planetState(planetId));
    }

    function visitPlanet(uint256 id, uint256[] calldata planetIds)
        public
        whenNotPaused
    {
        // Make sure pass is owned by sender
        require(ownerOf(id) == msg.sender, "Not owner of pass");

        for (uint256 i = 0; i < planetIds.length; i++) {
            // Make sure planet is owned by sender
            require(
                planet.ownerOf(planetIds[i]) == msg.sender,
                "Not owner of planet"
            );
            uint256 planetId = planetIds[i];

            stamps[id].push(makePassStamp(planetId));

            emit Stamp(msg.sender, id, planetId, planet.planetState(planetId));
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
