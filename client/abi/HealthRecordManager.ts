export const HealthRecordManager = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_maishaToken",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_personalInfo",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_medicalHistory",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_currentHealth",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_treatmentRecords",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_roleManager",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_temporaryAccess",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_updateApproval",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "approveUpdate",
      "inputs": [
        { "name": "_updateId", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "checkRole",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "currentHealth",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract CurrentHealth"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "dataMonetizationOptIn",
      "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCurrentHealthDoctor",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "string", "internalType": "string" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCurrentHealthPatient",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "string", "internalType": "string" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getMedicalHistoryDoctor",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "string", "internalType": "string" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getMedicalHistoryPatient",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "string", "internalType": "string" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getPersonalInfo",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "string", "internalType": "string" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTreatmentRecordsDoctor",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "string[]", "internalType": "string[]" },
        { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTreatmentRecordsPatient",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "string[]", "internalType": "string[]" },
        { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "grantRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "hasRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "initiateCurrentHealthUpdate",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" },
        { "name": "_dataHash", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "initiateMedicalHistoryUpdate",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" },
        { "name": "_dataHash", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "initiatePersonalInfoUpdate",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" },
        { "name": "_dataHash", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "initiateTreatmentRecordAdd",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" },
        { "name": "_dataHash", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "maishaToken",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract MaishaToken"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "medicalHistory",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract MedicalHistory"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "optInDataMonetization",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "personalInfo",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract PersonalInfo"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "renounceRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        {
          "name": "callerConfirmation",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "revokeRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "roleManager",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract RoleManager"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [
        { "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "temporaryAccess",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract TemporaryAccess"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        { "name": "newOwner", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "treatmentRecords",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract TreatmentRecords"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "updateApproval",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract UpdateApproval"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "DataMonetizationOptIn",
      "inputs": [
        {
          "name": "patient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "DataUpdateInitiated",
      "inputs": [
        {
          "name": "patient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "initiator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "dataType",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "updateId",
          "type": "bytes32",
          "indexed": false,
          "internalType": "bytes32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "previousOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "previousAdminRole",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "newAdminRole",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleGranted",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "account",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleRevoked",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "account",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    { "type": "error", "name": "AccessControlBadConfirmation", "inputs": [] },
    {
      "type": "error",
      "name": "AccessControlUnauthorizedAccount",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" },
        { "name": "neededRole", "type": "bytes32", "internalType": "bytes32" }
      ]
    },
    { "type": "error", "name": "AlreadyOptedIn", "inputs": [] },
    { "type": "error", "name": "InvalidAddress", "inputs": [] },
    { "type": "error", "name": "NotAuthorized", "inputs": [] },
    {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [
        { "name": "owner", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" }
      ]
    }
  ]