"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Partner from "../components/Partner";
import TokenForm from "../components/PartnerForm";
// import Account from "../components/Account";

export default function Page() {

  const searchParams = useSearchParams();
  const approved = searchParams.get("approved");

  

  return (
    <>
     
        <TokenForm />
      
      {/* <Account /> */}
    </>
  );
}
