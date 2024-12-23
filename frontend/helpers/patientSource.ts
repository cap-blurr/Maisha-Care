import { PatientType } from "@/types/api-types";

export const patientHealthDataSource: PatientType[] = [
  {
    id: "P001",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: new Date("1985-04-12"),
    gender: "Male",
    contactNumber: "123-456-7890",
    email: "john.doe@example.com",
    address: {
      street: "123 Elm St",
      city: "Springfield",
      state: "IL",
      postalCode: "62704",
      country: "USA",
    },
    emergencyContact: {
      name: "Jane Doe",
      relation: "Spouse",
      contactNumber: "123-456-7891",
    },
    medicalHistory: ["Asthma", "Hypertension"],
  },
  {
    id: "P002",
    firstName: "Mary",
    lastName: "Smith",
    dateOfBirth: new Date("1990-06-22"),
    gender: "Female",
    contactNumber: "987-654-3210",
    email: "mary.smith@example.com",
    address: {
      street: "456 Oak Ave",
      city: "Rivertown",
      state: "CA",
      postalCode: "90210",
      country: "USA",
    },
    emergencyContact: {
      name: "Robert Smith",
      relation: "Brother",
      contactNumber: "987-654-3211",
    },
    medicalHistory: ["Diabetes"],
  },
  {
    id: "P003",
    firstName: "Michael",
    lastName: "Johnson",
    dateOfBirth: new Date("1978-11-15"),
    gender: "Male",
    contactNumber: "555-123-4567",
    address: {
      street: "789 Maple St",
      city: "Greenfield",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    },
    emergencyContact: {
      name: "Sarah Johnson",
      relation: "Wife",
      contactNumber: "555-123-4568",
    },
  },
  {
    id: "P004",
    firstName: "Sophia",
    lastName: "Brown",
    dateOfBirth: new Date("1995-02-10"),
    gender: "Female",
    contactNumber: "444-222-3333",
    email: "sophia.brown@example.com",
    address: {
      street: "987 Pine Rd",
      city: "Hillside",
      state: "TX",
      postalCode: "73301",
      country: "USA",
    },
    emergencyContact: {
      name: "Alice Brown",
      relation: "Mother",
      contactNumber: "444-222-3334",
    },
    medicalHistory: ["Allergies", "Migraines"],
  },
  {
    id: "P005",
    firstName: "James",
    lastName: "Williams",
    dateOfBirth: new Date("1980-09-30"),
    gender: "Male",
    contactNumber: "111-333-4444",
    address: {
      street: "345 Birch Ln",
      city: "Summerville",
      state: "OH",
      postalCode: "43001",
      country: "USA",
    },
    emergencyContact: {
      name: "Emma Williams",
      relation: "Daughter",
      contactNumber: "111-333-4445",
    },
  },
  {
    id: "P006",
    firstName: "Emily",
    lastName: "Taylor",
    dateOfBirth: new Date("2001-05-05"),
    gender: "Female",
    contactNumber: "222-555-6666",
    email: "emily.taylor@example.com",
    address: {
      street: "222 Willow St",
      city: "Lakeview",
      state: "MI",
      postalCode: "48109",
      country: "USA",
    },
    emergencyContact: {
      name: "Laura Taylor",
      relation: "Sister",
      contactNumber: "222-555-6667",
    },
    medicalHistory: ["Asthma"],
  },
  {
    id: "P007",
    firstName: "David",
    lastName: "Moore",
    dateOfBirth: new Date("1993-08-12"),
    gender: "Male",
    contactNumber: "333-777-8888",
    email: "david.moore@example.com",
    address: {
      street: "654 Cedar Ct",
      city: "Lakeside",
      state: "CO",
      postalCode: "80212",
      country: "USA",
    },
    emergencyContact: {
      name: "Linda Moore",
      relation: "Mother",
      contactNumber: "333-777-8889",
    },
  },
  {
    id: "P008",
    firstName: "Olivia",
    lastName: "Anderson",
    dateOfBirth: new Date("1998-03-21"),
    gender: "Female",
    contactNumber: "666-888-9999",
    email: "olivia.anderson@example.com",
    address: {
      street: "111 Poplar Dr",
      city: "Parkview",
      state: "MO",
      postalCode: "64068",
      country: "USA",
    },
    emergencyContact: {
      name: "Lucas Anderson",
      relation: "Father",
      contactNumber: "666-888-9990",
    },
    medicalHistory: ["Hypertension"],
  },
  {
    id: "P009",
    firstName: "Ethan",
    lastName: "Martinez",
    dateOfBirth: new Date("1987-07-07"),
    gender: "Male",
    contactNumber: "999-777-5555",
    address: {
      street: "888 Redwood St",
      city: "Hilltop",
      state: "UT",
      postalCode: "84095",
      country: "USA",
    },
    emergencyContact: {
      name: "Nancy Martinez",
      relation: "Sister",
      contactNumber: "999-777-5556",
    },
  },
  {
    id: "P010",
    firstName: "Isabella",
    lastName: "Clark",
    dateOfBirth: new Date("1992-10-18"),
    gender: "Female",
    contactNumber: "444-666-7777",
    email: "isabella.clark@example.com",
    address: {
      street: "321 Cypress Ln",
      city: "Brookside",
      state: "FL",
      postalCode: "33101",
      country: "USA",
    },
    emergencyContact: {
      name: "Grace Clark",
      relation: "Mother",
      contactNumber: "444-666-7778",
    },
    medicalHistory: ["Cholesterol"],
  },
  {
    id: "P011",
    firstName: "Liam",
    lastName: "Lee",
    dateOfBirth: new Date("2000-12-01"),
    gender: "Male",
    contactNumber: "222-111-4444",
    email: "liam.lee@example.com",
    address: {
      street: "456 Fir St",
      city: "Valleyton",
      state: "TN",
      postalCode: "37201",
      country: "USA",
    },
    emergencyContact: {
      name: "Mia Lee",
      relation: "Sister",
      contactNumber: "222-111-4445",
    },
  },
  {
    id: "P012",
    firstName: "Charlotte",
    lastName: "Walker",
    dateOfBirth: new Date("1975-06-25"),
    gender: "Female",
    contactNumber: "555-444-3333",
    address: {
      street: "777 Aspen Dr",
      city: "Meadowville",
      state: "OR",
      postalCode: "97201",
      country: "USA",
    },
    emergencyContact: {
      name: "Henry Walker",
      relation: "Husband",
      contactNumber: "555-444-3334",
    },
  },
  {
    id: "P013",
    firstName: "Ava",
    lastName: "Young",
    dateOfBirth: new Date("1982-11-05"),
    gender: "Female",
    contactNumber: "666-333-2222",
    email: "ava.young@example.com",
    address: {
      street: "543 Chestnut Rd",
      city: "Riverbend",
      state: "WA",
      postalCode: "98001",
      country: "USA",
    },
    emergencyContact: {
      name: "Michael Young",
      relation: "Brother",
      contactNumber: "666-333-2223",
    },
  },
];
