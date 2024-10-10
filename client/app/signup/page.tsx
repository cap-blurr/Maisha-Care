"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/inputs/TextInput";
import PasswordInput from "@/components/inputs/PasswordInput";
import { OTPFormData, SignUpFormData } from "@/types/form-types";
import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import LoadingDialog from "@/components/dialog/LoadingDialog";
import ErrorDialog from "@/components/dialog/ErrorDialog";
import Link from "next/link";
import { useWriteContract } from "wagmi";
import ConnectButton from "@/components/buttons/connect-button";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";

const Signup = () => {
  const router = useRouter();
  const [tillNumberParts, setTillNumberParts] = useState("");
  const [openSigningUp, setOpenSigningUp] = useState(false); // Opens the Account Creation Loading Dialog
  const [openConfirmingOTP, setOpenConfirmingOTP] = useState(false); // Opens the confirm otp Loading Dialog
  const [openAccErr, setOpenAccErr] = useState(false); // Opens the Failed Acc Creation Loading Dialog
  const api = useAxios();
  const [userDetails, setUserDetails] = useState<SignUpFormData>({
    role: "",
    address: "",
    formData: {
      name: "",
      dateOfBirth: "",
      specialization: "",
    },
  });
  const { data: hash, writeContract } = useWriteContract();

  // Mutation to Initiate Register User
  const initiateRegisterUser = useMutation({
    mutationFn: (initiateRegisterUserPost: SignUpFormData) => {
      setOpenConfirmingOTP(true);
      return api.post(
        "api/prepare-verification",
        {
          role: initiateRegisterUser.role,
          address: initiateRegisterUser.address,
          formData: {
            name: initiateRegisterUser.name,
            dateOfBirth: initiateRegisterUser.dateOfBirth,
            specialization: initiateRegisterUser.specialization,
          },
        },
        {
          method: "POST",
        }
      );
    },
    onSuccess: (data, variables, context) => {
      setOpenSigningUp(false);
      setUserDetails(variables); // Store user details with the modified phone number
    },
    onError: (error, variables, context) => {
      // Handle errors, e.g., show a message to the user
      console.error("Failed to initiate sign-up.");
      setOpenAccErr(true);
    },
    onSettled: (data, error, variables, context) => {
      setOpenConfirmingOTP(false);
    },
  });

  const handleClick = () => {
    // writeContract({
    //   address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
    //   abi,
    //   functionName: "mint",
    //   args: [BigInt(tokenId)],
    // });
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
        {/* SignUp using Formik */}
        <Formik
          initialValues={{
            fullname: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            fullname: Yup.string()
              .min(6, "Min of  6 Characters required")
              .required("Full Name is Required"),
            email: Yup.string()
              .min(13, "Min of 13 Characters required")
              .required("Email is Required"),
            password: Yup.string()
              .max(20, "Must be 20 characters or less")
              .min(5, "Min of 5 Characters required")
              .required("Password is Required"),
            confirmPassword: Yup.string()
              .max(20, "Must be 20 characters or less")
              .min(5, "Min of 5 Characters required")
              .oneOf([Yup.ref("password"), undefined], "Passwords must match")
              .required("Confirm Password is Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(async () => {
              setOpenSigningUp(true);

              // Call the Initiate Register User Mutation
              console.log({ ...values });
              initiateRegisterUser.mutate({ ...values });
              setOpenSigningUp(false);
              setSubmitting(false);
            }, 400);
          }}
        >
          <Form>
            <TextInput
              label="Patient's Name"
              name="fullname"
              type="text"
              placeholder="Enter your FullName"
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your Email"
            />
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter your Password"
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your Password"
            />
            <div className="flex flex-col justify-start mb-5">
              <p className="text-[#909090] p-1 text-sm font-semibold">
                Have an account?{" "}
                <Link href="/login" className="hover:text-white text-gray-300">
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
              className="bg-white text-black mt-5 p-3 rounded-md font-bold w-full cursor-pointer"
            >
              Submit
            </button>
          </Form>
        </Formik>
        <button onClick={handleClick}></button>
        <div className="flex flex-col items-center w-full">
          <ConnectWallet />
        </div>
      </article>
    </section>
  );
};

export default Signup;
