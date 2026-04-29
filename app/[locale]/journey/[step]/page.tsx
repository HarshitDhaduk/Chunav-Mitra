import { notFound } from "next/navigation";
import { StepCard } from "@/components/journey/StepCard";

const TOTAL_STEPS = 9;

export function generateStaticParams() {
  return Array.from({ length: TOTAL_STEPS }, (_, i) => ({ step: String(i + 1) }));
}

export default async function StepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  const stepNumber = parseInt(step, 10);

  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > TOTAL_STEPS) notFound();

  return <StepCard stepNumber={stepNumber} totalSteps={TOTAL_STEPS} />;
}
