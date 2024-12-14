"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react'
import success from "../../../../public/json/success.json";
import error from "../../../../public/json/error.json";
import { useForm } from 'react-hook-form';
import StepperForm from '@/components/stepper/stepper-form';
import dynamic from 'next/dynamic';

// Dynamically import the Player component with SSR disabled
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

const AddMedicalRecord = () => {
    const [notification, setNotification] = React.useState<string>();
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);
    const [date, setDate] = React.useState<Date>();
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
    } = useForm();
  
    const convertBase64 = async (file: any) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
  
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
  
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };
  
    const onSubmit = async (data: any) => {
      const propertyTitleDeedbase64 = (await convertBase64(
        data.propertyTitleDeed[0]
      )) as string;
      const propertyImageBase64 = (await convertBase64(
        data.propertyImage[0]
      )) as string;
      const acquistionDateString = date?.toDateString();
      
      try {
        // Your submit logic here
      } catch (err) {
        setNotification("Failed to enlist");
        setOpenError(true);
      }
    };
  
    return (
      <main className="xl:mx-[100px] h-full">
        <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="mb-[20px]">
                Property Enlisted Successfully
              </DialogTitle>
              <Player
                keepLastFrame
                autoplay
                src={success}
                style={{ height: "300px", width: "300px" }}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={openError} onOpenChange={setOpenError}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="mb-[20px]">
                Property Enlisting Failed
              </DialogTitle>
              <Player
                keepLastFrame
                autoplay
                src={error}
                style={{ height: "300px", width: "300px" }}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <StepperForm />
      </main>
    );
}

export default AddMedicalRecord