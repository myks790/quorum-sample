const RayToken = artifacts.require("RayToken");
const MyCrowdsale = artifacts.require("MyCrowdsale");


module.exports = function (deployer, network, accounts) {

    return deployer.then(() => {
        return deployer.deploy(RayToken, "RayToken", "R", 2)
    }).then(() => {
        return deployer.deploy(MyCrowdsale, 1, accounts[0], RayToken.address);
    }).then(()=>{
        return RayToken.deployed().then((token)=>{
            token.addMinter(MyCrowdsale.address);
            token.renounceMinter();
        })
    })
};