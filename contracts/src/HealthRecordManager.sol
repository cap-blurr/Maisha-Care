// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {RoleManager} from "./RoleManager.sol";
import {CurrentHealth} from "./CurrentHealth.sol";
import {TemporaryAccess} from "./TemporaryAccess.sol";
import {MedicalHistory} from "./MedicalHistory.sol";
import {PersonalInfo} from "./PersonalInfo.sol";
import {TreatmentRecords} from "./TreatmentRecords.sol";
import {UpdateApproval} from "./UpdateApproval.sol";
import {MaishaToken} from "./MaishaToken.sol";

/// @title HealthRecordManager
/// @notice Central contract for managing health records in the Maisha ecosystem
/// @dev Coordinates interactions between various health record components and token rewards
contract HealthRecordManager is AccessControl, Ownable {
    // Custom errors
    error NotAuthorized();
    error AlreadyOptedIn();
    error InvalidAddress();

    // Constants
    uint256 private constant OPT_IN_REWARD = 1000 * 10 ** 18; // 1000 tokens

    // Immutable variables
    MaishaToken public immutable maishaToken;
    PersonalInfo public immutable personalInfo;
    MedicalHistory public immutable medicalHistory;
    CurrentHealth public immutable currentHealth;
    TreatmentRecords public immutable treatmentRecords;
    RoleManager public immutable roleManager;
    TemporaryAccess public immutable temporaryAccess;
    UpdateApproval public immutable updateApproval;

    // State variables
    mapping(address => bool) public dataMonetizationOptIn;

    // Events
    event DataMonetizationOptIn(address indexed patient);
    event DataUpdateInitiated(
        address indexed patient,
        address indexed initiator,
        string dataType,
        bytes32 updateId
    );

    /// @notice Contract constructor
    /// @param _maishaToken Address of the MaishaToken contract
    /// @param _personalInfo Address of the PersonalInfo contract
    /// @param _medicalHistory Address of the MedicalHistory contract
    /// @param _currentHealth Address of the CurrentHealth contract
    /// @param _treatmentRecords Address of the TreatmentRecords contract
    /// @param _roleManager Address of the RoleManager contract
    /// @param _temporaryAccess Address of the TemporaryAccess contract
    /// @param _updateApproval Address of the UpdateApproval contract
    constructor(
        address _maishaToken,
        address _personalInfo,
        address _medicalHistory,
        address _currentHealth,
        address _treatmentRecords,
        address _roleManager,
        address _temporaryAccess,
        address _updateApproval
    ) Ownable(msg.sender) {
        if (
            _maishaToken == address(0) ||
            _personalInfo == address(0) ||
            _medicalHistory == address(0) ||
            _currentHealth == address(0) ||
            _treatmentRecords == address(0) ||
            _roleManager == address(0) ||
            _temporaryAccess == address(0) ||
            _updateApproval == address(0)
        ) {
            revert InvalidAddress();
        }

        maishaToken = MaishaToken(_maishaToken);
        personalInfo = PersonalInfo(_personalInfo);
        medicalHistory = MedicalHistory(_medicalHistory);
        currentHealth = CurrentHealth(_currentHealth);
        treatmentRecords = TreatmentRecords(_treatmentRecords);
        roleManager = RoleManager(_roleManager);
        temporaryAccess = TemporaryAccess(_temporaryAccess);
        updateApproval = UpdateApproval(_updateApproval);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Check the role of an account
    /// @param account Address to check
    /// @return string The role of the account
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

    /// @notice Initiate a personal info update
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new personal info
    function initiatePersonalInfoUpdate(
        address _patient,
        string memory _dataHash
    ) public {
        bytes32 updateId = personalInfo.initiateInfoUpdate(_patient, _dataHash);
        emit DataUpdateInitiated(
            _patient,
            msg.sender,
            "PersonalInfo",
            updateId
        );
    }

    /// @notice Initiate a medical history update
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new medical history
    function initiateMedicalHistoryUpdate(
        address _patient,
        string memory _dataHash
    ) public {
        bytes32 updateId = medicalHistory.initiateHistoryUpdate(
            _patient,
            _dataHash
        );
        emit DataUpdateInitiated(
            _patient,
            msg.sender,
            "MedicalHistory",
            updateId
        );
    }

    /// @notice Initiate a current health update
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new current health data
    function initiateCurrentHealthUpdate(
        address _patient,
        string memory _dataHash
    ) public {
        bytes32 updateId = currentHealth.initiateHealthUpdate(
            _patient,
            _dataHash
        );
        emit DataUpdateInitiated(
            _patient,
            msg.sender,
            "CurrentHealth",
            updateId
        );
    }

    /// @notice Initiate adding a treatment record
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new treatment record
    function initiateTreatmentRecordAdd(
        address _patient,
        string memory _dataHash
    ) public {
        bytes32 updateId = treatmentRecords.initiateAddRecord(
            _patient,
            _dataHash
        );
        emit DataUpdateInitiated(
            _patient,
            msg.sender,
            "TreatmentRecord",
            updateId
        );
    }

    /// @notice Approve an update
    /// @param _updateId Unique identifier of the update to be approved
    function approveUpdate(bytes32 _updateId) public {
        updateApproval.approveUpdate(_updateId);
    }

    /// @notice Get personal info for a patient
    /// @param _patient Address of the patient
    /// @return string The personal info data hash
    /// @return uint256 The last update timestamp
    function getPersonalInfo(
        address _patient
    ) public view returns (string memory, uint256) {
        return personalInfo.getInfo(_patient);
    }

    /// @notice Get medical history for a patient (patient access)
    /// @param _patient Address of the patient
    /// @return string The medical history data hash
    /// @return uint256 The last update timestamp
    function getMedicalHistoryPatient(
        address _patient
    ) public view returns (string memory, uint256) {
        if (msg.sender != _patient) revert NotAuthorized();
        return medicalHistory.getHistoryPatient(_patient);
    }

    /// @notice Get medical history for a patient (doctor access)
    /// @param _patient Address of the patient
    /// @return string The medical history data hash
    /// @return uint256 The last update timestamp
    function getMedicalHistoryDoctor(
        address _patient
    ) public view returns (string memory, uint256) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender))
            revert NotAuthorized();
        if (!temporaryAccess.hasAccess(_patient, msg.sender))
            revert NotAuthorized();
        return medicalHistory.getHistoryDoctor(_patient);
    }

    /// @notice Get current health for a patient (patient access)
    /// @param _patient Address of the patient
    /// @return string The current health data hash
    /// @return uint256 The last update timestamp
    function getCurrentHealthPatient(
        address _patient
    ) public view returns (string memory, uint256) {
        if (msg.sender != _patient) revert NotAuthorized();
        return currentHealth.getHealthPatient(_patient);
    }

    /// @notice Get current health for a patient (doctor access)
    /// @param _patient Address of the patient
    /// @return string The current health data hash
    /// @return uint256 The last update timestamp
    function getCurrentHealthDoctor(
        address _patient
    ) public view returns (string memory, uint256) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender))
            revert NotAuthorized();
        if (!temporaryAccess.hasAccess(_patient, msg.sender))
            revert NotAuthorized();
        return currentHealth.getHealthDoctor(_patient);
    }

    /// @notice Get treatment records for a patient (patient access)
    /// @param _patient Address of the patient
    /// @return string[] Array of treatment record hashes
    /// @return uint256[] Array of update timestamps
    function getTreatmentRecordsPatient(
        address _patient
    ) public view returns (string[] memory, uint256[] memory) {
        if (msg.sender != _patient) revert NotAuthorized();
        return treatmentRecords.getRecordsPatient(_patient);
    }

    /// @notice Get treatment records for a patient (doctor access)
    /// @param _patient Address of the patient
    /// @return string[] Array of treatment record hashes
    /// @return uint256[] Array of update timestamps
    function getTreatmentRecordsDoctor(
        address _patient
    ) public view returns (string[] memory, uint256[] memory) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender))
            revert NotAuthorized();
        if (!temporaryAccess.hasAccess(_patient, msg.sender))
            revert NotAuthorized();
        return treatmentRecords.getRecordsDoctor(_patient);
    }

    /// @notice Opt in for data monetization
    function optInDataMonetization() public {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender))
            revert NotAuthorized();
        if (dataMonetizationOptIn[msg.sender]) revert AlreadyOptedIn();

        dataMonetizationOptIn[msg.sender] = true;
        maishaToken.mint(msg.sender, OPT_IN_REWARD);
        emit DataMonetizationOptIn(msg.sender);
    }
}
