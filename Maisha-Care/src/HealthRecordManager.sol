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

contract HealthRecordManager is AccessControl,Ownable {
    MaishaToken public maishaToken;
    PersonalInfo public personalInfo;
    MedicalHistory public medicalHistory;
    CurrentHealth public currentHealth;
    TreatmentRecords public treatmentRecords;
    RoleManager public roleManager;
    TemporaryAccess public temporaryAccess;
    UpdateApproval public updateApproval;

    mapping(address => mapping(address => bool)) private authorizedViewers;

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
        } else if (roleManager.hasRole(roleManager.RESEARCHER_ROLE(), account)) {
            return "Researcher";
        } else if (roleManager.hasRole(roleManager.BUILDER_ROLE(), account)) {
            return "Builder";
        } else {
            return "No Role";
        }
    }


    // data modification functions
    function initiatePersonalInfoUpdate(address _patient, string memory _dataHash) public {
        personalInfo.initiateInfoUpdate(_patient, _dataHash);
    }

    function initiateMedicalHistoryUpdate(address _patient, string memory _dataHash) public {
        medicalHistory.initiateHistoryUpdate(_patient, _dataHash);
    }

    function initiateCurrentHealthUpdate(address _patient, string memory _dataHash) public {
        currentHealth.initiateHealthUpdate(_patient, _dataHash);
    }

    function initiateTreatmentRecordAdd(address _patient, string memory _dataHash) public {
        treatmentRecords.initiateAddRecord(_patient, _dataHash);
    }

    function approveUpdate(bytes32 _updateId) public {
        updateApproval.approveUpdate(_updateId);
    }

    function getPersonalInfo(address _patient) public view onlyAuthorized(_patient) returns (string memory, uint256) {
        return personalInfo.getInfo(_patient);
    }

    function getMedicalHistory(address _patient) public view onlyAuthorized(_patient) returns (string memory, uint256) {
        return medicalHistory.getHistory(_patient);
    }

    function getCurrentHealth(address _patient) public view onlyAuthorized(_patient) returns (string memory, uint256) {
        return currentHealth.getHealth(_patient);
    }

    function getTreatmentRecords(address _patient) public view onlyAuthorized(_patient) returns (string[] memory, uint256[] memory) {
        return treatmentRecords.getRecords(_patient);
    }

    function grantAccess(address _viewer) public {
        authorizedViewers[msg.sender][_viewer] = true;
        emit AccessGranted(msg.sender, _viewer);
    }

    function revokeAccess(address _viewer) public {
        authorizedViewers[msg.sender][_viewer] = false;
        emit AccessRevoked(msg.sender, _viewer);
    }

    function isAuthorized(address _patient, address _viewer) public view returns (bool) {
        return _patient == _viewer || authorizedViewers[_patient][_viewer];
    }

    modifier onlyAuthorized(address _patient) {
        if (!isAuthorized(_patient, msg.sender)) revert HealthRecordManage__NotAuthorized();
        _;
    }

}