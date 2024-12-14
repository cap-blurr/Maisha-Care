"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/inputs/TextInput";
import DateInput from "@/components/inputs/DateInput";
import Link from "next/link";
import { format } from "date-fns";
import { useAccount } from "wagmi";
import SignUpWrapper from "@/components/wrapper/signup-wrapper";

interface FormData {
  name: string;
  dateOfBirth: string;
  nationalID: string;
}

interface FormValues {
  formData: FormData;
}

const SignupSchema = Yup.object({
  formData: Yup.object({
    name: Yup.string()
      .min(6, "Min of 6 Characters required")
      .required("Full Name is Required"),
    dateOfBirth: Yup.string().required("Date of Birth is Required"),
    nationalID: Yup.string()
      .max(20, "Must be 20 characters or less")
      .min(5, "Min of 5 Characters required")
      .required("National ID is Required"),
  }),
});

const initialValues: FormValues = {
  formData: {
    name: "",
    dateOfBirth: "",
    nationalID: "",
  },
};

const Signup: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const router = useRouter();
  
  // Only initialize wallet hooks after mounting
  const { address, isConnected } = mounted ? useAccount() : { address: undefined, isConnected: false };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <section className="app-background min-h-screen flex items-center justify-center px-4">
      <article className="p-8 md:p-10 bg-white rounded-md shadow-sm w-full max-w-md">
        <h2 className="text-3xl md:text-4xl text-black font-bold">
          Create a Doctor&apos;s Account
        </h2>
        <h4 className="text-black my-5">
          Enter your Details to Sign Up to MaishaCare
        </h4>

        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            console.log("Form submitted:", values);
            // Add your form submission logic here
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <TextInput
                label="Doctor's Name"
                name="formData.name"
                type="text"
                placeholder="Enter your Name"
              />
              
              <TextInput
                label="National ID"
                name="formData.nationalID"
                type="text"
                placeholder="Enter your National ID"
              />
              
              <DateInput
                name="formData.dateOfBirth"
                label="Date of Birth"
                onChange={(date: Date | undefined) => {
                  setFieldValue("formData.dateOfBirth", formatDate(date));
                }}
              />

              <div className="flex flex-col justify-start mb-5">
                <p className="text-[#909090] p-1 text-sm font-semibold">
                  <Link 
                    href="/signup" 
                    className="hover:text-black transition-colors duration-200"
                  >
                    Create a Patient&apos;s Account?
                  </Link>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {mounted && (
                <>
                  {isConnected && address ? (
                    <SignUpWrapper
                      address={address}
                      role="doctor"
                      formData={values.formData}
                    />
                  ) : (
                    <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md text-sm">
                      Please connect your wallet to continue
                    </div>
                  )}
                </>
              )}
            </Form>
          )}
        </Formik>
      </article>
    </section>
  );
};

export default Signup;