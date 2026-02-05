import React from 'react';
import { DropdownOption } from '../types';

interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, options, onChange, placeholder = '선택하세요' }) => {
  return (
    <div className="mb-4 sm:mb-5">
      <label className="block text-xs sm:text-sm md:text-base font-bold text-amber-300 mb-2 sm:mb-3"
             style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base
                   bg-black/80
                   border-2 border-amber-600/40
                   rounded-lg
                   text-amber-200 font-semibold
                   focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                   cursor-pointer
                   shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                   hover:shadow-[0_4px_12px_rgba(251,191,36,0.3)]
                   transition-all duration-200"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
