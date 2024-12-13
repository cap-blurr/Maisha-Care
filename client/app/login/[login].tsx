// Login.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Adjusted import for useRouter
import * as Yup from "yup";
import Link from "next/link";
import { LoginFormFields } from "@/types/form-types";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import LoadingDialog from "@/components/dialog/LoadingDialog";
import ErrorDialog from "@/components/dialog/ErrorDialog";
import { Form, Formik } from "formik";
import TextInput from "@/components/inputs/TextInput";
import PasswordInput from "@/components/inputs/PasswordInput";

const Login: React.FC = () => {
  const [openLoading, setOpenLoading] = useState(false);
  const [openLoggin, setOpenLoggin] = useState(false); // Opens the Account Creation Loading Dialog
  const [openAccErr, setOpenAccErr] = useState(false); // Opens the Failed Acc Creation Loading Dialog
  const api = useAxios();
  const router = useRouter();

  // Mutation to Initiate Login User
  const initiateLoginUser = useMutation({
    mutationFn: (initiateLoginUserPost: LoginFormFields) => {
      return api.post(
        "auth/login",
        {
          email: initiateLoginUserPost.email,
          password: initiateLoginUserPost.password,
        },
        {
          method: "POST",
        }
      );
    },
    onSuccess: (data, variables, context) => {
      setOpenLoading(false);
      setOpenLoggin(true);
      router.replace("/home");
    },
    onError: (error, variables, context) => {
      // Handle errors, e.g., show a message to the user
      console.error(error);
      setOpenLoading(false);
      setOpenAccErr(true);
    },
    onSettled: (data, error, variables, context) => {},
  });

  return (
    <section className="app-background">
      <LoadingDialog
        message="Confirming Credentials..."
        openLoading={openLoading}
        setOpenLoading={setOpenLoading}
      />
      <LoadingDialog
        message="Logging you in..."
        openLoading={openLoggin}
        setOpenLoading={setOpenLoggin}
      />
      <ErrorDialog
        message="Failed to Login"
        openError={openAccErr}
        setOpenError={setOpenAccErr}
      />
      <article>
        <h2 className="text-4xl text-white font-bold">Sign in to MaishaCare</h2>
        <h4 className="text-white my-5">Enter your Email to Login</h4>
        {/* SignUp using Formik */}
        <Formik
          initialValues={{
            fullname: "",
            email: "",
            password: "",
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
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(async () => {
              // Use the modifiedPhoneNumber in your API request
              const requestData = {
                ...values,
              };

              // Call the Initiate Register User Mutation
              initiateLoginUser.mutate(requestData);
              setOpenLoggin(false);
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
            <div className="flex flex-col justify-start mb-5">
              <p className="text-[#909090] p-1 text-sm font-semibold">
                <Link href="/signup" className="hover:text-white">
                  Create a Patient's Account?
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
              className="bg-white mt-5 p-3 rounded-full font-bold w-full cursor-pointer"
            >
              Submit
            </button>
          </Form>
        </Formik>
      </article>
    </section>
  );
};

export default Login;
