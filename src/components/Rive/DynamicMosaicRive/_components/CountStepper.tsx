import { Minus, Plus } from "lucide-react";

interface CountStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const CountStepper = ({
  value,
  min = 1,
  max = Infinity,
  onChange,
}: CountStepperProps) => {
  const increment = () => onChange(clamp(value + 1, min, max));
  const decrement = () => onChange(clamp(value - 1, min, max));

  return (
    <div className="inline-flex items-center gap-2 border border-border rounded-full px-3 py-1.5 shadow-sm">
      <button
        type="button"
        aria-label="Decrease"
        onClick={decrement}
        disabled={value <= min}
        className="flex h-8 w-8 items-center justify-center rounded-full
                   text-muted-foreground hover:bg-muted
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus size={16} />
      </button>

      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value || 0), min, max))}
        className="w-12 text-center text-heading font-medium
                   bg-transparent outline-none
                   [appearance:textfield]
                   [&::-webkit-outer-spin-button]:appearance-none
                   [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        type="button"
        aria-label="Increase"
        onClick={increment}
        disabled={value >= max}
        className="flex h-8 w-8 items-center justify-center rounded-full
                   text-muted-foreground hover:bg-muted
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
