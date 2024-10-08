"use client";

import { CaretCircleRight } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

const DashboardHero = () => {

  return (
    <main className="bg-dash-hero-bg bg-cover text-white p-4 m-3 h-[250px] flex flex-col justify-around rounded-xl font-DM">
      <span>
        <h2 className="font-bold my-2 text-lg">
          Dear Patient
        </h2>
        <h4 className="font-bold text-3xl ">Welcome to MaishaCare </h4>
        <h2 className="font-bold m-2 text-lg">
          Engine of transparency Anchor of trust
        </h2>
      </span>
      <Link
        href="/"
        className="bg-black rounded-full flex py-2 px-4 items-center font-semibold w-[300px] justify-between"
      >
        Easy Medicare
        <CaretCircleRight
          size={36}
          color="#fafafa"
          weight="bold"
          className="bg-[#218B53] rounded-full"
        />
      </Link>
    </main>
  );
};

export default DashboardHero;
