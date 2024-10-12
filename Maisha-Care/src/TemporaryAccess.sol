// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {RoleManager} from "./RoleManager.sol";

contract TemporaryAccess {
    RoleManager public roleManager;

    mapping(address => mapping(address => uint256)) public accessExpiry;
    mapping(address => mapping(address => bool)) public researchAccess;
    mapping(address => mapping(address => bool)) public builderAccess;
    mapping(address => mapping(address => bool)) public pendingAccessRequests;

    event AccessRequested(address indexed doctor, address indexed patient);
    event AccessApproved(address indexed patient, address indexed doctor);
    event AccessDenied(address indexed patient, address indexed doctor);

    constructor(address _roleManager) {
        roleManager = RoleManager(_roleManager);
    }

    function requestAccess(address _patient) public {
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender),
            "Must be a doctor"
        );
        require(
            roleManager.hasRole(roleManager.PATIENT_ROLE(), _patient),
            "Invalid patient address"
        );
        pendingAccessRequests[_patient][msg.sender] = true;
        emit AccessRequested(msg.sender, _patient);
    }

    function approveAccess(address _doctor) public {
        require(
            roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender),
            "Must be a patient"
        );
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), _doctor),
            "Invalid doctor address"
        );
        require(
            pendingAccessRequests[msg.sender][_doctor],
            "No pending request from this doctor"
        );
        accessExpiry[msg.sender][_doctor] = block.timestamp + 10 minutes;
        emit AccessApproved(msg.sender, _doctor);
    }

    function denyAccess(address _doctor) public {
        require(
            roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender),
            "Must be a patient"
        );
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), _doctor),
            "Invalid doctor address"
        );
        delete accessExpiry[msg.sender][_doctor];
        emit AccessDenied(msg.sender, _doctor);
    }

    function hasAccess(
        address _patient,
        address _accessor
    ) public view returns (bool) {
        return block.timestamp < accessExpiry[_patient][_accessor];
    }

    function hasResearchAccess(
        address _patient,
        address _researcher
    ) public view returns (bool) {
        return researchAccess[_patient][_researcher];
    }

    function hasBuilderAccess(
        address _patient,
        address _builder
    ) public view returns (bool) {
        return builderAccess[_patient][_builder];
    }
}
