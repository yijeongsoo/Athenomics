var Athenomics = artifacts.require("./Athenomics.sol");

contract("Athenomics", function(accounts) {
  var athenomicsInstance;


  // Test 1 - Done
  it("Submitting a genome", function(){
    return Athenomics.deployed().then(function(instance) {
      athenomicsInstance = instance;
      sampleSEQ = "SEQ";
      sampleSource = "SOURCE";
      return athenomicsInstance.addGenome(sampleSEQ, sampleSource);
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, "an event was triggered")
      assert.equal(receipt.logs[0].event, "addGenomeEvent", "the event was a addGenomeEvent");
      assert.equal(receipt.logs[0].args._seq, sampleSEQ, "the genome's seq match");
      assert.equal(receipt.logs[0].args._source, sampleSource, "the genome's source match");
    })
  });

  // Test 2 - Done
  it("Signing up as a member institution", function(){
    return Athenomics.deployed().then(function(instance) {
      athenomicsInstance = instance;
      sampleIns = "Ins";
      return athenomicsInstance.addMember(sampleIns);
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, "an event was triggered")
      assert.equal(receipt.logs[0].event, "addMemberEvent", "the event was a addMemberEvent");
      assert.equal(receipt.logs[0].args._ins, sampleIns, "the Member's ins match");
    })
  });

//Test 3 - Done(?) - What should the "view" do?
// 042020: (Soo) Right now it's just adding two genomes into the instance
  it("Viewing available genomes", function(){
    return Athenomics.deployed().then(function(instance) {
      athenomicsInstance = instance;
      //Create instances of 2 genomes
      sampleSEQ1 = "SEQ1";
      sampleSource1 = "SOURCE1";
      return athenomicsInstance.addGenome(sampleSEQ1, sampleSource1);
    }).then(function(receipt1){ // Check indexes of the first genome
      assert.equal(receipt1.logs.length, 1, "an event was triggered");
      assert.equal(receipt1.logs[0].event, "addGenomeEvent", "the event was a addGenomeEvent");
      assert.equal(receipt1.logs[0].args._seq, sampleSEQ1, "the first genome's seq match");
      assert.equal(receipt1.logs[0].args._source, sampleSource1, "the first genome's source match");
      sampleSEQ2 = "SEQ2";
      sampleSource2 = "SOURCE2";
      return athenomicsInstance.addGenome(sampleSEQ2, sampleSource2);
    }).then(function(receipt2){ // Check indexes of the second genome
      assert.equal(receipt2.logs.length, 1, "another event was triggered");
      assert.equal(receipt2.logs[0].event, "addGenomeEvent", "the event was a addGenomeEvent");
      assert.equal(receipt2.logs[0].args._seq, sampleSEQ2, "the second genome's seq match");
      assert.equal(receipt2.logs[0].args._source, sampleSource2, "the second genome's source match");
    })
  });


  // Test 4 - Done
  // Check if request is pending
  it("Requesting a genome", function(){
    return Athenomics.deployed().then(function(instance) {
      athenomicsInstance = instance;
      sampleSEQ = "SEQ";
      sampleSource = "SOURCE";
      return athenomicsInstance.addGenome(sampleSEQ, sampleSource);
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, "an event was triggered")
      assert.equal(receipt.logs[0].event, "addGenomeEvent", "the event was a addGenomeEvent");
      assert.equal(receipt.logs[0].args._seq, sampleSEQ, "the genome's seq match");
      assert.equal(receipt.logs[0].args._source, sampleSource, "the genome's source match");
      return athenomicsInstance.addRequest(0);
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "addRequestEvent", "the event was a addRequestEvent");
      assert.equal(receipt.logs[0].args._genomeRequestStatus, 2, "the genome's request status is pending");
      assert.equal(receipt.logs[0].args._memberRequestStatus, 2, "the member's request status is pending");
    })
  });

/*
  // Test 5 - In Progress
  it("Accepting/rejecting a request ", function(){
    return Athenomics.deployed().then(function(instance) {
      athenomicsInstance = instance;
      sampleSEQ = "SEQ";
      sampleSource = "SOURCE";
      return athenomicsInstance.addGenome(sampleSEQ, sampleSource);
    })
  });

  // Test 6 - Final Test - In Progress
  it("Confirming and downloading a request", function(){
    return Athenomics.deployed().then(function(instance) {

    });
  });
*/

});


/* it("initializes with two candidates", function() {
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("it initializes the candidates with the correct values", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidates(1);
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "Candidate 1", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "Candidate 2", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    });
  });


  //Use for Test 4,5,6
  it("throws an exception for invalid candiates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    });
  });


  it("throws an exception for double voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
    });
  });

  it("allows a voter to cast a vote", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 1;
      return electionInstance.vote(candidateId, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
      return electionInstance.voters(accounts[0]);
    }).then(function(voted) {
      assert(voted, "the voter was marked as voted");
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });
*/