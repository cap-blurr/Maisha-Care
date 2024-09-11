// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {VerifiedAddressRegistry} from "./VerifiedAddressRegistry.sol";

contract RoleManager is AccessControl {
    bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant RESEARCHER_ROLE = keccak256("RESEARCHER_ROLE");
    bytes32 public constant BUILDER_ROLE = keccak256("BUILDER_ROLE");

    VerifiedAddressRegistry public verifiedRegistry;

    constructor(address _verifiedRegistry) {
        verifiedRegistry = VerifiedAddressRegistry(_verifiedRegistry);
    }

    function registerAsPatient() public {
        _grantRole(PATIENT_ROLE, msg.sender);
    }

    function registerAsDoctor() public {
        require(verifiedRegistry.isVerified(DOCTOR_ROLE, msg.sender), "Not verified as doctor");
        _grantRole(DOCTOR_ROLE, msg.sender);
    }

    function registerAsResearcher() public {
        require(verifiedRegistry.isVerified(RESEARCHER_ROLE, msg.sender), "Not verified as researcher");
        _grantRole(RESEARCHER_ROLE, msg.sender);
    }

    function registerAsBuilder() public {
        require(verifiedRegistry.isVerified(BUILDER_ROLE, msg.sender), "Not verified as builder");
        _grantRole(BUILDER_ROLE, msg.sender);
    }
}