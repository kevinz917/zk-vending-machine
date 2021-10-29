# 🎰 ZK Vending Machine

A thought experiment and prototype: What would an in-game barter system within universes like [Darkforest](https://zkga.me/) look like? How can we enforce notions of "space" in a cyber-space game?

Here I propose ZK Vending Machine, a hypothetical game element that allows users to set up "shop" within a game and trade. New users can contest this shop and overtake the shop as well. Here's how one example could work out:

[[INSERT GRAPHIC HERE]]

## How it works

While venturing through the cyberspace (one like Darkforest), Alice lands on a planet and discovers that on this coordinate, there's a vending machine, and a previous player has set up shop here. The shop is an AMM to trade lets say silver for gold (examples of two in-game currencies). To interact with this vending machine, one know the exact coordinates of the vending machine and be nearby it, so this way only players that have discovered it can do so - this is enforced through a zkSNARK. Alice is happy to find the machine and trades her gold for some silver. Bob, the shop owner, collects the gold passively.

Moments later, fellow space cowboy Charlie also comes across this coordinate and discovers this machine. He doesn't quite like this shop, and thinks he should be setting up shop here instead. So, he attacks the vending machine and replaces it with his own (overtake mechanism), with potentially a better trading rate. In this case, he "attacks", in this case by staking some in-game tokens, and therefore becomes the new owner of this shop. The game designers also give shop owners a boost, effectively subsidizing their activity and incentivizing users to set up shop within the game instead of transacting outside.

This is possible because all the vending machines will share the same programming interface, effectively allowing users to "install" new shops! Under the hood, it's points at different contracts and executes the call with some given calldata, governed by the current owner.

Please follow me [here](https://twitter.com/kzdagoof) and reach out [here](https://thekevinz.com/) to jam on ideas!
