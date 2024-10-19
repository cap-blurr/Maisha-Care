// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title VerifiedAddressRegistry
/// @notice Manages verified addresses for roles with admin control
/// @dev Inherits from OpenZeppelin's AccessControl for role management
contract VerifiedAddressRegistry is AccessControl {
    // Custom errors
    error InvalidUniqueHash();
    error AddressAlreadyVerified();
    error AddressNotVerified();
    error Unauthorized();

    // Constants for roles
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant PATIENT_ROLE = keccak256("patient");
    bytes32 public constant DOCTOR_ROLE = keccak256("doctor");
    bytes32 public constant RESEARCHER_ROLE = keccak256("researcher");
    bytes32 public constant BUILDER_ROLE = keccak256("builder");

    // Mapping to store verified addresses
    mapping(bytes32 => mapping(address => bytes32)) private verifiedAddresses;

    // Events
    event AddressVerified(
        bytes32 indexed role,
        address indexed account,
        bytes32 uniqueHash
    );
    event AddressUnverified(bytes32 indexed role, address indexed account);

    /// @notice Contract constructor
    /// @dev Grants the ADMIN_ROLE to the contract deployer
    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Verify an address for a specific role
    /// @param role The role to verify the address for
    /// @param account The address to be verified
    /// @param uniqueHash A unique hash associated with the verification
    function verifyAddress(
        bytes32 role,
        address account,
        bytes32 uniqueHash
    ) public {
        if (uniqueHash == bytes32(0)) revert InvalidUniqueHash();
        if (verifiedAddresses[role][account] != bytes32(0))
            revert AddressAlreadyVerified();

        verifiedAddresses[role][account] = uniqueHash;
        emit AddressVerified(role, account, uniqueHash);
    }

    /// @notice Unverify an address for a specific role (admin only)
    /// @param role The role to unverify the address for
    /// @param account The address to be unverified
    function unverifyAddress(
        bytes32 role,
        address account
    ) public onlyRole(ADMIN_ROLE) {
        if (verifiedAddresses[role][account] == bytes32(0))
            revert AddressNotVerified();

        delete verifiedAddresses[role][account];
        emit AddressUnverified(role, account);
    }

    /// @notice Check if an address is verified for a specific role
    /// @param role The role to check verification for
    /// @param account The address to check
    /// @return bool True if the address is verified for the role, false otherwise
    function isVerified(
        bytes32 role,
        address account
    ) public view returns (bool) {
        return verifiedAddresses[role][account] != bytes32(0);
    }

    /// @notice Get the unique hash for a verified address
    /// @param role The role to get the unique hash for
    /// @param account The address to get the unique hash for
    /// @return bytes32 The unique hash associated with the verified address
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
