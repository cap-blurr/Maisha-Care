// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title VerifiedAddressRegistry - Manages verified addresses for roles with admin control
contract VerifiedAddressRegistry is AccessControl {
    mapping(bytes32 => mapping(address => bytes32)) private verifiedAddresses;

    // Role identifiers
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant RESEARCHER_ROLE = keccak256("RESEARCHER_ROLE");
    bytes32 public constant BUILDER_ROLE = keccak256("BUILDER_ROLE");

    event AddressVerified(
        bytes32 indexed role,
        address indexed account,
        bytes32 uniqueHash
    );
    event AddressUnverified(bytes32 indexed role, address indexed account);

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Verify an address for a specific role
    function verifyAddress(
        bytes32 role,
        address account,
        bytes32 uniqueHash
    ) public {
        require(uniqueHash != bytes32(0), "Invalid unique hash");
        require(
            verifiedAddresses[role][account] == bytes32(0),
            "Address already verified"
        );

        verifiedAddresses[role][account] = uniqueHash;
        emit AddressVerified(role, account, uniqueHash);
    }

    /// @notice Unverify an address for a specific role (admin only)
    function unverifyAddress(
        bytes32 role,
        address account
    ) public onlyRole(ADMIN_ROLE) {
        require(
            verifiedAddresses[role][account] != bytes32(0),
            "Address not verified"
        );

        delete verifiedAddresses[role][account];
        emit AddressUnverified(role, account);
    }

    /// @notice Check if an address is verified for a specific role
    function isVerified(
        bytes32 role,
        address account
    ) public view returns (bool) {
        return verifiedAddresses[role][account] != bytes32(0);
    }

    /// @notice Get the unique hash for a verified address
    function getUniqueHash(
        bytes32 role,
        address account
    ) public view returns (bytes32) {
        return verifiedAddresses[role][account];
    }

    // Getter functions for role identifiers
    function getPatientRole() public pure returns (bytes32) {
        return PATIENT_ROLE;
    }

    function getDoctorRole() public pure returns (bytes32) {
        return DOCTOR_ROLE;
    }

    function getResearcherRole() public pure returns (bytes32) {
        return RESEARCHER_ROLE;
    }

    function getBuilderRole() public pure returns (bytes32) {
        return BUILDER_ROLE;
    }
}
