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
    
    event UpdateInitiated(bytes32 indexed updateId, address indexed doctor, address indexed patient);
    event UpdateApproved(bytes32 indexed updateId, address indexed approver);
    event UpdateCompleted(bytes32 indexed updateId);
    
    constructor(address _roleManager) {
        roleManager = RoleManager(_roleManager);
    }
    
    function initiateUpdate(address _patient, bytes32 _dataHash) public returns(bytes32){
        require(roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender), "Must be a doctor");
        require(roleManager.hasRole(roleManager.PATIENT_ROLE(), _patient), "Invalid patient address");
        
        bytes32 updateId = keccak256(abi.encodePacked(msg.sender, _patient, _dataHash, block.timestamp));
        
        pendingUpdates[updateId] = PendingUpdate({
            doctor: msg.sender,
            patient: _patient,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            doctorApproved: true,
            patientApproved: false
        });
        
        emit UpdateInitiated(updateId, msg.sender, _patient);

        return updateId;
    }
    
    function approveUpdate(bytes32 _updateId) public {
        PendingUpdate storage update = pendingUpdates[_updateId];
        require(update.timestamp != 0, "Update does not exist");
        require(msg.sender == update.patient, "Only patient can approve");
        require(!update.patientApproved, "Already approved");
        
        update.patientApproved = true;
        
        emit UpdateApproved(_updateId, msg.sender);
        
        if (update.doctorApproved && update.patientApproved) {
            emit UpdateCompleted(_updateId);
        }
    }
    
    function isApproved(bytes32 _updateId) public view returns (bool) {
        PendingUpdate storage update = pendingUpdates[_updateId];
        return update.doctorApproved && update.patientApproved;
    }
    
    function getPendingUpdate(bytes32 _updateId) public view returns (address, address, bytes32, uint256, bool, bool) {
        PendingUpdate storage update = pendingUpdates[_updateId];
        return (update.doctor, update.patient, update.dataHash, update.timestamp, update.doctorApproved, update.patientApproved);
    }
}