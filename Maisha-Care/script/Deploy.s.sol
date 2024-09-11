// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/VerifiedAddressRegistry.sol";
import "../src/RoleManager.sol";
import "../src/UpdateApproval.sol";
import "../src/PersonalInfo.sol";
import "../src/MedicalHistory.sol";
import "../src/CurrentHealth.sol";
import "../src/TreatmentRecords.sol";
import "../src/HealthRecordManager.sol";
import "../src/MaishaToken.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy VerifiedAddressRegistry
        VerifiedAddressRegistry verifiedRegistry = new VerifiedAddressRegistry(
            deployerAddress
        );

        // Deploy RoleManager
        RoleManager roleManager = new RoleManager(address(verifiedRegistry));

        // Deploy UpdateApproval
        UpdateApproval updateApproval = new UpdateApproval(
            address(roleManager)
        );

        // Deploy PersonalInfo
        PersonalInfo personalInfo = new PersonalInfo(
            address(roleManager),
            address(updateApproval)
        );

        // Deploy MedicalHistory
        MedicalHistory medicalHistory = new MedicalHistory(
            address(roleManager),
            address(updateApproval)
        );

        // Deploy CurrentHealth
        CurrentHealth currentHealth = new CurrentHealth(
            address(roleManager),
            address(updateApproval)
        );

        // Deploy TreatmentRecords
        TreatmentRecords treatmentRecords = new TreatmentRecords(
            address(roleManager),
            address(updateApproval)
        );

        // Deploy HealthRecordManager
        HealthRecordManager healthRecordManager = new HealthRecordManager(
            address(personalInfo),
            address(medicalHistory),
            address(currentHealth),
            address(treatmentRecords),
            address(roleManager),
            address(updateApproval)
        );

        // Deploy MaishaToken
        MaishaToken maishaToken = new MaishaToken();

        vm.stopBroadcast();

        // Log deployed addresses
        console.log(
            "VerifiedAddressRegistry deployed to:",
            address(verifiedRegistry)
        );
        console.log("RoleManager deployed to:", address(roleManager));
        console.log("UpdateApproval deployed to:", address(updateApproval));
        console.log("PersonalInfo deployed to:", address(personalInfo));
        console.log("MedicalHistory deployed to:", address(medicalHistory));
        console.log("CurrentHealth deployed to:", address(currentHealth));
        console.log("TreatmentRecords deployed to:", address(treatmentRecords));
        console.log(
            "HealthRecordManager deployed to:",
            address(healthRecordManager)
        );
        console.log("MaishaToken deployed to:", address(maishaToken));
    }
}
