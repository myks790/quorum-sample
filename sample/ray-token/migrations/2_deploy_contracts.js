const RayToken = artifacts.require("RayToken");
const Ray721Token = artifacts.require("Ray721Token");
const MyCrowdsale = artifacts.require("MyCrowdsale");
const Market = artifacts.require("Market");
const ClaimHolder = artifacts.require("ClaimHolder");
const ClaimHolderLibrary = artifacts.require("ClaimHolderLibrary");
const KeyHolderLibrary = artifacts.require("KeyHolderLibrary");

module.exports = function (deployer, network, accounts) {
    return deployer.then(() => {
        return deployer.deploy(RayToken, "RayToken", "R", 2);
    }).then(() => {
        return deployer.deploy(KeyHolderLibrary);
    }).then(() => {
        deployer.link(KeyHolderLibrary, ClaimHolderLibrary);
        return deployer.deploy(ClaimHolderLibrary);
    }).then(() => {
        deployer.link(KeyHolderLibrary, ClaimHolder);
        deployer.link(ClaimHolderLibrary, ClaimHolder);
        return deployer.deploy(ClaimHolder);
    }).then(() => {
        return deployer.deploy(Ray721Token, "Ray721Token", "R_NFT");
    }).then(() => {
        return deployer.deploy(Market, RayToken.address, Ray721Token.address);
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