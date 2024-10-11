"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Player } from '@lottiefiles/react-lottie-player';
import React from 'react'
import success from "../../../../public/json/success.json";
import error from "../../../../public/json/error.json";
import { Controller, useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from "date-fns";

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

      } catch (err) {
        setNotification("Failed to enlist");
        setOpenError(true);
      }
    };
  
  return (
    <main className=" xl:mx-[100px] h-full">
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
              ></Player>
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
              ></Player>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="flex justify-between">
          <h4 className="text-[#218B53] text-lg font-semibold">
            Add New Medical Record
          </h4>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="h-full flex flex-col justify-start"
        >
          <input
            {...register("titleLR", {
              required: " This is required ",
            })}
            type="text"
            className="p-3 rounded-lg border-2 border-[#218B53] bg-[#A5A5A520] w-full outline-none m-1 text-[#808195] mb-[30px]"
            placeholder="Title/LR no."
          />
          <span className="flex mb-[30px]">
            {/* <Controller
              name="county"
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue="default"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="bg-[#A5A5A520] text-[#808195] border-2 border-[#218B53] p-3 outline-none m-1">
                    <SelectValue placeholder="County" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#ffffff] text-[#808195] bg-opacity-100">
                    <SelectItem value="default">-- Select County --</SelectItem>
                    {countiesSource.map((element, index) => {
                      return (
                        <SelectItem key={index} value={element}>
                          {element}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            /> */}
            <input
              {...register("registrationSection", {
                required: " This is required ",
              })}
              type="text"
              className="p-3 rounded-lg border-2 border-[#218B53] bg-[#A5A5A520] w-full outline-none m-1 text-[#808195]"
              placeholder="Registration Section"
            />
          </span>
          <span className="flex mb-[30px]">
            <input
              {...register("blockNumber", {
                required: " This is required ",
              })}
              type="text"
              className="p-3 rounded-lg border-2 border-[#218B53] bg-[#A5A5A520] w-full outline-none m-1 text-[#808195]"
              placeholder="Block number"
            />
            <input
              {...register("parcelNumber", {
                required: " This is required ",
              })}
              type="text"
              className="p-3 rounded-lg border-2 border-[#218B53] bg-[#A5A5A520] w-full outline-none m-1 text-[#808195]"
              placeholder="Parcel Number"
            />
          </span>
          <span className="flex mb-[30px]">
            <input
              {...register("sizeHa", {
                required: " This is required ",
              })}
              type="text"
              className="p-3 rounded-lg border-2 border-[#218B53] bg-[#A5A5A520] w-full outline-none m-1 text-[#808195]"
              placeholder="Size(Ha)"
            />
            <input
              {...register("ownerName", {
                required: " This is required ",
              })}
              type="text"
              className="p-3 rounded-lg border-2 border-[#218B53] bg-[#A5A5A520] w-full outline-none m-1 text-[#808195]"
              placeholder="Owner Name(As Per ID)"
            />
          </span>
          <span className="flex mb-[30px]">
            <Controller
              name="leaseType"
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue="default"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="bg-[#A5A5A520] text-[#808195] border-2 border-[#218B53] p-3 outline-none m-1">
                    <SelectValue placeholder="Title Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#ffffff] text-[#808195] bg-opacity-100">
                    <SelectItem value="default">-- Title Type --</SelectItem>
                    <SelectItem value="Freehold">Freehold Title</SelectItem>
                    <SelectItem value="Leasehold">Leasehold Title</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="userType"
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue="default"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full bg-[#A5A5A520] text-[#808195] outline-none m-1  border-2 border-[#218B53] p-3">
                    <SelectValue placeholder="User Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#ffffff] text-[#808195] bg-opacity-100">
                    <SelectItem value="default">-- User Type --</SelectItem>
                    <SelectItem value="Commercial">Commercial </SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Free">Free</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </span>
          <span className="flex mb-[30px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full h-[50px] justify-start text-left font-normal border-2 border-[#218B53]",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Acquisition Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Controller
              name="acquistionType"
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue="default"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full bg-[#A5A5A520] text-[#808195] outline-none m-1  border-2 border-[#218B53] p-3">
                    <SelectValue placeholder="Acquistion Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#ffffff] text-[#808195] bg-opacity-100">
                    <SelectItem value="default">
                      -- Acquisition Type --
                    </SelectItem>
                    <SelectItem value="Commercial Purchase">
                      Commercial purchase
                    </SelectItem>
                    <SelectItem value="Inheritance ">Inheritance </SelectItem>
                    <SelectItem value="Community Allotment">
                      Community allotment
                    </SelectItem>
                    <SelectItem value="Government Lease">Government Lease</SelectItem>
                    <SelectItem value="Gift">Gift</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </span>
          <span className="flex mb-[30px]">
            <Controller
              name="encumbrance"
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue="encumbrance"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full bg-[#A5A5A520] text-[#808195] outline-none m-1  border-2 border-[#218B53] p-3">
                    <SelectValue placeholder="Encumbrances" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#ffffff] text-[#808195] bg-opacity-100">
                    <SelectItem value="encumbrance">
                      -- Encumbrances --
                    </SelectItem>
                    <SelectItem value="Mortgage">Mortgage</SelectItem>
                    <SelectItem value="Caveat">Caveat</SelectItem>
                    <SelectItem value="Caution">Caution</SelectItem>
                    <SelectItem value="Charge">Charge</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <input
              {...register("landRateBalance", {
                required: " This is required ",
              })}
              type="text"
              className="p-3 rounded-lg border-2 border-[#218B53] bg-[#A5A5A520] w-full outline-none m-1"
              placeholder="Land Rate Balances"
            />
          </span>
          <span className="flex mb-[30px]">
            <input
              {...register("propertyGeocoordinates", {
                required: " This is required ",
              })}
              type="text"
              className="p-3 rounded-lg border-2 border-[#218B53] bg-[#A5A5A520] w-full outline-none m-1"
              placeholder="Property Geo Coordinates"
            />

            
          </span>
          <div className="flex mb-[30px]">
            <article className="m-1 p-2 border-2 border-[#218B53] flex flex-col items-center justify-around w-full rounded-md text-center ">
              <h4 className="text-[#218B53] ">
                Attach coloured copy of title deed in PDF
              </h4>

              <input
                {...register("propertyTitleDeed", {
                  required: " This is required ",
                })}
                type="file"
                id="myfile"
                className="bg-[#FB774A] text-white p-2 rounded-lg w-[300px]"
                name="propertyTitleDeed"
              />
            </article>
            <article className="m-1 p-2 border-2 border-[#218B53] flex flex-col items-center justify-around w-full rounded-md text-center ">
              <h4 className="text-[#218B53]">
                Upload Property Image File Here
              </h4>

              <input
                {...register("propertyImage", {
                  required: " This is required ",
                })}
                type="file"
                id="myfile"
                className="bg-[#FB774A] text-white p-2 rounded-lg w-[300px]"
                name="propertyImage"
              />
            </article>
          </div>
          <article className="flex mb-[30px] justify-between my-5">
            <div>
              <h4>Property will be listed on:</h4>
              <h3 className="text-[#218B53] text-lg">
                Tuesday - 2022 30 August
              </h3>
            </div>
            <div>
              <button className=" py-3 px-5 w-[200px] bg-[#218B531A]  text-[#218B53] rounded-lg hover:font-semibold mx-1">
                cancel
              </button>
              <button className=" py-3 px-5 w-[200px] bg-[#218B531A]  bg-[#218B53] text-white rounded-lg hover:font-semibold mx-1">
                publish
              </button>
            </div>
          </article>
        </form>
      </main>
  )
}

export default AddMedicalRecord