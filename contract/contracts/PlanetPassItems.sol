// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract PlanetPassItems is ERC1155, AccessControl {
    /// Minter role. An address with this role is allowed to mint new items.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// A mapping of token IDs to its type.
    /// The type is keccak256 hashed, much like roles.
    mapping(uint256 => bytes32) public itemType;

    constructor() ERC1155("https://assets.wanderers.ai/file/hyperstore/") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    /// Update the URI
    /// @param newuri the new URI
    function setURI(string memory newuri) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newuri);
    }

    /// Mint an item
    /// @param account the address to mint to
    /// @param id an array of IDs to mint
    /// @param amount the amount to mint foreach ID
    /// @param data extra data
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, data);
    }

    /// Mint multiple items.
    /// @param to the address to mint to
    /// @param ids an array of IDs to mint
    /// @param amounts the amount to mint foreach ID
    /// @param data extra data
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, data);
    }

    /// @notice Allows DEFAULT_ADMIN_ROLE to authorise addresses to mint Hyperstore NFTs.
    /// @dev Roles can be revoked by DEFAULT_ADMIN_ROLE with the public revokeRole inherited in AccessControl
    /// @param newMinter address of new minter to be authorised
    function setUpMinterRole(address newMinter)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setupRole(MINTER_ROLE, newMinter);
    }

    /// Set the item type for an item.
    /// @param item the item ID
    /// @param newType the new type for the item
    function setItemType(uint256 item, string memory newType)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        itemType[item] = keccak256(abi.encodePacked(newType));
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
