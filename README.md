# 🎰 ZK Vending Machine

A thought experiment and prototype: What would an in-game barter system within universes like [Darkforest](https://zkga.me/) look like? How can we enforce notions of "space" in a cyber-space game?

Here I propose ZK Vending Machine, a hypothetical game element that allows users to set up "shop" within a game and trade" It would work like this: 

## How it works

While venturing through the Darkforest universe, Alice lands on a planet and discovers that on this coordinate, there's a vending machine. Through a commonly shared interface, a previous player has set up shop here, an AMM to trade lets say silver for gold. The trick is that to interact with this vending machine, one know the exact coordinates of the vending machine and be nearby it, so this way only players that have discovered it can. This is enforced through a zkSNARK. Alice is happy to find the machine and trades her gold for some silver. Bob, the shop owner, collects the gold passively. 

A few moments later, fellow space traveler Charlie also comes across this machine. He doesn't quite like it, and thinks he should be setting up shop here instead. So, he attacks the vending machine and replaces it with his own, with potentially a better trading rate. In this case, he "attacks" by staking some in-game tokens and therefore becomes the new owner of this shop. 

This is possible because all the vending machines share the same programming interface, effectively allowing users to "install" new shops! Under the hood, it's a proxy contract that changes the destination address which is provided by the new owner.

Please follow me [here](https://twitter.com/kzdagoof) and reach out [here](https://thekevinz.com/) to jam on ideas!
