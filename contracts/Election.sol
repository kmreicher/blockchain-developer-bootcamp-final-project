// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/security/Pausable.sol";

/// @title Election
/// @author Kacper Reicher
/// @notice This contract is used to simulate the election mechanism
/// @dev Contract constructs candidates and map them to the public list
contract Election is Pausable {
    /// @dev A simple candidate's struct holding information about
    /// @dev candidate's id, name, and vote count
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    /// @dev List of accounts that has already voted
    mapping(address => bool) public voters;

    /// @dev List of all candidates
    mapping(uint => Candidate) public candidates;

    /// @dev Total number of candidates
    uint public candidatesCount;

    // TODO Add more info
    event votedEvent (
        uint indexed candidateId
    );

    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    /// @dev Adds the candidate to a pool listing all candidates
    /// @dev and inrements the candidatesCount
    /// @param name Candidate's name
    function addCandidate(string memory name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
    }

    /// @notice Prevents the account from voting more then once
    /// @dev Adds the account to mapping listing the accounts that has
    /// @dev already voted
    modifier OnlyIfDidNotVote() {
        require(
            !voters[msg.sender],
            "Sender of this transaction has already voted"
        );
        _;
    }

    /// @notice Prevents casting a vote to non-valid candidate
    /// @param id Candidate's id
    modifier OnlyForValidCandidate(uint id) {
        require(
            id > 0 && id <= candidatesCount,
            "Not a valid candidate"
        );
        _;
    }

    modifier OnlyBeforeSpecificTime() {
        require(
            block.timestamp < 1642636800,
            "The vote has to be casted before a specific date"
        );
        _;
    }
   
    /// @dev Add the sender of this transaction to mapping listing
    /// @dev accounts that has already voted
    modifier AddSenderToVoters() {
        _;
        voters[msg.sender] = true;
    }

    /// @dev Increment the candidate's vote count
    modifier IncrementCandidate(uint id) {
        _;
        candidates[id].voteCount++;
    } 

    /// @notice Voting mechanism
    /// @dev Adds the voter's address to pool listing addresses that has
    /// @dev already voted. Increments the targeted candidate's voteCount
    /// @dev and emits an event
    /// @param candidateId Candidate's id
    function vote(uint candidateId) public OnlyIfDidNotVote
                                           OnlyForValidCandidate(candidateId)
                                           OnlyBeforeSpecificTime
                                           AddSenderToVoters
                                           IncrementCandidate(candidateId) {
        /// @dev Trigger voted event
        emit votedEvent(candidateId);
    }
}
