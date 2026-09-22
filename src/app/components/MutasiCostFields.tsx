import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertTriangle } from "lucide-react";
import { cn } from "./ui/utils";

interface MutasiFieldProps {
  label: string;
  value: string;
  basePrice?: number;
  hargaDasar?: number;
  name?: string;
  onChange: (value: string) => void;
}

export function MutasiCostField({ label, value, basePrice, hargaDasar, onChange }: MutasiFieldProps) {
  const safeBasePrice = basePrice || hargaDasar || 0;
  const safeValue = value || "";
  const exceeds = parseFloat(safeValue || "0") > safeBasePrice;
  const difference = exceeds ? parseFloat(safeValue) - safeBasePrice : 0;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs flex flex-col gap-0.5 text-gray-700">
        {label}
        <span className="text-[10px] text-gray-500 font-normal">
          Harga Dasar: Rp {safeBasePrice.toLocaleString('id-ID')}
        </span>
      </Label>
      <Input
        type="number"
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "bg-white h-9 text-sm text-gray-900",
          exceeds
            ? "border-red-500 border-2 focus-visible:ring-red-500 bg-red-50"
            : "border-gray-300"
        )}
        placeholder="0"
      />
      {exceeds && (
        <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          Melebihi Rp {difference.toLocaleString('id-ID')}
        </p>
      )}
    </div>
  );
}
