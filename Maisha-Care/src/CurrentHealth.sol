// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {RoleManager} from "./RoleManager.sol";
import {UpdateApproval} from "./UpdateApproval.sol";
import {TemporaryAccess} from "./TemporaryAccess.sol";

contract CurrentHealth is Ownable {
    RoleManager public roleManager;
    UpdateApproval public updateApproval;
    TemporaryAccess public temporaryAccess;

    struct Health {
        string dataHash;
        uint256 lastUpdated;
    }

    mapping(address => Health) private currentHealths;

    event HealthUpdateInitiated(
        address indexed patient,
        address indexed doctor,
        bytes32 updateId
    );
    event HealthUpdated(address indexed patient, uint256 timestamp);

    constructor(
        address _roleManagerAddress,
        address _updateApprovalAddress,
        address _temporaryAccessAddress
    ) Ownable(msg.sender) {
        roleManager = RoleManager(_roleManagerAddress);
        updateApproval = UpdateApproval(_updateApprovalAddress);
        temporaryAccess = TemporaryAccess(_temporaryAccessAddress);
    }

    function initiateHealthUpdate(
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
        emit HealthUpdateInitiated(_patient, msg.sender, updateId);
    }

    function updateHealth(bytes32 _updateId) public {
        require(updateApproval.isApproved(_updateId), "Update not approved");
        (
            address doctor,
            address patient,
            bytes32 dataHash,
            ,
            ,

        ) = updateApproval.getPendingUpdate(_updateId);
        require(msg.sender == doctor, "Only initiating doctor can update");

        currentHealths[patient] = Health(
            bytes32ToString(dataHash),
            block.timestamp
        );
        emit HealthUpdated(patient, block.timestamp);
    }

    function getHealthPatient(
        address _patient
    ) public view returns (string memory, uint256) {
        require(
            roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender),
            "Must be patient"
        );
        Health memory health = currentHealths[_patient];
        return (health.dataHash, health.lastUpdated);
    }

    function getHealthDoctor(
        address _patient
    ) public view returns (string memory, uint256) {
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender),
            "Must be a doctor"
        );
        require(
            temporaryAccess.hasAccess(_patient, msg.sender),
            "Doctor does not have temporary access"
        );
        Health memory health = currentHealths[_patient];
        return (health.dataHash, health.lastUpdated);
    }

    function getAnonymizedHealth(
        address _patient
    ) public view returns (uint256) {
        require(
            roleManager.hasRole(roleManager.RESEARCHER_ROLE(), msg.sender),
            "Must be a researcher"
        );
        return currentHealths[_patient].lastUpdated;
    }

    function getBuilderHealth(address _patient) public view returns (uint256) {
        require(
            roleManager.hasRole(roleManager.BUILDER_ROLE(), msg.sender),
            "Must be a builder"
        );
        return currentHealths[_patient].lastUpdated;
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
