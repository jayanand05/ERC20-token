 //SPDX-License-Identifier:MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract DogeToken is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint256 public blockReward;
    constructor(uint256 cap, uint256 reward) ERC20("DogeToken", "DT") ERC20Capped(cap * (10 ** decimals())){
        owner = payable(msg.sender);
        _mint(owner, 70 * (10 ** decimals()));
        blockReward = reward * (10 ** decimals());
    }

    function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20Capped) {
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }


    //Rules of Hooks
/*There’s a few guidelines you should follow when writing code that uses hooks in order to prevent issues. 
They are very simple, but do make sure you follow them:*/

/*Whenever you override a parent’s hook, re-apply the virtual attribute to the hook.
  That will allow child contracts to add more functionality to the hook.*/

/*Always call the parent’s hook in your override using super. This will make sure all hooks in the inheritance tree are called:
   contracts like ERC20Pausable rely on this behavior.*/
    function _beforeTokenTransfer(address from, address to, uint256 value) internal virtual override {
        if(from != address(0) && to != block.coinbase && block.coinbase != address(0)){
            _mintMinerReward();
        }
        super._beforeTokenTransfer(from, to, value);
    }

    function setblockReward(uint256 reward) public onlyOwner{
        blockReward = reward * (10 ** decimals());
    }

    function destroy() public onlyOwner{
        selfdestruct(owner);
    }

    modifier onlyOwner {
        require(owner == msg.sender, "Sender is not the owner");
        _;
    }
}