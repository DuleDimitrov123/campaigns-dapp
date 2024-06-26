pragma solidity ^0.4.26;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public organiser;
    string public title;
    string public description;
    uint public minDonationInWei;

    mapping(address => uint) public donations;
    address[] public donors;

    constructor(address org, string tit, string desc, uint minDonInWei) public {
        organiser = org;
        title = tit;
        description = desc;
        minDonationInWei = minDonInWei;
    }

    function() public payable {
        donate();
    }

    modifier onlyDonationsAboveMinDonation() {
        require(
            msg.value >= minDonationInWei,
            "Only donations above min donation are allowed"
        );
        _;
    }

    function donate() public payable onlyDonationsAboveMinDonation {
        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }

        donations[msg.sender] += msg.value;
    }

    function getDonors() public view returns (address[]) {
        return donors;
    }

    function getTotalDonations() public view returns (uint) {
        uint raised = 0;

        for (uint i = 0; i <= donors.length - 1; i++) {
            raised += donations[donors[i]];
        }

        return raised;
    }

    modifier onlyOrganiser() {
        require(msg.sender == organiser, "Only organiser can do that");
        _;
    }

    function createRequest(string desc, uint val) public onlyOrganiser {
        requests.push(
            Request({
                description: desc,
                value: val,
                recipient: organiser,
                complete: false,
                approvalCount: 0
            })
        );
    }

    function getRequest(
        uint index
    )
        public
        view
        returns (string desc, uint val, address rec, bool compl, uint apprCount)
    {
        return (
            requests[index].description,
            requests[index].value,
            requests[index].recipient,
            requests[index].complete,
            requests[index].approvalCount
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }

    modifier onlyDonor() {
        require(donations[msg.sender] > 0, "This is only donor action");
        _;
    }

    modifier donorCanApproveOnlyOnce(uint index) {
        require(
            !requests[index].approvals[msg.sender],
            "Donor can approve only once"
        );
        _;
    }

    function approveRequest(
        uint index
    ) public onlyDonor donorCanApproveOnlyOnce(index) {
        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCount++;
    }

    function getApprovers(uint requestIndex) public view returns (address[]) {
        address[] memory approvers = new address[](
            requests[requestIndex].approvalCount
        );
        uint count = 0;

        for (uint i = 0; i <= donors.length - 1; i++) {
            if (requests[requestIndex].approvals[donors[i]]) {
                approvers[count] = donors[i];
                count++;
            }
        }

        return approvers;
    }

    modifier majorityMustApprove(uint index) {
        require(
            requests[index].approvalCount > (donors.length / 2),
            "Majority must approve"
        );
        _;
    }

    modifier requestCanBeCompletedOnce(uint index) {
        require(!requests[index].complete, "Request can be completed once");
        _;
    }

    modifier contractHasMoreThan(uint requestIndex) {
        require(
            requests[requestIndex].value <= address(this).balance,
            "Contract doesn't have enough"
        );
        _;
    }

    function finalizeRequest(
        uint index
    )
        public
        onlyOrganiser
        majorityMustApprove(index)
        requestCanBeCompletedOnce(index)
        contractHasMoreThan(index)
    {
        requests[index].recipient.transfer(requests[index].value);
        requests[index].complete = true;
    }
}
