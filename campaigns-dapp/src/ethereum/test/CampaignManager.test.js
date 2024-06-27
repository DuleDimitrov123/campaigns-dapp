const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const CampaignManager = require('../build/CampaignManager.json');
const Campaign = require('../build/Campaign.json');

const web3 = new Web3(ganache.provider());

let accounts;
let campaignManager;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    campaignManager = await new web3.eth.Contract(JSON.parse(CampaignManager.interface))
        .deploy({data : CampaignManager.bytecode })
        .send({from: accounts[0], gas: '5000000'});
});

let dusanCampaign;

describe('Campaigns testing', () => {
    beforeEach('create campaign', async () => {
        await campaignManager.methods.createCampaign(
            accounts[0],
            "Dusan's campaign",
            "This is first Dusan's campaign",
            web3.utils.toWei("0.01", "ether"))
        .send({from:accounts[0], gas:'5000000'});

        const campaignAddresses = await campaignManager.methods.getCampagins()
            .call({from:accounts[0]});

            dusanCampaign = new web3.eth.Contract(JSON.parse(Campaign.interface), campaignAddresses[0]);
    });

    it('deploys a contract', () => {
        assert.ok(campaignManager.options.address);
    });

    it('is campaign organiser set', async () => {
        const organiser = await dusanCampaign.methods.organiser()
            .call({from:accounts[0]});

        assert.equal(organiser, accounts[0]);
    });

    it('donate to campaign', async () => {
        const donationValue = '1';

        await dusanCampaign.methods.donate()
            .send({from:accounts[1], gas: 5000000, value: web3.utils.toWei(donationValue, 'ether')});

        const donated = await dusanCampaign.methods.getTotalDonations()
            .call({from:accounts[0]});
        const donors = await dusanCampaign.methods.getDonors()
            .call({from:accounts[0]});

        assert.equal(web3.utils.fromWei(donated, 'ether'), donationValue);
        assert.equal(donors[0], accounts[1]);
    });

    it('donate below minimum should fail', async () =>
    {
        try
        {
            await dusanCampaign.methods.donate()
                .send({from:accounts[1], gas: 5000000, value: web3.utils.toWei('0.001', 'ether')});
            assert.fail("Should fail");
        } catch (error) {
            assert(error.message.includes("Only donations above min donation are allowed"));
        }
    })

    it('create a request', async () => {
        const requests = [
            {
                description: 'Request for campaign funds 1', 
                value: '1000000000000000000'
            },
            {
                description: 'Request for campaign funds 2', 
                value: '1000000000000000000'
            },
        ];

        for(let i = 0; i <= requests.length - 1; i++) {
            await dusanCampaign.methods.createRequest(requests[i].description, requests[i].value)
                .send({from: accounts[0], gas: 5000000});

            const request = await dusanCampaign.methods.getRequest(i)
                .call({from:accounts[0]});

            //console.log(request);
            assert.equal(request.desc, requests[i].description);
            assert.equal(request.val, requests[i].value);

            assert.equal(request.rec, accounts[0]);
            assert.equal(request.compl, false);
            assert.equal(request.apprCount, 0);
        }
    })

    it('not organise creating a request should fail', async () => {
        try {
            await dusanCampaign.methods.createRequest('Test request', '1000000000000000000')
                .send({from: accounts[1], gas: 5000000});
            assert.fail("Should fail");
        } catch(error) {
            assert(error.message.includes("Only organiser can do that"));
        }
    })

    it('approve request', async () => {
        //first create request
        await dusanCampaign.methods.createRequest('Request for campaign funds 1', '1000000000000000000')
            .send({from: accounts[0], gas: 5000000});

        //now donate from accounts[1]
        await dusanCampaign.methods.donate()
            .send({from:accounts[1], gas: 5000000, value: web3.utils.toWei('1', 'ether')});

        //now approve it from accounts[1]
        await dusanCampaign.methods.approveRequest(0)
            .send({from:accounts[1], gas: 5000000});

        //get request to see approvalCount === 1
        const request = await dusanCampaign.methods.getRequest(0)
            .call({from:accounts[0]});

        assert.equal(request.desc, 'Request for campaign funds 1');
        assert.equal(request.val, '1000000000000000000');

        assert.equal(request.rec, accounts[0]);
        assert.equal(request.compl, false);
        assert.equal(request.apprCount, 1);

        //get approvers
        const approvers = await dusanCampaign.methods.getApprovers(0)
            .call({from:accounts[0]});
        assert.equal(approvers.length, 1);
    });

    it('not donor approving request should fail', async () => {
        try {
            //first create request
            await dusanCampaign.methods.createRequest('Request for campaign funds 1', '1000000000000000000')
                .send({from: accounts[0], gas: 5000000});

            //now donate from accounts[1]
            await dusanCampaign.methods.donate()
                .send({from:accounts[1], gas: 5000000, value: web3.utils.toWei('1', 'ether')});

            //now approve it from accounts[3] and it should fail
            await dusanCampaign.methods.approveRequest(0)
                .send({from:accounts[3], gas: 5000000});
                assert.fail("Should fail");
        } catch(error) {
            assert(error.message.includes("This is only donor action"));
        }
    });

    it('approving request multiple times should fail', async () => {
        try {
            //first create request
            await dusanCampaign.methods.createRequest('Request for campaign funds 1', '1000000000000000000')
                .send({from: accounts[0], gas: 5000000});

            //now donate from accounts[1]
            await dusanCampaign.methods.donate()
                .send({from:accounts[1], gas: 5000000, value: web3.utils.toWei('1', 'ether')});

            //now approve it from accounts[1]
            await dusanCampaign.methods.approveRequest(0)
                .send({from:accounts[1], gas: 5000000});

            //now approve it one more time - should fail
            await dusanCampaign.methods.approveRequest(0)
                .send({from:accounts[1], gas: 5000000});
                assert.fail("Should fail");
        } catch(error) {
            assert(error.message.includes("Donor can approve only once"));
        }
    });

    it('not organise finalizing should fail', async function() {
        this.timeout(10000); //long test - increase initial timeout of 2000

        //first create request
        const requestAmount = '1000000000000000000';
        await dusanCampaign.methods.createRequest('Request for campaign funds 1', requestAmount)
            .send({from: accounts[0], gas: 5000000});

        //try to finalize with accounts[1] should fail
        try
        {
            await dusanCampaign.methods.finalizeRequest(0)
                .send({from: accounts[1], gas: 5000000});
            assert.fail("Should fail");
        } catch(error) {
            assert(error.message.includes("Only organiser can do that"));
        }
    });

    
    it('majority did not approve finalizing should fail', async function() {
        this.timeout(10000); //long test - increase initial timeout of 2000

        //first create request
        const requestAmount = '1000000000000000000';
        await dusanCampaign.methods.createRequest('Request for campaign funds 1', requestAmount)
            .send({from: accounts[0], gas: 5000000});

        //try to finalize without any approve should fail
        try
        {
            await dusanCampaign.methods.finalizeRequest(0)
                .send({from: accounts[0], gas: 5000000});
            assert.fail("Should fail");
        } catch(error) {
            assert(error.message.includes("Majority must approve"));
        }
    });

    it('finalizing multiple times should fail', async function() {
        this.timeout(10000); //long test - increase initial timeout of 2000

        //first create request
        const requestAmount = '1000000000000000000';
        await dusanCampaign.methods.createRequest('Request for campaign funds 1', requestAmount)
            .send({from: accounts[0], gas: 5000000});

        //now donate from 4 accounts
        for(let i = 1; i <= 4; i++) {
            await dusanCampaign.methods.donate()
                .send({from:accounts[i], gas: 5000000, value: web3.utils.toWei('10', 'ether')});
        }

        //approve from accounts 1, 2 and 3
        for(let i = 1; i <= 4; i++) {
            await dusanCampaign.methods.approveRequest(0)
                .send({from:accounts[i], gas: 5000000});
        }
        
        //finalize request
        await dusanCampaign.methods.finalizeRequest(0)
            .send({from: accounts[0], gas: 5000000});

        //try to finalize one more time should fail
        try
        {
            await dusanCampaign.methods.finalizeRequest(0)
                .send({from: accounts[0], gas: 5000000});
            assert.fail("Should fail");
        } catch(error) {
            assert(error.message.includes("Request can be completed once"));
        }
    });

    it('finalizing with sufficient funds should fail', async function() {
        this.timeout(10000); //long test - increase initial timeout of 2000

        //first create request
        const requestAmount = '100000000000000000'; // 0.1 ether - more than it will be donated
        await dusanCampaign.methods.createRequest('Request for campaign funds 1', requestAmount)
            .send({from: accounts[0], gas: 5000000});

        //now donate from 4 accounts
        for(let i = 1; i <= 4; i++) {
            await dusanCampaign.methods.donate()
                .send({from:accounts[i], gas: 5000000, value: web3.utils.toWei('0.01', 'ether')});
        }

        //approve from accounts 1, 2 and 3
        for(let i = 1; i <= 4; i++) {
            await dusanCampaign.methods.approveRequest(0)
                .send({from:accounts[i], gas: 5000000});
        }
        
        //finalize request should fail
        try
        {
            await dusanCampaign.methods.finalizeRequest(0)
                .send({from: accounts[0], gas: 5000000});
        } catch(error) {
            assert(error.message.includes("Contract doesn't have enough"));
        }
    });

    it('finalizeRequest', async function() {
        this.timeout(10000); //long test - increase initial timeout of 2000

        //first create request
        const requestAmount = '1000000000000000000';
        await dusanCampaign.methods.createRequest('Request for campaign funds 1', requestAmount)
            .send({from: accounts[0], gas: 5000000});

        //now donate from 4 accounts
        for(let i = 1; i <= 4; i++) {
            await dusanCampaign.methods.donate()
                .send({from:accounts[i], gas: 5000000, value: web3.utils.toWei('10', 'ether')});
        }

        //approve from accounts 1, 2 and 3
        for(let i = 1; i <= 4; i++) {
            await dusanCampaign.methods.approveRequest(0)
                .send({from:accounts[i], gas: 5000000});
        }
        
        //finalize request
        await dusanCampaign.methods.finalizeRequest(0)
            .send({from: accounts[0], gas: 5000000});

        //request should be completed=true
        const request = await dusanCampaign.methods.getRequest(0)
            .call({from:accounts[0]});
        assert.equal(request.compl, true);
    });
});