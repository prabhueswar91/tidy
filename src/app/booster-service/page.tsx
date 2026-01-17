"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import TidyLoader from "../components/TidyLoader";
import FirstPage from "./first-page";
import SecondPage from "./second-page";

export type Plan = {
  id: number;
  label: string;
  price: number;
};

export default function TelegramBoosterUI() {
  const [showBooster, setShowBooster] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isToggleOn, setIsToggleOn] = useState(true);

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Plan[]>([]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/points/active-subscriptions");
      if (res.data.success) {
        const plans: Plan[] = res.data.data || [];
        setList(plans);

        // default select first plan if none selected
        if (plans.length > 0 && selectedPlanId === null) {
          setSelectedPlanId(plans[0].id);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPlan = list.find((p) => p.id === selectedPlanId) || null;

  if (loading) return <TidyLoader />;

  return !showBooster ? (
    <FirstPage
      isToggleOn={isToggleOn}
      setIsToggleOn={setIsToggleOn}
      onContinue={() => setShowBooster(true)}
    />
  ) : (
    <SecondPage
      onClose={() => setShowBooster(false)}
      plans={list}
      selectedPlanId={selectedPlanId}
      setSelectedPlanId={setSelectedPlanId}
      expandedSection={expandedSection}
      setExpandedSection={setExpandedSection}
      selectedPlan={selectedPlan}
    />
  );
}
