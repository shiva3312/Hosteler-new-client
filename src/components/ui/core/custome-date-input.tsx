//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import React from 'react';

interface DateInputProps {
  value: string | null;
  onChange: (date: string | null) => void;
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
}

export const CustomDateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  id,
  name,
  label,
  required,
}) => {
  const inputId = id || name;

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="date"
        id={inputId}
        name={name}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          // Send the value as "YYYY-MM-DD" or null
          onChange(val || null);
        }}
      />
    </div>
  );
};
