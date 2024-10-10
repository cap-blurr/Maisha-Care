"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/inputs/TextInput";
import { SignUpFormData } from "@/types/form-types";
import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import LoadingDialog from "@/components/dialog/LoadingDialog";
import ErrorDialog from "@/components/dialog/ErrorDialog";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import DateInput from "@/components/inputs/DateInput";
import { format } from "date-fns";

const Signup = () => {
  const router = useRouter();
  const api = useAxios();
  const { address, isConnected } = useAccount();
  const [openSigningUp, setOpenSigningUp] = useState(false);
  const [openConfirmingOTP, setOpenConfirmingOTP] = useState(false);
  const [openAccErr, setOpenAccErr] = useState(false);

  // Validation schema with date as string
  const SignupSchema = Yup.object({
    name: Yup.string()
      .min(6, "Min of 6 Characters required")
      .required("Full Name is Required"),
    dateOfBirth: Yup.string().required("Date of Birth is Required"),
    nationalID: Yup.string()
      .max(20, "Must be 20 characters or less")
      .min(5, "Min of 5 Characters required")
      .required("National ID is Required"),
    address: Yup.string().required("Please connect your wallet to continue"),
  });

  const initiateRegisterUser = useMutation({
    mutationFn: (values: SignUpFormData) => {
      // setOpenConfirmingOTP(true);
      console.log(values);
      
      return api.post("api/prepare-verification", values);
    },
    onSuccess: (data, variables) => {
      // setOpenSigningUp(false);
      // Handle successful registration
    },
    onError: (error) => {
      console.error("Failed to initiate sign-up:", error);
      
      // setOpenAccErr(true);
    },
    onSettled: () => {
      // setOpenConfirmingOTP(false);
    },
  });

  // Function to format date to string
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  return (
    <section className="app-background">
      <LoadingDialog
        message="Creating Account"
        openLoading={openSigningUp}
        setOpenLoading={setOpenSigningUp}
      />
      <LoadingDialog
        message="Sending OTP Code...."
        openLoading={openConfirmingOTP}
        setOpenLoading={setOpenConfirmingOTP}
      />
      <ErrorDialog
        message="Failed to Create Account"
        openError={openAccErr}
        setOpenError={setOpenAccErr}
      />
      <article>
        <h2 className="text-4xl text-white font-bold">
          Create a Patient Account
        </h2>
        <h4 className="text-white my-5">
          Enter your Details to Sign Up to MaishaCare
        </h4>

        <Formik
          initialValues={{
            name: "",
            dateOfBirth: "",
            nationalID: "",
            role: "patient",
            address: address || "",
          }}
          enableReinitialize
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting }) => {
            // if (!isConnected) {
            //   setOpenAccErr(true);
            //   return;
            // }

            
            // setOpenSigningUp(true);
            const submitData: SignUpFormData = {
              role: values.role,
              address: address!,
              formData: {
                name: values.name,
                dateOfBirth: values.dateOfBirth,
                nationalID: values.nationalID
              }
            };
            
            console.log(submitData);
            initiateRegisterUser.mutate(submitData);
            // setSubmitting(false);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <TextInput
                label="Patient's Name"
                name="name"
                type="text"
                placeholder="Enter your Name"
              />
              <TextInput
                label="National ID"
                name="nationalID"
                type="text"
                placeholder="Enter your National ID"
              />
              <DateInput
                name="dateOfBirth"
                label="Date of Birth"
                onChange={(date: Date | undefined) => {
                  setFieldValue("dateOfBirth", formatDate(date));
                }}
              />

              <div className="flex flex-col items-center w-full my-4">
                <ConnectWallet />
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
                    className="hover:text-white text-gray-300"
                  >
                    Login
                  </Link>
                </p>
                <p className="text-[#909090] p-1 text-sm font-semibold">
                  <Link href="/signup/doctor" className="hover:text-white">
                    Create a Doctor's Account?
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                disabled={!isConnected}
                className={`bg-white text-black mt-5 p-3 rounded-md font-bold w-full 
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
