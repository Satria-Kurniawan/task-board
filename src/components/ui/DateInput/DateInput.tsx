import { Props } from "./type";

export default function DateInput({ value, onChange }: Props) {
  return (
    <div className="sticky top-0 p-3 bg-white w-fit rounded-xl shadow-md flex items-center gap-x-4">
      <label htmlFor="dateInput" className="font-bold">
        Filter Tanggal
      </label>
      <input
        id="dateInput"
        type="date"
        value={value}
        onChange={onChange}
        className="py-1.5 px-4 rounded-xl"
      />
    </div>
  );
}
