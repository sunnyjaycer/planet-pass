// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract Nameable is ERC721, Ownable, Pausable {
    /// Name of ERC-721 token
    mapping(uint256 => string) public nameOfToken;

    /// Mapping to ERC-721 token to whether they are rename-locked
    mapping(uint256 => bool) public renameLocked;

    /// Set the name of a token.
    /// @param id the token ID
    /// @param _name the new name of the token
    function setName(uint256 id, string calldata _name) public whenNotPaused {
        require(msg.sender == ownerOf(id), "Not owner of token");
        require(!renameLocked[id], "Token renaming locked");

        nameOfToken[id] = _name;
    }

    // NOTE: is this necessary? would we just have a user or contract just call the single setName
    /// Set then names of tokens.
    /// @param id an array token IDs
    /// @param _name an array of new names
    function setName(uint256[] calldata id, string[] calldata _name)
        public
        whenNotPaused
    {
        require(id.length == _name.length, "Array length mismatch");
        for (uint256 i = 0; i < id.length; i++) {
            setName(id[i], _name[i]);
        }
    }

    /// Set the name of a token.
    /// @param id the token ID
    /// @param _name the new name of the token
    function _setName(uint256 id, string memory _name) internal {
        nameOfToken[id] = _name;
    }

    /// Force rename a token to a designated name, and then disable further renames by users.
    /// If the owner wishes to rename the token again, call this function.
    /// @param id the token ID
    /// @param _name the new name of the token
    function forceRenameAndLock(uint256 id, string calldata _name)
        external
        onlyOwner
    {
        nameOfToken[id] = _name;
        _lockRename(id);
    }

    /// Disables renaming of a token by its owner
    /// @param id the token ID
    function _lockRename(uint256 id) internal {
        renameLocked[id] = true;
    }

    /// Re-enables renaming of a token by its owner
    /// @param id the token ID
    function _unlockRename(uint256 id) internal {
        renameLocked[id] = false;
    }

    /// Re-enables renaming of a token by its owner
    /// @param id the token ID
    function unlockRename(uint256 id) external onlyOwner {
        _unlockRename(id);
    }
}
