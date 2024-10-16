"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { VerifiedAddressRegistry } from "../../abi/VerifiedAddressRegistry";
import { ethers } from "ethers";
import { VERIFIED_ADDRESS_REGISTRY_ADDRESS } from "../../constants";
import TextInput from "@/components/inputs/TextInput";
import DateInput from "@/components/inputs/DateInput";
import Link from "next/link";
import { format } from "date-fns";
// import LoadingDialog from "@/components/dialog/LoadingDialog";
// import ErrorDialog from "@/components/dialog/ErrorDialog";

const Signup = () => {
  const router = useRouter();
  // const [openSigningUp, setOpenSigningUp] = useState(false);
  // const [openAccErr, setOpenAccErr] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isVerifiedData, setIsVerifiedData] = useState<any>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const address = await newSigner.getAddress();
        const network = await newProvider.getNetwork();

        setProvider(newProvider);
        setSigner(newSigner);
        setAccount(address);
        setChainId(network.chainId);

        readContractData(newProvider, address);
      } catch (err) {
        console.error(err);
        setError("Failed to connect wallet");
      }
    } else {
      setError("MetaMask is not installed");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsVerifiedData(null);
  };

  const readContractData = async (
    currentProvider: ethers.providers.Web3Provider,
    currentAccount: string
  ) => {
    if (currentProvider && currentAccount) {
      const contract = new ethers.Contract(
        VERIFIED_ADDRESS_REGISTRY_ADDRESS,
        VerifiedAddressRegistry,
        currentProvider
      );
      try {
        const data = await contract.isVerified(
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes("patient")),
          currentAccount
        );
        setIsVerifiedData(data);
        console.log("data", data);
      } catch (err) {
        console.error(err);
        setError("Failed to read contract data");
      }
    }
  };

  const writeContractData = async (values: {
    formData: { name: string; dateOfBirth: string; nationalID: string };
  }) => {
    if (signer && account) {
      console.log(values);
      const contract = new ethers.Contract(
        VERIFIED_ADDRESS_REGISTRY_ADDRESS,
        VerifiedAddressRegistry,
        signer
      );
      try {
        // setOpenSigningUp(true);
        const roleHash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes("patient")
        );
        console.log({
          name: values.formData.name,
          dateOfBirth: values.formData.dateOfBirth,
          nationalID: values.formData.nationalID,
          role: roleHash,
          address: account,
        });
        const dataHash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(
            JSON.stringify({
              name: values.formData.name,
              dateOfBirth: values.formData.dateOfBirth,
              nationalID: values.formData.nationalID,
              role: roleHash,
              address: account,
            })
          )
        );
        console.log(dataHash);
        
        const tx = await contract.verifyAddress(roleHash, account, dataHash);
        const trans = await tx.wait();
        console.log("trans:", trans);

        // setOpenSigningUp(false);
        router.push("/patient");
      } catch (err) {
        console.error(err);
        setError("Failed to write to contract: " + (err as Error).message);
        // setOpenSigningUp(false);
        // setOpenAccErr(true);
      }
    } else {
      setError("Please connect your wallet");
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (provider) {
            readContractData(provider, accounts[0]);
          }
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", (chainId: string) => {
        const newChainId = parseInt(chainId, 16);
        setChainId(newChainId);
        if (provider && account) {
          readContractData(provider, account);
        }
      });
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, [provider, account]);

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

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const handleSubmit = async (values: any) => {
    if (!account) {
      setError("Please connect your wallet to continue");
      return;
    }
    await writeContractData(values);
  };

  return (
    <section className="app-background">
      {/* <LoadingDialog
        message="Creating Account"
        openLoading={openSigningUp}
        setOpenLoading={setOpenSigningUp}
      />
      <ErrorDialog
        message="Failed to Create Account"
        openError={openAccErr}
        setOpenError={setOpenAccErr}
      /> */}
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
          }}
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
                {account ? (
                  <button
                    type="button"
                    onClick={disconnectWallet}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Disconnect Wallet ({account.slice(0, 6)}...
                    {account.slice(-4)})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={connectWallet}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Connect Wallet
                  </button>
                )}
                {!account && (
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
                disabled={!account}
                className={`bg-black text-white mt-5 p-3 rounded-md font-bold w-full 
                  ${
                    !account
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
              >
                {account ? "Submit" : "Connect Wallet to Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </article>
    </section>
  );
};

export default Signup;
