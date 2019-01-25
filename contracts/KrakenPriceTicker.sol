pragma solidity ^0.5.0;

import './OraclizeAPI.sol';

contract KrakenPriceTicker is usingOraclize {

    string public priceETHUSD;

    event LogNewOraclizeQuery(string description);
    event LogNewKrakenPriceTicker(string price);

    constructor() public {
        oraclize_setProof(proofType_Android | proofStorage_IPFS);
        update(); // Update price on contract creation...
    }

    function __callback(bytes32, string memory result, bytes memory) public {
        require(msg.sender == oraclize_cbAddress());
        priceETHUSD = result;
        emit LogNewKrakenPriceTicker(priceETHUSD);
    }

    function update() public payable {
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee!");
        } else {
            emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer...");
            oraclize_query(60, "URL", "json(https://api.kraken.com/0/public/Ticker?pair=ETHUSD).result.XETHZUSD.c.0");
        }
    }
}
