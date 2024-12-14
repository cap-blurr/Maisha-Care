"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/inputs/TextInput";
import SelectInput from "@/components/inputs/SelectInput";

const MarketplaceContent = () => {
  const [mounted, setMounted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const SignupSchema = Yup.object({
    patientName: Yup.string().required("Patient's Name is Required"),
    bidAmount: Yup.number()
      .positive("Bid amount must be positive")
      .required("Bid Amount is Required"),
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      console.log(values);
      alert(JSON.stringify(values, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading form...</div>
      </div>
    );
  }

  return (
    <section className="p-10">
      <article className="bg-white rounded-md shadow-sm p-10">
        <h2 className="text-4xl text-black font-bold">
          Bid for Health Record Data
        </h2>
        <h4 className="text-black my-5">
          Enter bid details and select health record components
        </h4>

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
              {/* Continue with all your SelectInput components here... */}
              <SelectInput
                label="Blood Pressure (Systolic)"
                name="currentHealth.vitalSigns.bloodPressureSystolic"
              >
                <option value="">Select Systolic Blood Pressure</option>
                <option value="normal">Normal (Less than 120 mmHg)</option>
                <option value="elevated">Elevated (120-129 mmHg)</option>
                <option value="stage1">Stage 1 Hypertension (130-139 mmHg)</option>
                <option value="stage2">Stage 2 Hypertension (140 mmHg or higher)</option>
              </SelectInput>

              {/* Add all other SelectInput components following the same pattern */}
              {/* ... */}

              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-black text-white mt-5 p-3 rounded-md font-bold w-full 
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isSubmitting ? 'Submitting Bid...' : 'Submit Bid'}
              </button>
            </Form>
          )}
        </Formik>
      </article>
    </section>
  );
};

export default MarketplaceContent;