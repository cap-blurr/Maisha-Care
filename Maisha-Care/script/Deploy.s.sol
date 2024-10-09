// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {VerifiedAddressRegistry} from "../src/VerifiedAddressRegistry.sol";
import {RoleManager} from "../src/RoleManager.sol";
import {UpdateApproval} from "../src/UpdateApproval.sol";
import {PersonalInfo} from "../src/PersonalInfo.sol";
import {MedicalHistory} from "../src/MedicalHistory.sol";
import {CurrentHealth} from "../src/CurrentHealth.sol";
import {TreatmentRecords} from "../src/TreatmentRecords.sol";
import {TemporaryAccess} from "../src/TemporaryAccess.sol";
import {HealthRecordManager} from "../src/HealthRecordManager.sol";
import {MaishaToken} from "../src/MaishaToken.sol";

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

        TemporaryAccess temporaryAccess = new TemporaryAccess(
            address(roleManager)
        );

        PersonalInfo personalInfo = new PersonalInfo(
            address(roleManager),
            address(updateApproval)
        );
        MedicalHistory medicalHistory = new MedicalHistory(
            address(roleManager),
            address(updateApproval),
            address(temporaryAccess)
        );
        CurrentHealth currentHealth = new CurrentHealth(
            address(roleManager),
            address(updateApproval),
            address(temporaryAccess)
        );
        TreatmentRecords treatmentRecords = new TreatmentRecords(
            address(roleManager),
            address(updateApproval),
            address(temporaryAccess)
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
        maishaToken.transferOwnership(address(healthRecordManager));

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
