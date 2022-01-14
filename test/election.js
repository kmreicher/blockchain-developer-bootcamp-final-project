const Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  // Checks if the contract was created with two candidates by checking
  // the contract's candidatesCount value
  it("Check if the contract was created with two candidates", function() {
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  // Checks if the contract's candidates were initialized with correct
  // values — id, name, and initial vote count
  it("Check if the contract's candidates were initialized with correct values", 
  function() {
    return Election.deployed().then(function(contract) {
      instance = contract;
      
      // Return the first candidate
      return instance.candidates(1);
    }).then(function(candidate) {
      assert.equal(candidate[0], 1,
        "Candidate 1 has the correct ID");
      assert.equal(candidate[1], "Candidate 1",
        "Candidate 1 has the correct name");
      assert.equal(candidate[2], 0,
        "Initial vote count of Candidate 1 is set to 0");

      // Return the second candidate
      return instance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2,
        "Candidate 2 has the correct ID");
      assert.equal(candidate[1], "Candidate 2",
        "Candidate 2 has the correct name");
      assert.equal(candidate[2], 0,
        "Initial vote count of Candidate 2 is set to 0");
    });
  });

  // Checks if the voter can cast a vote, by checking if the correct event
  // was created and if that event is connected to the correct
  // candidate. Checks if the candidate's voteCount was correctly incremented
  it("Check if the voter can cast a vote", function() {
    return Election.deployed().then(function(contract) {
      instance = contract;
      id = 1;

      // Return vote() function call targeting the candidate defined by
      // the id variable
      return instance.vote(id, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1,
        "The event wasn't triggered");
      assert.equal(receipt.logs[0].event, "votedEvent",
        "The event's type is not correct");
      assert.equal(receipt.logs[0].args.candidateId.toNumber(), id,
        "The candidate's id connected to the event is not correct");
      
      // Return the account in question from mapping listing all accounts
      // that have voted
      return instance.voters(accounts[0]);
    }).then(function(voted) {
      // Check if the account that casted the voted is listed as
      assert(voted, "The account in question wasn't marked as voted");

      // Return the candidate on which the vote was casted
      return instance.candidates(id);
    }).then(function(candidate) {
      // Check if the candidate's voteCount was correctly incremented
      assert.equal(candidate[2], 1,
        "The candidate's vote count was not correctly incremented");
    })
  });

  // Checks if the voter can't cast a vote for a non-valid candidate
  it("Check if the voter can't cast a vote for a non-valid candidate",
  function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;

      // Cast a vote to a candidate with ID == 99
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {

      // Check if the correct error message was created
      assert(error.message.indexOf('revert') >= 0,
        "The triggered error must contain 'revert'");
      return electionInstance.candidates(1);
    });
  });

  // Checks if the voter can't cast multiple votes and checks if the
  // candidates didn't receive any supplementary votes
  it("Check if the voter can't cast multiple votes", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      id = 2;
      electionInstance.vote(id, { from: accounts[2] });
      return electionInstance.candidates(id);
    }).then(function(candidate) {
      // Check if the first vote was successfully accepted
      assert.equal(candidate[2], 1, "First vote wasn't accepted");

      // Cast the second vote
      return electionInstance.vote(id, { from: accounts[2] });
    }).then(assert.fail).catch(function(error) {
      // Check if the error message contains revert 
      assert(error.message.indexOf('revert') >= 0,
        "The triggered error must contain 'revert'");
      
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      // Check if "Candidate 1" received any additional votes
      assert.equal(candidate1[2], 1,
        "Candidate 1 received additional incorrect vote");
      
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      // Check if "Candidate 2" received any additional votes
      assert.equal(candidate2[2], 1,
        "Candidate 2 received additional incorrect vote");
    });
  });
});
