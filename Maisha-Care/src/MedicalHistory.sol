// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {RoleManager} from "./RoleManager.sol";
import {UpdateApproval} from "./UpdateApproval.sol";
import {TemporaryAccess} from "./TemporaryAccess.sol";

contract MedicalHistory is Ownable {
    RoleManager public roleManager;
    UpdateApproval public updateApproval;
    TemporaryAccess public temporaryAccess;

    struct History {
        string dataHash;
        uint256 lastUpdated;
    }

    mapping(address => History) private medicalHistories;

    event HistoryUpdateInitiated(
        address indexed patient,
        address indexed doctor,
        bytes32 updateId
    );
    event HistoryUpdated(address indexed patient, uint256 timestamp);

    constructor(
        address _roleManagerAddress,
        address _updateApprovalAddress,
        address _TemporaryAccess
    ) Ownable(msg.sender) {
        roleManager = RoleManager(_roleManagerAddress);
        updateApproval = UpdateApproval(_updateApprovalAddress);
        temporaryAccess = TemporaryAccess(_TemporaryAccess);
    }

    function initiateHistoryUpdate(
        address _patient,
        string memory _dataHash
    ) public {
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender),
            "Must be a doctor"
        );
        bytes32 updateId = updateApproval.initiateUpdate(
            _patient,
            keccak256(abi.encodePacked(_dataHash))
        );
        emit HistoryUpdateInitiated(_patient, msg.sender, updateId);
    }

    function updateHistory(bytes32 _updateId) public {
        require(updateApproval.isApproved(_updateId), "Update not approved");
        (
            address doctor,
            address patient,
            bytes32 dataHash,
            ,
            ,

        ) = updateApproval.getPendingUpdate(_updateId);
        require(msg.sender == doctor, "Only initiating doctor can update");

        medicalHistories[patient] = History(
            bytes32ToString(dataHash),
            block.timestamp
        );
        emit HistoryUpdated(patient, block.timestamp);
    }

    function getHistoryPatient(
        address _patient
    ) public view returns (string memory, uint256) {
        require(
            roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender),
            "Must be patient"
        );
        History memory history = medicalHistories[_patient];
        return (history.dataHash, history.lastUpdated);
    }

    function getHistoryDoctor(
        address _patient
    ) public view returns (string memory, uint256) {
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender),
            "Must be doctor"
        );
    }

    function getAnonymizedHistory(
        address _patient
    ) public view returns (uint256) {
        require(
            roleManager.hasRole(roleManager.RESEARCHER_ROLE(), msg.sender),
            "Must be a researcher"
        );
        return medicalHistories[_patient].lastUpdated;
    }

    function getBuilderHistory(address _patient) public view returns (uint256) {
        require(
            roleManager.hasRole(roleManager.BUILDER_ROLE(), msg.sender),
            "Must be a builder"
        );
        return medicalHistories[_patient].lastUpdated;
    }

    function bytes32ToString(
        bytes32 _bytes32
    ) private pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}
