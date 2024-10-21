"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/inputs/TextInput";
import SelectInput from "@/components/inputs/SelectInput";

const Marketplace = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const SignupSchema = Yup.object({
    patientName: Yup.string().required("Patient's Name is Required"),
    bidAmount: Yup.number()
      .positive("Bid amount must be positive")
      .required("Bid Amount is Required"),
    // Add validation for other fields as needed
  });

  const handleSubmit = async (values: any) => {
    console.log(values);
    // Here you would typically send the bid to your backend or smart contract
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <section className="p-10">
      <article className="bg-white rounded-md shadow-sm p-10">
        <h2 className="text-4xl text-black font-bold mb-6">
          Bid for Health Record Data
        </h2>

        <Formik
          initialValues={{
            patientName: "",
            bidAmount: "",
            currentHealth: {
              vitalSigns: {
                bloodPressureSystolic: "",
                bloodPressureDiastolic: "",
                heartRate: "",
                respiratoryRate: "",
                bodyTemperature: "",
                oxygenSaturation: "",
              },
              bodyMeasurements: {
                height: "",
                weight: "",
              },
              generalHealth: {
                generalAppearance: "",
                levelOfConsciousness: "",
                painScore: "",
              },
              currentSymptoms: {
                primaryComplaint: "",
                durationOfSymptoms: "",
                severityOfSymptoms: "",
              },
              currentMedications: { name: "", dosage: "", frequency: "" },
              allergies: { allergy: "", severity: "" },
              lifestyleFactors: {
                smokingStatus: "",
                alcoholConsumption: "",
                exerciseHabits: "",
                dietOverview: "",
              },
            },
            medicalHistory: {
              pastMedicalConditions: {
                condition: "",
                yearDiagnosed: "",
                currentStatus: "",
              },
              surgicalHistory: { surgery: "", date: "", complications: "" },
              familyMedicalHistory: { condition: "", relationship: "" },
              immunizationRecords: { vaccination: "", dateAdministered: "" },
              majorInjuries: {
                description: "",
                dateOccurred: "",
                treatmentReceived: "",
              },
              chronicMedications: { medication: "", durationOfUse: "" },
              pastHospitalizations: { reason: "", dateAndDuration: "" },
              mentalHealthHistory: {
                diagnosedConditions: "",
                treatmentsReceived: "",
              },
              reproductiveHistory: {
                pregnancies: "",
                childbirthDetails: "",
              },
            },
            treatmentRecords: {
              visitInformation: {
                dateOfVisit: "",
                reasonForVisit: "",
                treatingPhysician: "",
              },
              diagnosis: {
                primaryDiagnosis: "",
                secondaryDiagnoses: "",
                icdCodes: "",
              },
              treatmentPlan: {
                prescribedMedications: {
                  medication: "",
                  dosage: "",
                  instructions: "",
                },
                nonPharmacologicalInterventions: "",
              },
              proceduresPerformed: { name: "", date: "", outcome: "" },
              laboratoryTests: { test: "", results: "", dateOfResults: "" },
              imagingStudies: { type: "", date: "", resultsSummary: "" },
              referrals: { specialist: "", reasonForReferral: "" },
              followUpInstructions: {
                nextAppointmentDate: "",
                specificInstructions: "",
              },
              progressNotes: "",
            },
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6">
              <TextInput
                label="Patient's Name"
                name="patientName"
                type="text"
                placeholder="Enter Patient's Name"
              />
              <TextInput
                label="Bid Amount ($)"
                name="bidAmount"
                type="number"
                placeholder="Enter your bid amount"
              />

              <h3 className="text-2xl font-semibold mt-8">Current Health</h3>

              <h4 className="text-xl font-medium mt-4">Vital Signs</h4>
              <SelectInput
                label="Blood Pressure (Systolic)"
                name="currentHealth.vitalSigns.bloodPressureSystolic"
              >
                <option value="">Select Systolic Blood Pressure</option>
                <option value="normal">Normal (Less than 120 mmHg)</option>
                <option value="elevated">Elevated (120-129 mmHg)</option>
                <option value="stage1">
                  Stage 1 Hypertension (130-139 mmHg)
                </option>
                <option value="stage2">
                  Stage 2 Hypertension (140 mmHg or higher)
                </option>
              </SelectInput>
              <SelectInput
                label="Blood Pressure (Diastolic)"
                name="currentHealth.vitalSigns.bloodPressureDiastolic"
              >
                <option value="">Select Diastolic Blood Pressure</option>
                <option value="normal">Normal (Less than 80 mmHg)</option>
                <option value="stage1">
                  Stage 1 Hypertension (80-89 mmHg)
                </option>
                <option value="stage2">
                  Stage 2 Hypertension (90 mmHg or higher)
                </option>
              </SelectInput>
              <SelectInput
                label="Heart Rate"
                name="currentHealth.vitalSigns.heartRate"
              >
                <option value="">Select Heart Rate</option>
                <option value="low">Low (Less than 60 bpm)</option>
                <option value="normal">Normal (60-100 bpm)</option>
                <option value="elevated">Elevated (More than 100 bpm)</option>
              </SelectInput>
              <SelectInput
                label="Respiratory Rate"
                name="currentHealth.vitalSigns.respiratoryRate"
              >
                <option value="">Select Respiratory Rate</option>
                <option value="normal">
                  Normal (12-20 breaths per minute)
                </option>
                <option value="low">
                  Low (Less than 12 breaths per minute)
                </option>
                <option value="high">
                  High (More than 20 breaths per minute)
                </option>
              </SelectInput>
              <SelectInput
                label="Body Temperature"
                name="currentHealth.vitalSigns.bodyTemperature"
              >
                <option value="">Select Body Temperature</option>
                <option value="normal">Normal (97.7°F to 99.5°F)</option>
                <option value="low">Low (Below 97.7°F)</option>
                <option value="fever">Fever (Above 99.5°F)</option>
              </SelectInput>
              <SelectInput
                label="Oxygen Saturation"
                name="currentHealth.vitalSigns.oxygenSaturation"
              >
                <option value="">Select Oxygen Saturation</option>
                <option value="normal">Normal (95-100%)</option>
                <option value="low">Low (Below 95%)</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Body Measurements</h4>
              <SelectInput
                label="Height"
                name="currentHealth.bodyMeasurements.height"
              >
                <option value="">Select Height Range</option>
                <option value="short">Short (Less than 5'4")</option>
                <option value="average">Average (5'4" - 5'9")</option>
                <option value="tall">Tall (5'10" and above)</option>
              </SelectInput>
              <SelectInput
                label="Weight"
                name="currentHealth.bodyMeasurements.weight"
              >
                <option value="">Select Weight Range</option>
                <option value="underweight">
                  Underweight (BMI less than 18.5)
                </option>
                <option value="normal">Normal weight (BMI 18.5-24.9)</option>
                <option value="overweight">Overweight (BMI 25-29.9)</option>
                <option value="obese">Obese (BMI 30 or greater)</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">General Health</h4>
              <SelectInput
                label="General Appearance"
                name="currentHealth.generalHealth.generalAppearance"
              >
                <option value="">Select General Appearance</option>
                <option value="healthy">Healthy</option>
                <option value="fatigued">Fatigued</option>
                <option value="distressed">Distressed</option>
              </SelectInput>
              <SelectInput
                label="Level of Consciousness"
                name="currentHealth.generalHealth.levelOfConsciousness"
              >
                <option value="">Select Level of Consciousness</option>
                <option value="alert">Alert</option>
                <option value="drowsy">Drowsy</option>
                <option value="confused">Confused</option>
                <option value="unresponsive">Unresponsive</option>
              </SelectInput>
              <SelectInput
                label="Pain Score"
                name="currentHealth.generalHealth.painScore"
              >
                <option value="">Select Pain Score</option>
                <option value="0">0 - No Pain</option>
                <option value="1-3">1-3 - Mild Pain</option>
                <option value="4-6">4-6 - Moderate Pain</option>
                <option value="7-10">7-10 - Severe Pain</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Current Symptoms</h4>
              <SelectInput
                label="Primary Complaint"
                name="currentHealth.currentSymptoms.primaryComplaint"
              >
                <option value="">Select Primary Complaint</option>
                <option value="pain">Pain</option>
                <option value="fever">Fever</option>
                <option value="cough">Cough</option>
                <option value="fatigue">Fatigue</option>
                <option value="nausea">Nausea</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Duration of Symptoms"
                name="currentHealth.currentSymptoms.durationOfSymptoms"
              >
                <option value="">Select Duration of Symptoms</option>
                <option value="acute">Acute (Less than 1 week)</option>
                <option value="subacute">Subacute (1-4 weeks)</option>
                <option value="chronic">Chronic (More than 4 weeks)</option>
              </SelectInput>
              <SelectInput
                label="Severity of Symptoms"
                name="currentHealth.currentSymptoms.severityOfSymptoms"
              >
                <option value="">Select Severity of Symptoms</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Current Medications</h4>
              <SelectInput
                label="Medication Name"
                name="currentHealth.currentMedications.name"
              >
                <option value="">Select Medication Category</option>
                <option value="painRelievers">Pain Relievers</option>
                <option value="antibiotics">Antibiotics</option>
                <option value="antihistamines">Antihistamines</option>
                <option value="antidepressants">Antidepressants</option>
                <option value="antihypertensives">Antihypertensives</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Medication Dosage"
                name="currentHealth.currentMedications.dosage"
              >
                <option value="">Select Dosage</option>
                <option value="low">Low</option>
                <option value="standard">Standard</option>
                <option value="high">High</option>
              </SelectInput>
              <SelectInput
                label="Medication Frequency"
                name="currentHealth.currentMedications.frequency"
              >
                <option value="">Select Frequency</option>
                <option value="once">Once daily</option>
                <option value="twice">Twice daily</option>
                <option value="asNeeded">As needed</option>
                <option value="other">Other</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Allergies</h4>
              <SelectInput
                label="Allergy"
                name="currentHealth.allergies.allergy"
              >
                <option value="">Select Allergy Type</option>
                <option value="food">Food Allergy</option>
                <option value="medication">Medication Allergy</option>
                <option value="environmental">Environmental Allergy</option>
                <option value="insect">Insect Allergy</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Allergy Severity"
                name="currentHealth.allergies.severity"
              >
                <option value="">Select Allergy Severity</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Lifestyle Factors</h4>
              <SelectInput
                label="Smoking Status"
                name="currentHealth.lifestyleFactors.smokingStatus"
              >
                <option value="">Select Smoking Status</option>
                <option value="never">Never smoker</option>
                <option value="former">Former smoker</option>
                <option value="current">Current smoker</option>
              </SelectInput>
              <SelectInput
                label="Alcohol Consumption"
                name="currentHealth.lifestyleFactors.alcoholConsumption"
              >
                <option value="">Select Alcohol Consumption</option>
                <option value="none">None</option>
                <option value="occasional">Occasional</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
              </SelectInput>
              <SelectInput
                label="Exercise Habits"
                name="currentHealth.lifestyleFactors.exerciseHabits"
              >
                <option value="">Select Exercise Habits</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light activity</option>
                <option value="moderate">Moderate activity</option>
                <option value="vigorous">Vigorous activity</option>
              </SelectInput>
              <SelectInput
                label="Diet Overview"
                name="currentHealth.lifestyleFactors.dietOverview"
              >
                <option value="">Select Diet Overview</option>
                <option value="balanced">Balanced diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="other">Other</option>
              </SelectInput>

              <h3 className="text-2xl font-semibold mt-8">Medical History</h3>

              <h4 className="text-xl font-medium mt-4">
                Past Medical Conditions
              </h4>
              <SelectInput
                label="Condition"
                name="medicalHistory.pastMedicalConditions.condition"
              >
                <option value="">Select Condition</option>
                <option value="hypertension">Hypertension</option>
                <option value="diabetes">Diabetes</option>
                <option value="asthma">Asthma</option>
                <option value="heartDisease">Heart Disease</option>
                <option value="cancer">Cancer</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Year Diagnosed"
                name="medicalHistory.pastMedicalConditions.yearDiagnosed"
              >
                <option value="">Select Year Range</option>
                <option value="recent">Within last 5 years</option>
                <option value="medium">5-10 years ago</option>
                <option value="long">Over 10 years ago</option>
              </SelectInput>
              <SelectInput
                label="Current Status"
                name="medicalHistory.pastMedicalConditions.currentStatus"
              >
                <option value="">Select Current Status</option>
                <option value="resolved">Resolved</option>
                <option value="ongoing">Ongoing - Controlled</option>
                <option value="uncontrolled">Ongoing - Uncontrolled</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Surgical History</h4>
              <SelectInput
                label="Surgery"
                name="medicalHistory.surgicalHistory.surgery"
              >
                <option value="">Select Surgery Type</option>
                <option value="appendectomy">Appendectomy</option>
                <option value="cholecystectomy">Cholecystectomy</option>
                <option value="hysterectomy">Hysterectomy</option>
                <option value="tonsillectomy">Tonsillectomy</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Date"
                name="medicalHistory.surgicalHistory.date"
              >
                <option value="">Select Time Frame</option>
                <option value="recent">Within last year</option>
                <option value="medium">1-5 years ago</option>
                <option value="long">Over 5 years ago</option>
              </SelectInput>
              <SelectInput
                label="Complications"
                name="medicalHistory.surgicalHistory.complications"
              >
                <option value="">Select Complication Status</option>
                <option value="none">No complications</option>
                <option value="minor">Minor complications</option>
                <option value="major">Major complications</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">
                Family Medical History
              </h4>
              <SelectInput
                label="Condition"
                name="medicalHistory.familyMedicalHistory.condition"
              >
                <option value="">Select Condition</option>
                <option value="heartDisease">Heart Disease</option>
                <option value="diabetes">Diabetes</option>
                <option value="cancer">Cancer</option>
                <option value="hypertension">Hypertension</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Relationship"
                name="medicalHistory.familyMedicalHistory.relationship"
              >
                <option value="">Select Relationship</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="grandparent">Grandparent</option>
                <option value="other">Other</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Immunization Records</h4>
              <SelectInput
                label="Vaccination"
                name="medicalHistory.immunizationRecords.vaccination"
              >
                <option value="">Select Vaccination</option>
                <option value="influenza">Influenza</option>
                <option value="tetanus">Tetanus</option>
                <option value="mmr">MMR</option>
                <option value="hpv">HPV</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Date Administered"
                name="medicalHistory.immunizationRecords.dateAdministered"
              >
                <option value="">Select Time Frame</option>
                <option value="recent">Within last year</option>
                <option value="medium">1-5 years ago</option>
                <option value="long">Over 5 years ago</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Major Injuries</h4>
              <SelectInput
                label="Description"
                name="medicalHistory.majorInjuries.description"
              >
                <option value="">Select Injury Type</option>
                <option value="fracture">Fracture</option>
                <option value="concussion">Concussion</option>
                <option value="sprain">Sprain/Strain</option>
                <option value="burn">Burn</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Date Occurred"
                name="medicalHistory.majorInjuries.dateOccurred"
              >
                <option value="">Select Time Frame</option>
                <option value="recent">Within last year</option>
                <option value="medium">1-5 years ago</option>
                <option value="long">Over 5 years ago</option>
              </SelectInput>
              <SelectInput
                label="Treatment Received"
                name="medicalHistory.majorInjuries.treatmentReceived"
              >
                <option value="">Select Treatment Type</option>
                <option value="surgery">Surgery</option>
                <option value="medication">Medication</option>
                <option value="physicalTherapy">Physical Therapy</option>
                <option value="other">Other</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Chronic Medications</h4>
              <SelectInput
                label="Medication"
                name="medicalHistory.chronicMedications.medication"
              >
                <option value="">Select Medication Type</option>
                <option value="antihypertensive">Antihypertensive</option>
                <option value="antidiabetic">Antidiabetic</option>
                <option value="antidepressant">Antidepressant</option>
                <option value="thyroid">Thyroid Medication</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Duration of Use"
                name="medicalHistory.chronicMedications.durationOfUse"
              >
                <option value="">Select Duration</option>
                <option value="short">Less than 1 year</option>
                <option value="medium">1-5 years</option>
                <option value="long">More than 5 years</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">
                Past Hospitalizations
              </h4>
              <SelectInput
                label="Reason"
                name="medicalHistory.pastHospitalizations.reason"
              >
                <option value="">Select Reason</option>
                <option value="surgery">Surgery</option>
                <option value="acuteIllness">Acute Illness</option>
                <option value="injury">Injury</option>
                <option value="chronicCondition">
                  Chronic Condition Management
                </option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Date and Duration"
                name="medicalHistory.pastHospitalizations.dateAndDuration"
              >
                <option value="">Select Time Frame and Duration</option>
                <option value="recentShort">
                  Within last year - Short stay (1-3 days)
                </option>
                <option value="recentLong">
                  Within last year - Long stay (4+ days)
                </option>
                <option value="pastShort">
                  More than a year ago - Short stay (1-3 days)
                </option>
                <option value="pastLong">
                  More than a year ago - Long stay (4+ days)
                </option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">
                Mental Health History
              </h4>
              <SelectInput
                label="Diagnosed Conditions"
                name="medicalHistory.mentalHealthHistory.diagnosedConditions"
              >
                <option value="">Select Condition</option>
                <option value="depression">Depression</option>
                <option value="anxiety">Anxiety</option>
                <option value="bipolar">Bipolar Disorder</option>
                <option value="schizophrenia">Schizophrenia</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Treatments Received"
                name="medicalHistory.mentalHealthHistory.treatmentsReceived"
              >
                <option value="">Select Treatment</option>
                <option value="medication">Medication</option>
                <option value="therapy">Therapy/Counseling</option>
                <option value="hospitalization">Hospitalization</option>
                <option value="other">Other</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Reproductive History</h4>
              <SelectInput
                label="Pregnancies"
                name="medicalHistory.reproductiveHistory.pregnancies"
              >
                <option value="">Select Number of Pregnancies</option>
                <option value="none">None</option>
                <option value="one">One</option>
                <option value="two">Two</option>
                <option value="threeOrMore">Three or more</option>
              </SelectInput>
              <SelectInput
                label="Childbirth Details"
                name="medicalHistory.reproductiveHistory.childbirthDetails"
              >
                <option value="">Select Childbirth Details</option>
                <option value="vaginal">Vaginal delivery</option>
                <option value="cesarean">Cesarean section</option>
                <option value="both">Both vaginal and cesarean</option>
                <option value="complications">
                  Delivery with complications
                </option>
                <option value="noChildbirth">No childbirth</option>
              </SelectInput>

              <h3 className="text-2xl font-semibold mt-8">Treatment Records</h3>

              <h4 className="text-xl font-medium mt-4">Visit Information</h4>
              <SelectInput
                label="Date of Visit"
                name="treatmentRecords.visitInformation.dateOfVisit"
              >
                <option value="">Select Time Frame</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
                <option value="older">Older</option>
              </SelectInput>
              <SelectInput
                label="Reason for Visit"
                name="treatmentRecords.visitInformation.reasonForVisit"
              >
                <option value="">Select Reason</option>
                <option value="checkup">Regular Check-up</option>
                <option value="illness">Acute Illness</option>
                <option value="followUp">Follow-up</option>
                <option value="chronicCondition">
                  Chronic Condition Management
                </option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Treating Physician"
                name="treatmentRecords.visitInformation.treatingPhysician"
              >
                <option value="">Select Physician Type</option>
                <option value="primaryCare">Primary Care Physician</option>
                <option value="specialist">Specialist</option>
                <option value="emergencyMed">Emergency Medicine</option>
                <option value="other">Other</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Diagnosis</h4>
              <SelectInput
                label="Primary Diagnosis"
                name="treatmentRecords.diagnosis.primaryDiagnosis"
              >
                <option value="">Select Primary Diagnosis</option>
                <option value="respiratory">Respiratory Condition</option>
                <option value="cardiovascular">Cardiovascular Condition</option>
                <option value="gastrointestinal">
                  Gastrointestinal Condition
                </option>
                <option value="musculoskeletal">
                  Musculoskeletal Condition
                </option>
                <option value="neurological">Neurological Condition</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Secondary Diagnoses"
                name="treatmentRecords.diagnosis.secondaryDiagnoses"
              >
                <option value="">Select Secondary Diagnosis</option>
                <option value="none">None</option>
                <option value="hypertension">Hypertension</option>
                <option value="diabetes">Diabetes</option>
                <option value="obesity">Obesity</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="ICD Codes"
                name="treatmentRecords.diagnosis.icdCodes"
              >
                <option value="">Select ICD Code Range</option>
                <option value="a00-b99">
                  A00-B99 Infectious and parasitic diseases
                </option>
                <option value="c00-d48">C00-D48 Neoplasms</option>
                <option value="e00-e90">
                  E00-E90 Endocrine, nutritional and metabolic diseases
                </option>
                <option value="f00-f99">
                  F00-F99 Mental and behavioral disorders
                </option>
                <option value="other">Other</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Treatment Plan</h4>
              <SelectInput
                label="Prescribed Medication"
                name="treatmentRecords.treatmentPlan.prescribedMedications.medication"
              >
                <option value="">Select Medication Type</option>
                <option value="antibiotic">Antibiotic</option>
                <option value="analgesic">Analgesic</option>
                <option value="antiInflammatory">Anti-inflammatory</option>
                <option value="antihypertensive">Antihypertensive</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Medication Dosage"
                name="treatmentRecords.treatmentPlan.prescribedMedications.dosage"
              >
                <option value="">Select Dosage</option>
                <option value="low">Low dose</option>
                <option value="standard">Standard dose</option>
                <option value="high">High dose</option>
              </SelectInput>
              <SelectInput
                label="Medication Instructions"
                name="treatmentRecords.treatmentPlan.prescribedMedications.instructions"
              >
                <option value="">Select Instructions</option>
                <option value="onceDaily">Once daily</option>
                <option value="twiceDaily">Twice daily</option>
                <option value="threeTimesDaily">Three times daily</option>
                <option value="asNeeded">As needed</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Non-Pharmacological Interventions"
                name="treatmentRecords.treatmentPlan.nonPharmacologicalInterventions"
              >
                <option value="">Select Intervention</option>
                <option value="physicalTherapy">Physical Therapy</option>
                <option value="dietaryChanges">Dietary Changes</option>
                <option value="exerciseProgram">Exercise Program</option>
                <option value="counseling">Counseling</option>
                <option value="other">Other</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Procedures Performed</h4>
              <SelectInput
                label="Procedure Name"
                name="treatmentRecords.proceduresPerformed.name"
              >
                <option value="">Select Procedure</option>
                <option value="biopsy">Biopsy</option>
                <option value="endoscopy">Endoscopy</option>
                <option value="xRay">X-Ray</option>
                <option value="mri">MRI</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Procedure Date"
                name="treatmentRecords.proceduresPerformed.date"
              >
                <option value="">Select Time Frame</option>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="older">Older</option>
              </SelectInput>
              <SelectInput
                label="Procedure Outcome"
                name="treatmentRecords.proceduresPerformed.outcome"
              >
                <option value="">Select Outcome</option>
                <option value="normal">Normal/Expected Results</option>
                <option value="abnormal">Abnormal Results</option>
                <option value="inconclusive">Inconclusive</option>
                <option value="complications">Complications Occurred</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Laboratory Tests</h4>
              <SelectInput
                label="Test"
                name="treatmentRecords.laboratoryTests.test"
              >
                <option value="">Select Test Type</option>
                <option value="cbc">Complete Blood Count (CBC)</option>
                <option value="metabolicPanel">Metabolic Panel</option>
                <option value="lipidProfile">Lipid Profile</option>
                <option value="thyroidFunction">Thyroid Function</option>
                <option value="urinalysis">Urinalysis</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Results"
                name="treatmentRecords.laboratoryTests.results"
              >
                <option value="">Select Result Type</option>
                <option value="normal">Normal</option>
                <option value="abnormalLow">Abnormal Low</option>
                <option value="abnormalHigh">Abnormal High</option>
                <option value="inconclusive">Inconclusive</option>
              </SelectInput>
              <SelectInput
                label="Date of Results"
                name="treatmentRecords.laboratoryTests.dateOfResults"
              >
                <option value="">Select Time Frame</option>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
                <option value="older">Older</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Imaging Studies</h4>
              <SelectInput
                label="Type"
                name="treatmentRecords.imagingStudies.type"
              >
                <option value="">Select Imaging Type</option>
                <option value="xRay">X-Ray</option>
                <option value="ct">CT Scan</option>
                <option value="mri">MRI</option>
                <option value="ultrasound">Ultrasound</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Date"
                name="treatmentRecords.imagingStudies.date"
              >
                <option value="">Select Time Frame</option>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
                <option value="older">Older</option>
              </SelectInput>
              <SelectInput
                label="Results Summary"
                name="treatmentRecords.imagingStudies.resultsSummary"
              >
                <option value="">Select Result Summary</option>
                <option value="normal">Normal</option>
                <option value="minorAbnormalities">Minor Abnormalities</option>
                <option value="significantFindings">
                  Significant Findings
                </option>
                <option value="inconclusive">Inconclusive</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">Referrals</h4>
              <SelectInput
                label="Specialist"
                name="treatmentRecords.referrals.specialist"
              >
                <option value="">Select Specialist Type</option>
                <option value="cardiologist">Cardiologist</option>
                <option value="neurologist">Neurologist</option>
                <option value="endocrinologist">Endocrinologist</option>
                <option value="orthopedist">Orthopedist</option>
                <option value="other">Other</option>
              </SelectInput>
              <SelectInput
                label="Reason for Referral"
                name="treatmentRecords.referrals.reasonForReferral"
              >
                <option value="">Select Reason</option>
                <option value="furtherEvaluation">Further Evaluation</option>
                <option value="specializedTreatment">
                  Specialized Treatment
                </option>
                <option value="secondOpinion">Second Opinion</option>
                <option value="monitoring">Ongoing Monitoring</option>
                <option value="other">Other</option>
              </SelectInput>

              <h4 className="text-xl font-medium mt-4">
                Follow-Up Instructions
              </h4>
              <SelectInput
                label="Next Appointment Date"
                name="treatmentRecords.followUpInstructions.nextAppointmentDate"
              >
                <option value="">Select Time Frame</option>
                <option value="oneWeek">1 Week</option>
                <option value="twoWeeks">2 Weeks</option>
                <option value="oneMonth">1 Month</option>
                <option value="threeMonths">3 Months</option>
                <option value="sixMonths">6 Months</option>
                <option value="oneYear">1 Year</option>
              </SelectInput>
              <SelectInput
                label="Specific Instructions"
                name="treatmentRecords.followUpInstructions.specificInstructions"
              >
                <option value="">Select Instructions</option>
                <option value="medication">Continue Medication</option>
                <option value="lifestyle">Lifestyle Changes</option>
                <option value="monitoring">Self-Monitoring</option>
                <option value="testing">Further Testing</option>
                <option value="other">Other</option>
              </SelectInput>

              <SelectInput
                label="Progress Notes"
                name="treatmentRecords.progressNotes"
              >
                <option value="">Select Progress Note Type</option>
                <option value="improvement">Condition Improving</option>
                <option value="stable">Condition Stable</option>
                <option value="worsening">Condition Worsening</option>
                <option value="complication">New Complication</option>
                <option value="other">Other</option>
              </SelectInput>

              {error && <p className="text-red-500 mt-2">{error}</p>}

              <button
                type="submit"
                className="bg-black text-white mt-5 p-3 rounded-md font-bold w-full cursor-pointer"
              >
                Submit Bid
              </button>
            </Form>
          )}
        </Formik>
      </article>
    </section>
  );
};

export default Marketplace;
