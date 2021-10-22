// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Stardust.sol";
import "./PlanetPassItems.sol";

contract Hyperstore is AccessControl {
    struct Bundle {
        uint256 cost;
        bool available;
        uint256[] items;
        uint256[] quantities;
    }

    // Location of the Stardust contract.
    Stardust public stardust;

    // Location of the Items contract.
    PlanetPassItems public planetPassItems;

    // Mapping of bundle IDs to Bundle structs
    mapping(uint256 => Bundle) public bundles;

    /// Event emitted when a Bundle is updated.
    /// @param id the ID of the modified bundle
    /// @param cost the new cost of the modified bundle
    /// @param available the new availability of the modified bundle
    event BundleUpdate(
        uint256 indexed id,
        uint256 indexed cost,
        bool indexed available
    );

    /// Event emitted when a Bundle is purchased
    /// @param buyer the address of the buyer
    /// @param id the ID of the purchased bundle
    /// @param cost the cost of the purchased bundle
    event BundlePurchase(
        address indexed buyer,
        uint256 indexed id,
        uint256 cost
    );

    constructor(Stardust _stardust, PlanetPassItems _planetPassItems) {
        stardust = _stardust;
        planetPassItems = _planetPassItems;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// Updates the location of the Stardust contract.
    /// @param _stardust the new location of the Stardust contract
    function updateStardust(Stardust _stardust)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        stardust = _stardust;
    }

    /// Updates the location of the Stardust contract.
    /// @param _planetPassItems the new location of the Items contract
    function updatePlanetPassItems(PlanetPassItems _planetPassItems)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        planetPassItems = _planetPassItems;
    }

    /// Set the parameters of a bundle.
    /// @param id the ID of the bundle
    /// @param cost the cost of the bundle in Stardust
    /// @param items an array of items that will be minted when the Bundle is bought
    /// @param quantities the quantity of each item to mint
    function setBundle(
        uint256 id,
        uint256 cost,
        uint256[] memory items,
        uint256[] memory quantities
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(items.length == quantities.length, "Array length mismatch");

        Bundle memory bundle = Bundle(cost, false, items, quantities);
        bundles[id] = bundle;
        emit BundleUpdate(id, cost, false);
    }

    /// Set whether a Bundle is available for purchase.
    /// @param id the ID of the bundle
    /// @param available the new availability of the Bundle
    function setBundleAvailability(uint256 id, bool available)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        bundles[id].available = available;
        emit BundleUpdate(id, bundles[id].cost, available);
    }

    /// Set the cost of a Bundle.
    /// @param id the ID of the bundle
    /// @param cost the new cost of the Bundle
    function setBundleCost(uint256 id, uint256 cost)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        bundles[id].cost = cost;
        emit BundleUpdate(id, cost, bundles[id].available);
    }

    /// Set the list of items and their quantities in a Bundle.
    /// @param id the ID of the bundle
    /// @param items the new array of items that will be minted when the Bundle is bought
    /// @param quantities the new quantity of each item to mint
    function setItemsQuantities(
        uint256 id,
        uint256[] memory items,
        uint256[] memory quantities
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(items.length == quantities.length, "Array length mismatch");

        bundles[id].items = items;
        bundles[id].quantities = quantities;
        emit BundleUpdate(id, bundles[id].cost, bundles[id].available);
    }

    /// Buy an item from the store, burning Stardust in the process.
    /// Note: This requires Stardust spend permission from `msg.sender`. Otherwise will revert.
    /// @param id the ID of the bundle to purchase
    function buy(uint256 id) public {
        require(bundles[id].available, "Bundle not available for sale");
        // Burn stardust
        stardust.burnFrom(msg.sender, bundles[id].cost);
        planetPassItems.mintBatch(msg.sender, bundles[id].items, bundles[id].quantities, "");
        emit BundlePurchase(msg.sender, id, bundles[id].cost);
    }
}
