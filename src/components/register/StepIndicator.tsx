import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex justify-center -mt-4 space-x-2">
      {steps.map((step) => (
        <div
          key={step}
          className={`rounded-full transition-all duration-300 ${
            currentStep === step
              ? "bg-black w-3 h-3 relative -top-0.5"
              : "bg-gray-300 w-2 h-2"
          }`}
        />
      ))}
    </div>
  );
};
