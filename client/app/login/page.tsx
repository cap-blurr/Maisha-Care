"use client";

import React, { useState, useEffect } from "react";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingDialog from "@/components/dialog/LoadingDialog";
import ErrorDialog from "@/components/dialog/ErrorDialog";

const Login: React.FC = () => {
  const [openLoading, setOpenLoading] = useState(false);
  const [openLoggin, setOpenLoggin] = useState(false);
  const [openAccErr, setOpenAccErr] = useState(false);
  const router = useRouter();

  const { ready, authenticated } = usePrivy();

  // Disable login when Privy is not ready or user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  const { login } = useLogin({
    onComplete: (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      linkedAccount
    ) => {
      console.log(
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        linkedAccount
      );
      setOpenLoading(true);
      setTimeout(() => {
        router.replace("/patient");
      }, 1500);
      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounted
    },
    onError: (error) => {
      console.log(error);
      setOpenAccErr(true);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });

  //   const handleLogin = async () => {
  //     try {
  //       await login({
  //         disableSignup: false,
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       setOpenLoading(false);
  //       setOpenAccErr(true);
  //     }
  //   };

  //   const handleSuccessfulLogin = async () => {
  //     try {
  //       setOpenLoading(false);
  //       setOpenLoggin(true);
  //       // Add a small delay to show the success message
  //       setTimeout(() => {
  //         router.replace("/home");
  //       }, 1500);
  //     } catch (error) {
  //       console.error(error);
  //       setOpenAccErr(true);
  //       setOpenLoggin(false);
  //     }
  //   };

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
        <h4 className="text-white my-5">Choose your preferred login method</h4>

        <div className="flex flex-col gap-4">
          <button
            onClick={login}
            disabled={disableLogin}
            className="bg-white p-3 rounded-full font-bold w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Sign In with Privy
          </button>

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
        </div>
      </article>
    </section>
  );
};

export default Login;
