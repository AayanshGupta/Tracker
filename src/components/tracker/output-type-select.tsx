"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PRESET_OUTPUT_TYPES = [
  "Dashboard",
  "Excel Sheet",
  "Report",
  "Data Extraction",
  "Posthog",
  "Others",
];

export function OutputTypeSelect() {
  const [selected, setSelected] = useState("Dashboard");

  return (
    <div className="space-y-2">
      <Label htmlFor="outputType" className="font-medium">
        Type of Output <span className="text-destructive">*</span>
      </Label>
      <select
        id="outputType"
        name="outputType"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        required
      >
        {PRESET_OUTPUT_TYPES.map((type) => (
          <option key={type} value={type === "Others" ? "" : type}>
            {type}
          </option>
        ))}
      </select>

      {selected === "" && (
        <div className="mt-2">
          <Input
            id="outputTypeCustom"
            name="outputType"
            required
            placeholder="Specify output type…"
            className="h-11"
            maxLength={80}
          />
        </div>
      )}
    </div>
  );
}
