// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SpotifyClone  {
    function getBalance() external view returns (uint256) {
        uint256 EthBalance = address(msg.sender).balance;
        return EthBalance; }

    address public admin;
    uint256 public premiumAccessThreshold = 2;

    struct User {
        uint256 EthBalance;
        bool hasPremiumAccess;
        bool isSearching;
        bool canSearchSong;
    }

    mapping(address => User) public users;

    event PremiumAccessGranted(address indexed user);
    event SongSearched(address indexed user);
  
    modifier hasPremiumAccess() {
        require(users[msg.sender].hasPremiumAccess, "Premium access required");
        _;
    }

    modifier canSearchSong() {
        require(users[msg.sender].isSearching || users[msg.sender].EthBalance >= premiumAccessThreshold, "Insufficient tokens");
        _;
    }

    

    function setUserEthBalance(address user, uint256 balance) external {
        users[msg.sender].EthBalance = balance;
        if (balance >= premiumAccessThreshold && !users[msg.sender].hasPremiumAccess) {
            users[msg.sender].hasPremiumAccess = true;
            emit PremiumAccessGranted(user);
        }
    }

    function searchSong() external {
        uint256 balance = users[msg.sender].EthBalance;
        if (balance >= 4 && users[msg.sender].hasPremiumAccess) {
             users[msg.sender].canSearchSong = true;
            emit SongSearched(msg.sender);
    }
}
   
}