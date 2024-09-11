// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {RoleManager} from "./RoleManager.sol";

contract TemporaryAccess {
    RoleManager public roleManager;
    
    mapping(address => mapping(address => uint256)) public accessExpiry;
    mapping(address => mapping(address => bool)) public researchAccess;
    mapping(address => mapping(address => bool)) public builderAccess;
    
    event AccessGranted(address indexed patient, address indexed accessor, uint256 expiry);
    event ResearchAccessGranted(address indexed patient, address indexed researcher);
    event BuilderAccessGranted(address indexed patient, address indexed builder);
    
    constructor(address _roleManager) {
        roleManager = RoleManager(_roleManager);
    }
    
    function grantTemporaryAccess(address _to, uint256 _duration) public {
        require(roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender), "Must be a patient");
        require(roleManager.hasRole(roleManager.DOCTOR_ROLE(), _to), "Recipient must be a doctor");
        accessExpiry[msg.sender][_to] = block.timestamp + _duration;
        emit AccessGranted(msg.sender, _to, accessExpiry[msg.sender][_to]);
    }
    
    function grantResearchAccess(address _to) public {
        require(roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender), "Must be a patient");
        require(roleManager.hasRole(roleManager.RESEARCHER_ROLE(), _to), "Recipient must be a researcher");
        researchAccess[msg.sender][_to] = true;
        emit ResearchAccessGranted(msg.sender, _to);
    }
    
    function grantBuilderAccess(address _to) public {
        require(roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender), "Must be a patient");
        require(roleManager.hasRole(roleManager.BUILDER_ROLE(), _to), "Recipient must be a builder");
        builderAccess[msg.sender][_to] = true;
        emit BuilderAccessGranted(msg.sender, _to);
    }
    
    function hasAccess(address _patient, address _accessor) public view returns (bool) {
        return block.timestamp < accessExpiry[_patient][_accessor];
    }
    
    function hasResearchAccess(address _patient, address _researcher) public view returns (bool) {
        return researchAccess[_patient][_researcher];
    }
    
    function hasBuilderAccess(address _patient, address _builder) public view returns (bool) {
        return builderAccess[_patient][_builder];
    }
}