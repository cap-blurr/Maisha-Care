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

const Signup = () => {
  const router = useRouter();
  const [tillNumberParts, setTillNumberParts] = useState("");
  const [openSigningUp, setOpenSigningUp] = useState(false); // Opens the Account Creation Loading Dialog
  const [openConfirmingOTP, setOpenConfirmingOTP] = useState(false); // Opens the confirm otp Loading Dialog
  const [openAccErr, setOpenAccErr] = useState(false); // Opens the Failed Acc Creation Loading Dialog
  const api = useAxios();
  const [userDetails, setUserDetails] = useState<SignUpFormData>({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Mutation to Initiate Register User
  const initiateRegisterUser = useMutation({
    mutationFn: (initiateRegisterUserPost: SignUpFormData) => {
      setOpenConfirmingOTP(true);
      return api.post(
        "auth/register/initiate",
        {
          fullname: initiateRegisterUser.fullname,
          email: initiateRegisterUser.email,
          password: initiateRegisterUserPost.password,
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

  // Mutation Side Effect to Login User
  const loginUser = useMutation({
    mutationFn: (loginUserPost: SignUpFormData) => {
      return api.post(
        "auth/login",
        {
          fullname: loginUserPost.fullname,
          email: loginUserPost.email,
          password: loginUserPost.password,
        },
        {
          method: "POST",
        }
      );
    },
    onSuccess: (data, variables, context) => {
      setOpenSigningUp(false); //
      router.replace("/home"); // Successfully logged in, navigate to home or dashboard
    },
    onError: (error, variables, context) => {
      setOpenAccErr(true);
    },
    onSettled: (data, error, variables, context) => {},
  });

  const verifyUser = useMutation({
    mutationFn: (verifyUserPost) => {
      return api.post(
        "auth/register",
        {
          ...userDetails,
          otp: tillNumberParts,
        },
        {
          method: "POST",
        }
      );
    },
    onSuccess: (data, variables, context) => {
      loginUser.mutate(userDetails);
    },
    onError: (error, variables, context) => {
      // Handle errors, e.g., invalid OTP
      console.error("Failed to verify OTP.");
      setOpenAccErr(true);
    },
    onSettled: (data, error, variables, context) => {
      console.log(data);
    },
  });

  const verifyOTP = async (otpData: OTPFormData) => {
    if (!userDetails) return; // Ensure userDetails is not null
    // console.log(otpData.otp);

    // Call the verify API with stored user details and provided OTP
    const promise = verifyUser.mutate();
    console.log("promise", promise);
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
          Create a Doctor's Account
        </h2>
        <h4 className="text-white my-5">
          Enter your Details to Create an Account
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
            email: Yup.number()
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
              className="bg-white mt-5 p-3 rounded-md font-bold w-full cursor-pointer"
            >
              Submit
            </button>
          </Form>
        </Formik>
      </article>
    </section>
  );
};

export default Signup;
