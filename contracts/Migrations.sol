// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

/// @title Migrations contract
/// @author Kacper Reicher
/// @notice This contract keeps track of which migrations were done on the current network
/// @dev Truffle's boiler code
contract Migrations {
  /// Address of the contract's owner
  address public owner;
  /// Corresponds to the last applied migration script, found in the
  /// migrations folder
  uint256 public last_completed_migration;

  /// @dev Only owner can use this function
  modifier onlyOwner() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  /// @dev Instantiate owner and catch the contract deployer's address
  constructor() {
    owner = msg.sender;
  }

  /// @dev Only usable by the transaction's owner
  function setCompleted(uint completed) onlyOwner public {
    last_completed_migration = completed;
  }
}