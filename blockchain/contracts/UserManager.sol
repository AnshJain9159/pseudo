// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserManager {
    struct User {
        string fullName;
        bytes32 emailHash;
        bytes32 passwordHash;
        string role;
    }

    mapping(address => User) public users;

    event UserRegistered(address indexed userAddress, string fullName, string role);

    // Register a new user
    function registerUser(string memory _fullName, bytes32 _emailHash, bytes32 _passwordHash, string memory _role) public {
        require(
            keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("teacher")) || 
            keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("student")),
            "Invalid role"
        );
        require(bytes(users[msg.sender].fullName).length == 0, "User already registered");

        users[msg.sender] = User(_fullName, _emailHash, _passwordHash, _role);
        emit UserRegistered(msg.sender, _fullName, _role);
    }

    // Authenticate a user
    function authenticateUser(bytes32 _emailHash, bytes32 _passwordHash) public view returns (bool) {
        return (
            users[msg.sender].emailHash == _emailHash &&
            users[msg.sender].passwordHash == _passwordHash
        );
    }
}
