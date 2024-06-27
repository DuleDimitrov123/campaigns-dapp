pragma solidity ^0.4.26;

import "./Campaign.sol";

contract CampaignManager {
    address[] public campaigns;

    function createCampaign(address organiser, string title, string description, uint minDonationInWei) public {
        address newCampaign = new Campaign(organiser, title, description, minDonationInWei);
        campaigns.push(newCampaign);
    }

    function getCampagins() public view returns (address[]) {
        return campaigns;
    }

    function getTotalDonations() public view returns(uint) {
        uint total = 0;

        for (uint i=0; i <= campaigns.length - 1; i++) {
            total += Campaign(campaigns[i]).getTotalDonations();
        }

        return total;
    }
}