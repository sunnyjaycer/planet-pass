// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./WanderersPlanet.sol";
import "./Nameable.sol";
import "./PlanetPassItems.sol";

contract WanderersPass is
    ERC721,
    ERC721Enumerable,
    Ownable,
    Pausable,
    Nameable
{
    using Counters for Counters.Counter;

    /// A strictly monotonically increasing counter of token IDs.
    Counters.Counter private _tokenIdCounter;

    /// The contents of a single stamp.
    struct Visit {
        /// Token ID of Planet
        uint256 planetId;
        /// State of planet at time to stamping
        uint256 state;
    }

    /// Mapping of Passes to array of stamps
    mapping(uint256 => Visit[]) private stamps;

    /// Location of Planet contract
    WanderersPlanet public planetContract;

    /// Location of Items contract
    PlanetPassItems public planetPassItemsContract;

    /// Event emitted when a stamp occurs
    /// @param from address which initiated the stamp
    /// @param passId the Pass that was stamped
    /// @param planetId the Planet that was stamped
    /// @param planetState the state of the Planet at the time of stamping
    event Stamp(
        address indexed from,
        uint256 indexed passId,
        uint256 indexed planetId,
        uint256 planetState
    );

    constructor(
        WanderersPlanet _planetContract,
        PlanetPassItems _planetPassItemsContract
    ) ERC721("WanderersPass", "WANDERER-PASS") {
        planetContract = _planetContract;
        planetPassItemsContract = _planetPassItemsContract;
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

    /// Updates the location of the Planet contract.
    /// @param _planetContract the new location of the Planet contract
    function updatePlanetContract(WanderersPlanet _planetContract)
        external
        onlyOwner
    {
        planetContract = _planetContract;
    }

    /// Updates the location of the Item contract.
    /// @param _planetPassItemsContract the new location of the Planet contract
    function updatePlanetPassItems(PlanetPassItems _planetPassItemsContract)
        external
        onlyOwner
    {
        planetPassItemsContract = _planetPassItemsContract;
    }

    /// Mint a new Pass.
    /// @param to the address to send the Pass to
    /// @param _passName the name for the Pass
    function safeMint(address to, string calldata _passName)
        external
        whenNotPaused
    {
        _setName(_tokenIdCounter.current(), _passName);
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    /// @dev create a Visit struct
    /// @param planetId the token ID of the Planet
    /// @return a Visit struct
    function makeVisit(uint256 planetId) internal view returns (Visit memory) {
        return Visit(planetId, planetContract.planetState(planetId));
    }

    /// Gets all stamps of a Pass
    /// @param id the token ID of the Pass
    /// @return an array of all stamps
    function getVisits(uint256 id) external view returns (Visit[] memory) {
        return stamps[id];
    }

    /// Visit a planet
    /// @param id the token ID of the Pass
    /// @param planetId the token ID of the Planet to visit
    function visitPlanet(uint256 id, uint256 planetId) external whenNotPaused {
        // Make sure planet is owned by sender
        require(
            planetContract.ownerOf(planetId) == msg.sender,
            "Not owner of planet"
        );
        // Make sure pass is owned by sender
        require(ownerOf(id) == msg.sender, "Not owner of pass");

        stamps[id].push(makeVisit(planetId));

        emit Stamp(
            msg.sender,
            id,
            planetId,
            planetContract.planetState(planetId)
        );
    }

    /// Visit multiple Planets
    /// @param id the token ID of the Pass
    /// @param planetId an array of IDs of Planets to visit
    function visitPlanet(uint256 id, uint256[] calldata planetId)
        external
        whenNotPaused
    {
        // Make sure pass is owned by sender
        require(ownerOf(id) == msg.sender, "Not owner of pass");

        for (uint256 i = 0; i < planetId.length; i++) {
            // Make sure planet is owned by sender
            require(
                planetContract.ownerOf(planetId[i]) == msg.sender,
                "Not owner of planet"
            );
            uint256 _planetId = planetId[i];

            stamps[id].push(makeVisit(_planetId));

            emit Stamp(
                msg.sender,
                id,
                _planetId,
                planetContract.planetState(_planetId)
            );
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
