import { useState } from "react";
import type { ReactNode } from "react";
import type { OnLocalCartUpdate, CartStateData } from "../../../../types";

export interface RadioOption<T extends string = string> {
  value: T;
  label: ReactNode;
}

// Cart settings patch the local cart; non-cart settings (e.g. the express scenario) use onChange
type RadioSettingProps<T extends string> = {
  name: string;
  options: RadioOption<T>[];
} & (
  | {
      onCartUpdate: OnLocalCartUpdate;
      toPatch: (value: T) => Partial<CartStateData>;
    }
  | { onChange: (value: T) => void }
);

function legendFromName(name: string): string {
  return name.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

export function RadioSetting<T extends string>(props: RadioSettingProps<T>) {
  const { name, options } = props;
  const [value, setValue] = useState<T>(options[0].value);

  const handleChange = (next: T) => {
    setValue(next);

    if ("onChange" in props) props.onChange(next);
    else props.onCartUpdate(props.toPatch(next));
  };

  return (
    <fieldset>
      <legend className="font-medium text-sm mb-1">
        {legendFromName(name)}
      </legend>
      <div className="flex flex-col gap-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
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
