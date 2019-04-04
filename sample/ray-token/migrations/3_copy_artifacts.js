const RayToken = artifacts.require("RayToken");
const Ray721Token = artifacts.require("Ray721Token");
const MyCrowdsale = artifacts.require("MyCrowdsale");
const MyCrowdsaleWithHolder = artifacts.require("MyCrowdsaleWithHolder");
const Market = artifacts.require("Market");
const ClaimHolder = artifacts.require("ClaimHolder");
const ClaimHolderLibrary = artifacts.require("ClaimHolderLibrary");
const KeyHolderLibrary = artifacts.require("KeyHolderLibrary");
const ClaimHolderV2 = artifacts.require("ClaimHolderV2");
const LicenseRepository = artifacts.require("LicenseRepository");
const KeyManager = artifacts.require("KeyManager");

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
        "\"MyCrowdsaleWithHolder\":\"" + MyCrowdsaleWithHolder.address + "\"," +
        "\"Market\":\"" + Market.address + "\"," +
        "\"ClaimHolder\":\"" + ClaimHolder.address + "\"," +
        "\"ClaimHolderLibrary\":\"" + ClaimHolderLibrary.address + "\"," +
        "\"KeyHolderLibrary\":\"" + KeyHolderLibrary.address + "\"," +
        "\"ClaimHolderV2\":\"" + ClaimHolderV2.address + "\"," +
        "\"LicenseRepository\":\"" + LicenseRepository.address + "\"," +
        "\"KeyManager\":\"" + KeyManager.address + "\"" +
        "}",
        function (err) {
            console.log(err)
        }
    );
};
