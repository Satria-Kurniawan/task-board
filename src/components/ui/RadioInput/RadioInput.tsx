import { RadioInputProps } from "./type";

export default function RadioInput({
  label,
  checked = false,
  onClick,
}: RadioInputProps) {
  return (
    <div className="flex items-center gap-x-2">
      <div
        className="rounded-full w-4 h-4 flex justify-center items-center border border-primary cursor-pointer"
        onClick={onClick}
      >
        <div
          className={`rounded-full w-2.5 h-2.5 ${checked ? "bg-primary" : ""}`}
        />
      </div>
      <label className="text-sm">{label}</label>
    </div>
  );
}
