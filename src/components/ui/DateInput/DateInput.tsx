import React from "react";

interface DateFilterInputProps {
  onChange: (date: string) => void;
}

const DateInput: React.FC<DateFilterInputProps> = ({ onChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChange(value);
  };

  return <input type="date" onChange={handleInputChange} />;
};

export default DateInput;
