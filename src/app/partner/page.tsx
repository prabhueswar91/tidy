"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Partner from "../components/Partner";
import TokenForm from "../components/PartnerForm";

export default function Page() {

  const searchParams = useSearchParams();
  const approved = searchParams.get("approved");

  const [showTokenForm, setShowTokenForm] = useState(false);
  const [isPreminum, setisPreminum] = useState((approved=="true" || approved=="false")?true:false);

  return (
    <>
      {!showTokenForm && !isPreminum ? (
        <Partner onContinue={() => setShowTokenForm(true)} />
      ) : (
        <TokenForm />
      )}
    </>
  );
}
