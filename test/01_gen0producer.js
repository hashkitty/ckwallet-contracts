var Gen0ProducerContract = artifacts.require("./CKGen0Producer.sol");

async function throwsAsync(block, expectedMessage) {
    try {
        await block();
        assert(0, 'No error when expected');
    } catch (e) {
        if(expectedMessage) {
            assert(e.message.includes(expectedMessage));
        }
    }
}

contract('CKGen0Producer', function (accounts) {
    it("Create new gen 0 kitty", async function () {
        let instance = await Gen0ProducerContract.deployed();
        let supply = await instance.totalSupply();
        assert(supply == 0, `Invalid total supply ${supply}`);

        await instance.createGen0Auction(1);
        supply = await instance.totalSupply();
        assert(supply == 1, `Invalid total supply ${supply}`);
    });

    it("Can buy gen 0 kitty", async function () {
        let instance = await Gen0ProducerContract.deployed();
        await instance.bid(0, { value: web3.toWei(0.2, 'ether') });
        let owner = await instance.kittyToOwner(0);
        assert(owner == accounts[0], `invalid owner ${owner}-${accounts[0]}`);
    });

    it("Cannot buy gen 0 kitty twice", async function () {
        let instance = await Gen0ProducerContract.deployed();
        await throwsAsync(async () => {
            await instance.bid(0, { value: web3.toWei(0.2, 'ether') });
        });
    });

    it("Cannot buy gen 0 with smaller price", async function () {
        let instance = await Gen0ProducerContract.deployed();
        let price = await instance.GEN0_STARTING_PRICE() - 1;
        await throwsAsync(async () => {
            await instance.bid(0, { value: price });
        });
    });

});