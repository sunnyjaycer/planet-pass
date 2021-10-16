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

    /// Identifier for stamps.
    bytes32 public constant STAMP_IDENT = keccak256("STAMP");

    /// The contents of a single stamp.
    struct Visit {
        /// Token ID of Planet
        uint256 planetId;
        /// State of planet at time to stamping
        uint256 state;
        /// The type of stamp being used
        uint256 stampId;
    }

    /// Mapping of Passes to array of stamps
    mapping(uint256 => Visit[]) private stamps;

    /// Mapping of owners to visit() approvals
    /// This is basically setApprovalForAll() but ONLY for creating Visits.
    mapping(address => mapping(address => bool)) public visitDelegationApprovals; 

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
        uint256 planetState,
        uint256 stampId
    );

    /// Event emitted when the visit delegation approval of an address is updated.
    event VisitDelegationApproval(address indexed owner, address indexed operator, bool approved);

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

    /// Gets all stamps of a Pass
    /// @param id the token ID of the Pass
    /// @return an array of all stamps
    function getVisits(uint256 id) external view returns (Visit[] memory) {
        return stamps[id];
    }

    /// @dev create a Visit struct
    /// @param planetId the token ID of the Planet
    /// @return a Visit struct
    function _makeVisit(uint256 planetId, uint256 stampId) internal view returns (Visit memory) {
        return Visit(planetId, planetContract.planetState(planetId), stampId);
    }

    /// Visit a planet
    /// @param id the token ID of the Pass
    /// @param planetId the token ID of the Planet to visit
    /// @param stampId the token ID of the stamp to use
    function _visitPlanet(uint256 id, uint256 planetId, uint256 stampId) internal {
        stamps[id].push(_makeVisit(planetId, stampId));

        emit Stamp(
            msg.sender,
            id,
            planetId,
            planetContract.planetState(planetId),
            stampId
        );
    }

    /// Visit a planet
    /// @param id the token ID of the Pass
    /// @param planetId the token ID of the Planet to visit
    /// @param stampId the token ID of the stamp to use
    function visitPlanet(uint256 id, uint256 planetId, uint256 stampId) external whenNotPaused {
        // Make sure planet is owned by sender
        require(
            planetContract.ownerOf(planetId) == msg.sender,
            "Not owner of planet"
        );
        // Make sure pass is owned by sender
        require(ownerOf(id) == msg.sender, "Not owner of pass");

        // Make sure stamp item is a stamp
        require(planetPassItemsContract.itemType(stampId) == STAMP_IDENT, "Item not a stamp");
        // Make sure sender has the stamp type
        require(planetPassItemsContract.balanceOf(msg.sender, stampId) != 0, "Item not owned");

        _visitPlanet(id, planetId, stampId);
    }

    /// Delegated visiting of a planet.
    /// Note: `msg.sender` must be approved by `owner`, otherwise this will revert.
    /// Note: `owner` must own the Stamp required, otherwise this will revert.
    /// @param owner the owner of the Pass
    /// @param id the token ID of the Pass
    /// @param planetId the token ID of the Planet to visit
    /// @param stampId the token ID of the stamp to use
    function delegateVisitPlanet(address owner, uint256 id, uint256 planetId, uint256 stampId) external whenNotPaused {
        // Make sure the Delegated is approved
        require(visitDelegationApprovals[owner][msg.sender], "Not approved for delegate visit");
        // Make sure the Delegated owns the planet
        require(
            planetContract.ownerOf(planetId) == msg.sender,
            "Delegated not owner of planet"
        );
        // Make sure pass is owned by `owner`
        require(ownerOf(id) == owner, "Not owner of pass");

        // Make sure stamp item is a stamp
        require(planetPassItemsContract.itemType(stampId) == STAMP_IDENT, "Item not a stamp");
        // Make sure sender has the stamp type
        require(planetPassItemsContract.balanceOf(owner, stampId) != 0, "Item not owned");

        _visitPlanet(id, planetId, stampId);
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

    /// Set the visit delegation approval.
    /// If set to `true`, the `operator` will be allowed to visit planets on the sender's behalf.
    /// @param operator the address of the operator
    /// @param approved whether the operator is approved
    function setVisitDelegationApproval(address operator, bool approved) external {
        require(operator != msg.sender, "Approval to caller");
        visitDelegationApprovals[msg.sender][operator] = approved;
        emit VisitDelegationApproval(msg.sender, operator, approved);
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
