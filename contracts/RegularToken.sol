// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract USDC is Initializable, UUPSUpgradeable, ERC20Upgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet internal _owners;
    EnumerableSet.AddressSet internal _minters;

    modifier onlyOwner {
        require(_isOwner(msg.sender), "Ownable: caller is not the owner");
        _;
    }

    modifier onlyMinter {
        require(_isMinter(msg.sender), "Caller is not a minter");
        _;
    }
    
    function __RegularToken_init(string calldata _name, string calldata _symbol) external initializer {
        __UUPSUpgradeable_init();
        _owners.add(msg.sender);
        __ERC20_init(_name, _symbol);
    }

    function changeOwners(address[] calldata owners, bool newStatus) external onlyOwner {
        for (uint i = 0; i < owners.length; i++) {
            newStatus ? _owners.add(owners[i]) : _owners.remove(owners[i]);
        }
    }

    function changeMinters(address[] calldata minters, bool newStatus) external onlyOwner {
        for (uint i = 0; i < minters.length; i++) {
            newStatus ? _minters.add(minters[i]) : _minters.remove(minters[i]);
        }
    }

    function mint(address account, uint256 amount) external onlyMinter {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyMinter {
        _burn(account, amount);
    }

    function getOwners() external view returns (address[] memory owners) {
        owners = _owners.values();
    }

    function getMinters() external view returns (address[] memory minters) {
        minters = _minters.values();
    }

    function getImplementation() external view returns (address) {
        return _getImplementation();
    }

    function _isOwner(address user) internal view returns (bool) {
        return _owners.contains(user);
    }

    function _isMinter(address user) internal view returns (bool) {
        return _minters.contains(user);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
