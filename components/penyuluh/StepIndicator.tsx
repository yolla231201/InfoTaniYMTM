interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export default function StepIndicator({ currentStep, totalSteps = 3 }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full mb-6">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={stepNum} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold transition-all duration-300
                ${isCompleted ? "bg-[#5CB85C] text-white" : ""}
                ${isActive ? "bg-[#5CB85C] text-white ring-4 ring-[#5CB85C]/20" : ""}
                ${!isCompleted && !isActive ? "bg-gray-200 text-gray-500" : ""}
              `}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNum
              )}
            </div>

            {/* Line connector */}
            {stepNum < totalSteps && (
              <div className="flex-1 h-[2px] mx-1">
                <div
                  className={`h-full transition-all duration-500 ${
                    stepNum < currentStep ? "bg-[#5CB85C]" : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}