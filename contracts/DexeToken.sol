// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract DexeToken is Initializable, UUPSUpgradeable, OwnableUpgradeable, ERC20Upgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet internal _minters;

    modifier onlyMinter {
        require(_isMinter(msg.sender), "Caller is not a minter");
        _;
    }
    
    function __DexeToken_init() external initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        __ERC20_init("DeXe Token", "DEXE");
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

    function getMinters() external view returns (address[] memory minters) {
        minters = _minters.values();
    }

    function getImplementation() external view returns (address) {
        return _getImplementation();
    }

    function _isMinter(address user) internal view returns (bool) {
        return _minters.contains(user);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
