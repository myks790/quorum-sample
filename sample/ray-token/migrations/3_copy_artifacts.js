const RayToken = artifacts.require("RayToken");
const Ray721Token = artifacts.require("Ray721Token");
const MyCrowdsale = artifacts.require("MyCrowdsale");
const Market = artifacts.require("Market");

const shell = require('child_process').execSync;

const src = `./../build/contracts`;
const dist = `./../../viewer-react/src/contracts`;
shell(`mkdir -p ${dist}`);
shell(`cp -r ${src}/* ${dist}`);

const fs = require('fs');

module.exports = function (deployer) {

    fs.writeFileSync("./../viewer-react/src/contracts/ContractsAddress.json",
        "{" +
            "\"RayToken\":\"" + RayToken.address + "\"," +
            "\"Ray721Token\":\"" + Ray721Token.address + "\"," +
            "\"MyCrowdsale\":\"" + MyCrowdsale.address + "\"," +
            "\"Market\":\"" + Market.address + "\"" +
        "}",
        function (err) {
            console.log(err)
        }
    );
};
