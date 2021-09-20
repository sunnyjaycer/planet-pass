// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Stardust is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("Stardust", "STARDUST") {
        _mint(msg.sender, 1_000_000 * 10**decimals());
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    /// Mint extra STARDUST tokens.
    /// @param to the address to send new tokens to
    /// @param amount amount of tokens to mint
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /// @notice Allows DEFAULT_ADMIN_ROLE to authorise addresses to mint Stardust.
    /// @dev Roles can be revoked by DEFAULT_ADMIN_ROLE with the public revokeRole inherited in AccessControl
    /// @param newMinter address of new minter to be authorised
    function setUpMinterRole(address newMinter)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setupRole(MINTER_ROLE, newMinter);
    }
}
