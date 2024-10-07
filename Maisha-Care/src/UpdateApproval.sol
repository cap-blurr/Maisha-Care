// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {RoleManager} from "./RoleManager.sol";

contract UpdateApproval {
    RoleManager public roleManager;

    struct PendingUpdate {
        address doctor;
        address patient;
        bytes32 dataHash;
        uint256 timestamp;
        bool doctorApproved;
        bool patientApproved;
    }

    mapping(bytes32 => PendingUpdate) public pendingUpdates;

    event UpdateInitiated(
        bytes32 indexed updateId,
        address indexed doctor,
        address indexed patient
    );
    event UpdateApproved(bytes32 indexed updateId, address indexed approver);
    event UpdateCompleted(bytes32 indexed updateId);

    constructor(address _roleManager) {
        roleManager = RoleManager(_roleManager);
    }

    function initiateUpdate(
        address _patient,
        bytes32 _dataHash
    ) public returns (bytes32) {
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender),
            "Must be a doctor"
        );
        bytes32 updateId = keccak256(
            abi.encodePacked(msg.sender, _patient, _dataHash, block.timestamp)
        );
        pendingUpdates[updateId] = PendingUpdate({
            doctor: msg.sender,
            patient: _patient,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            doctorApproved: true, // Set to true
            patientApproved: false
        });
        emit UpdateInitiated(updateId, msg.sender, _patient);
        emit UpdateApproved(updateId, msg.sender); // Emit event
        return updateId;
    }

    function approveUpdate(bytes32 _updateId) public {
        PendingUpdate storage update = pendingUpdates[_updateId];
        require(update.timestamp != 0, "Update does not exist");
        if (msg.sender == update.patient && !update.patientApproved) {
            update.patientApproved = true;
            emit UpdateApproved(_updateId, msg.sender);
        } else if (msg.sender == update.doctor && !update.doctorApproved) {
            update.doctorApproved = true;
            emit UpdateApproved(_updateId, msg.sender);
        } else {
            revert("Not authorized or already approved");
        }
        if (update.doctorApproved && update.patientApproved) {
            emit UpdateCompleted(_updateId);
        }
    }

    function isApproved(bytes32 _updateId) public view returns (bool) {
        PendingUpdate storage update = pendingUpdates[_updateId];
        return update.doctorApproved && update.patientApproved;
    }

    function getPendingUpdate(
        bytes32 _updateId
    ) public view returns (address, address, bytes32, uint256, bool, bool) {
        PendingUpdate storage update = pendingUpdates[_updateId];
        return (
            update.doctor,
            update.patient,
            update.dataHash,
            update.timestamp,
            update.doctorApproved,
            update.patientApproved
        );
    }
}
