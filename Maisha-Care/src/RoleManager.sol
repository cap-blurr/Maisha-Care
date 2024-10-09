// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {VerifiedAddressRegistry} from "./VerifiedAddressRegistry.sol";

/// @title RoleManager - Manages role assignments with admin control
contract RoleManager is AccessControl {
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant PATIENT_ROLE = keccak256("patient");
    bytes32 public constant DOCTOR_ROLE = keccak256("doctor");
    bytes32 public constant RESEARCHER_ROLE = keccak256("researcher");
    bytes32 public constant BUILDER_ROLE = keccak256("builder");

    event SuccesfullyRegistered(address indexed account);

    VerifiedAddressRegistry public verifiedRegistry;

    constructor(address _verifiedRegistry) {
        _grantRole(ADMIN_ROLE, msg.sender);
        verifiedRegistry = VerifiedAddressRegistry(_verifiedRegistry);
    }

    /// @notice Register as a patient (requires verification)
    function registerAsPatient() public {
        require(
            verifiedRegistry.isVerified(PATIENT_ROLE, msg.sender),
            "Not verified as patient"
        );
        _grantRole(PATIENT_ROLE, msg.sender);

        emit SuccesfullyRegistered(msg.sender);
    }

    /// @notice Register as a doctor (requires verification)
    function registerAsDoctor() public {
        require(
            verifiedRegistry.isVerified(DOCTOR_ROLE, msg.sender),
            "Not verified as doctor"
        );
        _grantRole(DOCTOR_ROLE, msg.sender);

        emit SuccesfullyRegistered(msg.sender);
    }

    /// @notice Register as a researcher (requires verification)
    function registerAsResearcher() public {
        require(
            verifiedRegistry.isVerified(RESEARCHER_ROLE, msg.sender),
            "Not verified as researcher"
        );
        _grantRole(RESEARCHER_ROLE, msg.sender);

        emit SuccesfullyRegistered(msg.sender);
    }

    /// @notice Register as a builder (requires verification)
    function registerAsBuilder() public {
        require(
            verifiedRegistry.isVerified(BUILDER_ROLE, msg.sender),
            "Not verified as builder"
        );
        _grantRole(BUILDER_ROLE, msg.sender);

        emit SuccesfullyRegistered(msg.sender);
    }

    /// @notice Grant a role to an account (admin only)
    /// @param role The role identifier
    /// @param account The address to grant the role to
    function grantRole(
        bytes32 role,
        address account
    ) public override onlyRole(ADMIN_ROLE) {
        _grantRole(role, account);
    }

    /// @notice Revoke a role from an account (admin only)
    /// @param role The role identifier
    /// @param account The address to revoke the role from
    function revokeRole(
        bytes32 role,
        address account
    ) public override onlyRole(ADMIN_ROLE) {
        _revokeRole(role, account);
    }
}
