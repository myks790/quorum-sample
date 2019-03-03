const RayToken = artifacts.require("RayToken");
const Ray721Token = artifacts.require("Ray721Token");
const MyCrowdsale = artifacts.require("MyCrowdsale");
const Market = artifacts.require("Market");

module.exports = function (deployer, network, accounts) {
    return deployer.then(() => {
        return deployer.deploy(Ray721Token, "Ray721Token", "R_NFT");
    }).then(() => {
        return deployer.deploy(Market, Ray721Token.address);
    }).then(() => {
        return deployer.deploy(RayToken, "RayToken", "R", 2);
    }).then(() => {
        return deployer.deploy(MyCrowdsale, 1, accounts[0], RayToken.address);
    }).then(() => {
        return RayToken.deployed().then((token) => {
            token.addMinter(MyCrowdsale.address).then(() => {
                token.renounceMinter();
            })
        })
    });
};