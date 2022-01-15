const Election = artifacts.require("Election");

const expectedCandidatesNumber = 2;

const Reasons = {
    AlreadyVoted: "Sender of this transaction has already voted",
    InvalidCandidate: "Not a valid candidate"
};

const getErrorObj = (obj = {}) => {
    const txHash = Object.keys(obj)[0];
    return obj[txHash];
};

const vote = async(instance, candidateID, tx = {}) => {
    await instance.vote(candidateID, tx);
};

contract("Election", async accounts => {
    beforeEach(async() => {
        instance = await Election.new();

        firstCandidate = await instance.candidates(1);
        secondCandidate = await instance.candidates(2);
    });

    it("should pass if the number of candidates is correct", async() => {
        const count = await instance.candidatesCount();
        assert.equal(count.toNumber(), expectedCandidatesNumber);
    });

    it("should pass if the candidates have correct ids", async() => {
        assert.equal(firstCandidate[0], 1);
        assert.equal(secondCandidate[0], 2);
    });

    it("should pass if the candidates have correct names", async() => {
        assert.equal(firstCandidate[1], "Candidate 1");
        assert.equal(secondCandidate[1], "Candidate 2");
    });

    it("should pass if the candidates don't have any initial votes", async() => {
        assert.equal(firstCandidate[2], 0);
        assert.equal(secondCandidate[2], 0);
    })

    describe("vote()", () => {
        beforeEach(async() => {
            await vote(instance, 1, { from: accounts[0] });
            await vote(instance, 2, { from: accounts[1] });
        });

        it("should pass if candidates received votes", async() => {
            const firstCandidate = await instance.candidates(1);
            const secondCandidate = await instance.candidates(2);

            assert.equal(firstCandidate[2], 1);
            assert.equal(secondCandidate[2], 1);
        });

        it("should pass if both accounts were added to voters", async() => {
            const firstVoter = await instance.voters(accounts[0]);
            const secondVoter = await instance.voters(accounts[1]);
            
            assert(firstVoter);
            assert(secondVoter);
        });

        it("should pass if a correct event was generated", async() => {
            const tx = await instance.vote(1, { from: accounts[2] });

            assert.equal(tx.logs[0].event, "votedEvent");
        });

        it("should fail if a voter tries to cast a vote to a non-valid candidate",
        async() => {
           try {
               await vote(instance, 10, { from: accounts[3] });
           } catch(e) {
               const { error, reason } = getErrorObj(e.data);

               assert.equal(error, "revert");
               assert.equal(reason, Reasons.InvalidCandidate);
           }
        });

        it("should fail if a voter tries to cast two votes", async() => {
            try {
                await vote(instance, 1, { from: accounts[0] });
            } catch(e) {
                const { error, reason } = getErrorObj(e.data);
                
                assert.equal(error, "revert");
                assert.equal(reason, Reasons.AlreadyVoted);
            }
        });
    });
});
