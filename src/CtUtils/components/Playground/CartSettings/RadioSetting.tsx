import { useState } from "react";
import type { ReactNode } from "react";
import type { OnLocalCartUpdate, CartStateData } from "../../../../types";

export interface RadioOption<T extends string = string> {
  value: T;
  label: ReactNode;
}

interface RadioSettingProps<T extends string> {
  name: string;
  options: RadioOption<T>[];
  onCartUpdate: OnLocalCartUpdate;
  toPatch: (value: T) => Partial<CartStateData>;
}

function legendFromName(name: string): string {
  return name.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

export function RadioSetting<T extends string>({
  name,
  options,
  onCartUpdate,
  toPatch,
}: RadioSettingProps<T>) {
  const [value, setValue] = useState<T>(options[0].value);

  const handleChange = (next: T) => {
    setValue(next);
    onCartUpdate(toPatch(next));
  };

  return (
    <fieldset>
      <legend className="font-medium text-sm mb-1">{legendFromName(name)}</legend>
      <div className="flex flex-col gap-1">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              className="mr-2"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
