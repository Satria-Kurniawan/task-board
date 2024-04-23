import { Props } from "./type";

export default function TextInput(props: Props) {
  return (
    <div>
      <input {...props} className="py-2 px-4 rounded-xl bg-lightGlass w-full" />
    </div>
  );
}
