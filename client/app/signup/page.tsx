// src/app/signup/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/inputs/TextInput";
import { SignUpFormData } from "@/types/form-types";
import LoadingDialog from "@/components/dialog/LoadingDialog";
import ErrorDialog from "@/components/dialog/ErrorDialog";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import DateInput from "@/components/inputs/DateInput";
import { format } from "date-fns";
import { useSignUp, SignUpData } from "@/hooks/useSignUp";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Signup = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [openSigningUp, setOpenSigningUp] = useState(false);
  const [openAccErr, setOpenAccErr] = useState(false);

  const { signUp, error } = useSignUp();

  // Validation schema with date as string
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
    role: Yup.string().required("Role is required"),
    address: Yup.string().required("Please connect your wallet to continue"),
  });

  // Function to format date to string
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const handleSubmit = async (values: SignUpFormData) => {
    if (!isConnected || !address) {
      // setOpenAccErr(true);
      return;
    }

    // setOpenSigningUp(true);
    const submitData: SignUpFormData = {
      role: values.role,
      address: address,
      formData: {
        name: values.formData.name,
        dateOfBirth: values.formData.dateOfBirth,
        nationalID: values.formData.nationalID,
      },
    };
    console.log(submitData);
    const result = await signUp(submitData);
    // setOpenSigningUp(false);

    if (result.success) {
      // Handle successful signup (e.g., show success message, redirect)
      router.push("/patient");
    } else {
      // setOpenAccErr(true);
    }
  };

  return (
    <section className="app-background">
      <LoadingDialog
        message="Creating Account"
        openLoading={openSigningUp}
        setOpenLoading={setOpenSigningUp}
      />
      <ErrorDialog
        message="Failed to Create Account"
        openError={openAccErr}
        setOpenError={setOpenAccErr}
      />
      <article>
        <h2 className="text-4xl text-black font-bold">
          Create a Patient Account
        </h2>
        <h4 className="text-black my-5">
          Enter your Details to Sign Up to MaishaCare
        </h4>

        <Formik
          initialValues={{
            formData: {
              name: "",
              dateOfBirth: "",
              nationalID: "",
            },
            role: "patient",
            address: address || "",
          }}
          enableReinitialize
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <TextInput
                label="Patient's Name"
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

              <div className="flex flex-col items-center w-full my-4">
                <ConnectWallet />
                <w3m-button />
                {/* <ConnectButton /> */}
                {!isConnected && (
                  <p className="text-red-500 mt-2">
                    Please connect your wallet to continue
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-start mb-5">
                <p className="text-[#909090] p-1 text-sm font-semibold">
                  Have an account?{" "}
                  <Link
                    href="/login"
                    className="hover:text-black text-gray-300"
                  >
                    Login
                  </Link>
                </p>
                <p className="text-[#909090] p-1 text-sm font-semibold">
                  <Link href="/signup/doctor" className="hover:text-black">
                    Create a Doctor's Account?
                  </Link>
                </p>
              </div>

              {error && <p className="text-red-500 mt-2">{error}</p>}

              <button
                type="submit"
                disabled={!isConnected}
                className={`bg-black text-white mt-5 p-3 rounded-md font-bold w-full 
                  ${
                    !isConnected
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
              >
                {isConnected ? "Submit" : "Connect Wallet to Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </article>
    </section>
  );
};

export default Signup;
