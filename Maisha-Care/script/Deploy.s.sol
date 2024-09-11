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
import "../src/TemporaryAccess.sol";
import "../src/HealthRecordManager.sol";
import "../src/MaishaToken.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy contracts in order
        VerifiedAddressRegistry verifiedRegistry = new VerifiedAddressRegistry();
        MaishaToken maishaToken = new MaishaToken();

        RoleManager roleManager = new RoleManager(address(verifiedRegistry));

        UpdateApproval updateApproval = new UpdateApproval(
            address(roleManager)
        );

        PersonalInfo personalInfo = new PersonalInfo(
            address(roleManager),
            address(updateApproval)
        );
        MedicalHistory medicalHistory = new MedicalHistory(
            address(roleManager),
            address(updateApproval)
        );
        CurrentHealth currentHealth = new CurrentHealth(
            address(roleManager),
            address(updateApproval)
        );
        TreatmentRecords treatmentRecords = new TreatmentRecords(
            address(roleManager),
            address(updateApproval)
        );
        TemporaryAccess temporaryAccess = new TemporaryAccess(
            address(roleManager)
        );

        // Deploy HealthRecordManager last
        HealthRecordManager healthRecordManager = new HealthRecordManager(
            address(maishaToken),
            address(personalInfo),
            address(medicalHistory),
            address(currentHealth),
            address(treatmentRecords),
            address(roleManager),
            address(temporaryAccess),
            address(updateApproval)
        );

        // Ownership transfer
        personalInfo.transferOwnership(address(healthRecordManager));
        medicalHistory.transferOwnership(address(healthRecordManager));
        currentHealth.transferOwnership(address(healthRecordManager));
        treatmentRecords.transferOwnership(address(healthRecordManager));

        vm.stopBroadcast();

        // Log deployed addresses
        console.log(
            "VerifiedAddressRegistry deployed to:",
            address(verifiedRegistry)
        );
        console.log("RoleManager deployed to:", address(roleManager));
        console.log("UpdateApproval deployed to:", address(updateApproval));
        console.log("MaishaToken deployed to:", address(maishaToken));
        console.log("PersonalInfo deployed to:", address(personalInfo));
        console.log("MedicalHistory deployed to:", address(medicalHistory));
        console.log("CurrentHealth deployed to:", address(currentHealth));
        console.log("TreatmentRecords deployed to:", address(treatmentRecords));
        console.log("TemporaryAccess deployed to:", address(temporaryAccess));
        console.log(
            "HealthRecordManager deployed to:",
            address(healthRecordManager)
        );
    }
}
