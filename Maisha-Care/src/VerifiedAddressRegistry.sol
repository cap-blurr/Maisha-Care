// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract VerifiedAddressRegistry is AccessControl {
    using ECDSA for bytes32;

    mapping(bytes32 => mapping(address => bool)) private verifiedAddresses;

    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant RESEARCHER_ROLE = keccak256("RESEARCHER_ROLE");
    bytes32 public constant BUILDER_ROLE = keccak256("BUILDER_ROLE");

    event AddressVerified(bytes32 indexed role, address indexed account);
    event AddressUnverified(bytes32 indexed role, address indexed account);

    function verifyAddress(bytes32 role, address account) public {
        verifiedAddresses[role][account] = true;
        emit AddressVerified(role, account);
    }

    function unverifyAddress(bytes32 role, address account) public {
        verifiedAddresses[role][account] = false;
        emit AddressUnverified(role, account);
    }

    function isVerified(
        bytes32 role,
        address account
    ) public view returns (bool) {
        return verifiedAddresses[role][account];
    }

    // Getter functions for roles
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
