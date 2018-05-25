pragma solidity ^0.4.11;

contract CKGen0Producer {
    event Birth(address owner, uint256 kittyId, uint256 matronId, uint256 sireId, uint256 genes);

    address public owner;
    mapping (uint256 => address) public kittyToOwner;
    uint256[] kitties;
    uint256 public totalSupply = 0;
    uint256 public constant GEN0_STARTING_PRICE = 100 finney;

    function CKGen0Producer() public {
        owner = msg.sender;
    }

    function createGen0Auction(uint256 _genes) external {
        uint256 newKittenId = kitties.push(_genes) - 1;
        
        // emit the birth event
        Birth(address(this), newKittenId, 0, 0, _genes);
        totalSupply++;
    }

    function bid(uint256 kittyId) external payable {
        require(msg.value > GEN0_STARTING_PRICE);
        require(kittyId < totalSupply); // kitty exists
        require(kittyToOwner[kittyId] == address(0)); // not yet sold
        
        kittyToOwner[kittyId] = msg.sender;
        uint256 bidExcess = msg.value - GEN0_STARTING_PRICE;

        if(bidExcess != 0) {
            msg.sender.transfer(bidExcess);
        }
    }

    function destroy() external {
        require(msg.sender == owner);
        selfdestruct(msg.sender);
    }
}
