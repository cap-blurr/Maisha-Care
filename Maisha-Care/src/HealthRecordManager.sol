// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {RoleManager} from "./RoleManager.sol";
import {CurrentHealth} from "./CurrentHealth.sol";
import {TemporaryAccess} from "./TemporaryAccess.sol";
import {MedicalHistory} from "./MedicalHistory.sol";
import {PersonalInfo} from "./PersonalInfo.sol";
import {TreatmentRecords} from "./TreatmentRecords.sol";
import {VerifiedAddressRegistry} from "./VerifiedAddressRegistry.sol";
import {UpdateApproval} from "./UpdateApproval.sol";
import {MaishaToken} from "./MaishaToken.sol";

error HealthRecordManage__NotAuthorized();

contract HealthRecordManager is AccessControl, Ownable {
    MaishaToken public maishaToken;
    PersonalInfo public personalInfo;
    MedicalHistory public medicalHistory;
    CurrentHealth public currentHealth;
    TreatmentRecords public treatmentRecords;
    RoleManager public roleManager;
    TemporaryAccess public temporaryAccess;
    UpdateApproval public updateApproval;

    mapping(address => bool) public dataMonetizationOptIn;

    event DataMonetizationOptIn(address indexed patient);
    event AccessGranted(address indexed patient, address indexed viewer);
    event AccessRevoked(address indexed patient, address indexed viewer);

    constructor(
        address _maishaTokenAddress,
        address _personalInfoAddress,
        address _medicalHistoryAddress,
        address _currentHealthAddress,
        address _treatmentRecordsAddress,
        address _roleManager,
        address _temporaryAccess,
        address _updateApproval
    ) Ownable(msg.sender) {
        maishaToken = MaishaToken(_maishaTokenAddress);
        personalInfo = PersonalInfo(_personalInfoAddress);
        medicalHistory = MedicalHistory(_medicalHistoryAddress);
        currentHealth = CurrentHealth(_currentHealthAddress);
        treatmentRecords = TreatmentRecords(_treatmentRecordsAddress);
        roleManager = RoleManager(_roleManager);
        temporaryAccess = TemporaryAccess(_temporaryAccess);
        updateApproval = UpdateApproval(_updateApproval);
    }

    function checkRole(address account) public view returns (string memory) {
        if (roleManager.hasRole(roleManager.DOCTOR_ROLE(), account)) {
            return "Doctor";
        } else if (roleManager.hasRole(roleManager.PATIENT_ROLE(), account)) {
            return "Patient";
        } else if (
            roleManager.hasRole(roleManager.RESEARCHER_ROLE(), account)
        ) {
            return "Researcher";
        } else if (roleManager.hasRole(roleManager.BUILDER_ROLE(), account)) {
            return "Builder";
        } else {
            return "No Role";
        }
    }

    // data modification functions
    function initiatePersonalInfoUpdate(
        address _patient,
        string memory _dataHash
    ) public {
        personalInfo.initiateInfoUpdate(_patient, _dataHash);
    }

    function initiateMedicalHistoryUpdate(
        address _patient,
        string memory _dataHash
    ) public {
        medicalHistory.initiateHistoryUpdate(_patient, _dataHash);
    }

    function initiateCurrentHealthUpdate(
        address _patient,
        string memory _dataHash
    ) public {
        currentHealth.initiateHealthUpdate(_patient, _dataHash);
    }

    function initiateTreatmentRecordAdd(
        address _patient,
        string memory _dataHash
    ) public {
        treatmentRecords.initiateAddRecord(_patient, _dataHash);
    }

    function approveUpdate(bytes32 _updateId) public {
        updateApproval.approveUpdate(_updateId);
    }

    function getPersonalInfo(
        address _patient
    ) public view returns (string memory, uint256) {
        return personalInfo.getInfo(_patient);
    }

    function getMedicalHistoryPatient(
        address _patient
    ) public view returns (string memory, uint256) {
        require(
            msg.sender == _patient,
            "Only the patient can access their own history"
        );
        return medicalHistory.getHistoryPatient(_patient);
    }

    function getMedicalHistoryDoctor(
        address _patient
    ) public view returns (string memory, uint256) {
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender),
            "Must be a doctor"
        );
        require(
            temporaryAccess.hasAccess(_patient, msg.sender),
            "Doctor does not have temporary access"
        );
        return medicalHistory.getHistoryDoctor(_patient);
    }

    // Current Health
    function getCurrentHealthPatient(
        address _patient
    ) public view returns (string memory, uint256) {
        require(
            msg.sender == _patient,
            "Only the patient can access their own current health"
        );
        return currentHealth.getHealthPatient(_patient);
    }

    function getCurrentHealthDoctor(
        address _patient
    ) public view returns (string memory, uint256) {
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender),
            "Must be a doctor"
        );
        require(
            temporaryAccess.hasAccess(_patient, msg.sender),
            "Doctor does not have temporary access"
        );
        return currentHealth.getHealthDoctor(_patient);
    }

    // Treatment Records
    function getTreatmentRecordsPatient(
        address _patient
    ) public view returns (string[] memory, uint256[] memory) {
        require(
            msg.sender == _patient,
            "Only the patient can access their own treatment records"
        );
        return treatmentRecords.getRecordsPatient(_patient);
    }

    function getTreatmentRecordsDoctor(
        address _patient
    ) public view returns (string[] memory, uint256[] memory) {
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender),
            "Must be a doctor"
        );
        require(
            temporaryAccess.hasAccess(_patient, msg.sender),
            "Doctor does not have temporary access"
        );
        return treatmentRecords.getRecordsDoctor(_patient);
    }

    function optInDataMonetization() public {
        require(
            roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender),
            "Must be a patient"
        );
        require(!dataMonetizationOptIn[msg.sender], "Already opted in");
        dataMonetizationOptIn[msg.sender] = true;
        uint256 rewardAmount = 1000 * 10 ** 18; // reward the user with 1000 tokens after opting in for data monetization
        maishaToken.mint(msg.sender, rewardAmount);
        emit DataMonetizationOptIn(msg.sender);
    }
}
