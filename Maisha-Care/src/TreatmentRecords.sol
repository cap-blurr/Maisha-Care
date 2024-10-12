// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {RoleManager} from "./RoleManager.sol";
import {UpdateApproval} from "./UpdateApproval.sol";
import {TemporaryAccess} from "./TemporaryAccess.sol";

contract TreatmentRecords is Ownable {
    RoleManager public roleManager;
    UpdateApproval public updateApproval;
    TemporaryAccess public temporaryAccess;

    struct Record {
        string dataHash;
        uint256 timestamp;
    }

    mapping(address => Record[]) private treatmentRecords;

    event RecordAddInitiated(
        address indexed patient,
        address indexed doctor,
        bytes32 updateId
    );
    event RecordAdded(address indexed patient, uint256 timestamp);

    constructor(
        address _roleManagerAddress,
        address _updateApprovalAddress,
        address _temporaryAccessAddress
    ) Ownable(msg.sender) {
        roleManager = RoleManager(_roleManagerAddress);
        updateApproval = UpdateApproval(_updateApprovalAddress);
        temporaryAccess = TemporaryAccess(_temporaryAccessAddress);
    }

    function initiateAddRecord(
        address _patient,
        string memory _dataHash
    ) public {
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender),
            "Must be a doctor"
        );
        require(
            temporaryAccess.hasAccess(_patient, msg.sender),
            "Doctor does not have temporary access"
        );
        bytes32 updateId = updateApproval.initiateUpdate(
            _patient,
            keccak256(abi.encodePacked(_dataHash))
        );
        emit RecordAddInitiated(_patient, msg.sender, updateId);
    }

    function addRecord(bytes32 _updateId) public {
        require(updateApproval.isApproved(_updateId), "Update not approved");
        (
            address doctor,
            address patient,
            bytes32 dataHash,
            ,
            ,

        ) = updateApproval.getPendingUpdate(_updateId);
        require(msg.sender == doctor, "Only initiating doctor can update");

        treatmentRecords[patient].push(
            Record(bytes32ToString(dataHash), block.timestamp)
        );
        emit RecordAdded(patient, block.timestamp);
    }

    function getRecordsPatient(
        address _patient
    ) public view returns (string[] memory, uint256[] memory) {
        require(
            roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender),
            "Must be patient"
        );
        return _getRecords(_patient);
    }

    function getRecordsDoctor(
        address _patient
    ) public view returns (string[] memory, uint256[] memory) {
        require(
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender),
            "Must be a doctor"
        );
        require(
            temporaryAccess.hasAccess(_patient, msg.sender),
            "Doctor does not have temporary access"
        );
        return _getRecords(_patient);
    }

    function _getRecords(
        address _patient
    ) private view returns (string[] memory, uint256[] memory) {
        Record[] memory records = treatmentRecords[_patient];
        string[] memory dataHashes = new string[](records.length);
        uint256[] memory timestamps = new uint256[](records.length);

        for (uint i = 0; i < records.length; i++) {
            dataHashes[i] = records[i].dataHash;
            timestamps[i] = records[i].timestamp;
        }

        return (dataHashes, timestamps);
    }

    function getAnonymizedRecords(
        address _patient
    ) public view returns (uint256[] memory) {
        require(
            roleManager.hasRole(roleManager.RESEARCHER_ROLE(), msg.sender),
            "Must be a researcher"
        );
        Record[] memory records = treatmentRecords[_patient];
        uint256[] memory timestamps = new uint256[](records.length);

        for (uint i = 0; i < records.length; i++) {
            timestamps[i] = records[i].timestamp;
        }

        return timestamps;
    }

    function getBuilderRecords(
        address _patient
    ) public view returns (uint256[] memory) {
        require(
            roleManager.hasRole(roleManager.BUILDER_ROLE(), msg.sender),
            "Must be a builder"
        );
        Record[] memory records = treatmentRecords[_patient];
        uint256[] memory timestamps = new uint256[](records.length);

        for (uint i = 0; i < records.length; i++) {
            timestamps[i] = records[i].timestamp;
        }

        return timestamps;
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
