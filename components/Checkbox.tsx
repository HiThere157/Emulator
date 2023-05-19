import { BsCheckLg } from "react-icons/bs";

type CheckboxProps = {
  checked: boolean | undefined;
  label?: string;
  disabled?: boolean;
  onChange: (checked: boolean) => any;
};
export default function Checkbox({ checked, label, disabled, onChange }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2.5">
      {label && (
        <span className="font-bold" onClick={() => !disabled && onChange(!checked)}>
          {label}
        </span>
      )}
      <label
        className={
          "ctrl-flat h-6 w-6 rounded p-1 " + (disabled ? "pointer-events-none opacity-50" : "")
        }
      >
        {checked && <BsCheckLg className="m-0 scale-150 text-blueColor" />}
        <input
          type="checkbox"
          className="appearance-none"
          checked={checked}
          onChange={() => onChange(!checked)}
          disabled={disabled}
        />
      </label>
    </div>
  );
}
