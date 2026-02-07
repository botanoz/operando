import React from 'react';
import { motion } from 'framer-motion';
import { Delete, Check } from 'lucide-react';

interface NumericPadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  maxLength?: number;
}

export const NumericPad: React.FC<NumericPadProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  maxLength = 6
}) => {
  const handleNumberPress = (number: string) => {
    if (disabled || value.length >= maxLength) return;
    onChange(value + number);
  };

  const handleDelete = () => {
    if (disabled || value.length === 0) return;
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    onChange('');
  };

  const handleSubmit = () => {
    if (disabled || value.length === 0) return;
    onSubmit();
  };

  const btnBase = `
    rounded-xl font-bold text-lg
    bg-gray-800 text-white border border-gray-600
    active:scale-95 transition-all duration-100
    disabled:opacity-40 disabled:cursor-not-allowed
    flex items-center justify-center
  `;

  const renderNumberButton = (number: string) => (
    <motion.button
      key={number}
      whileTap={{ scale: 0.92 }}
      onClick={() => handleNumberPress(number)}
      disabled={disabled}
      className={`${btnBase} h-12`}
      aria-label={`Rakam ${number}`}
    >
      {number}
    </motion.button>
  );

  return (
    <div className="w-full">
      {/* Value display */}
      <div className="mb-2">
        <div className={`
          h-10 px-4 rounded-xl border-2 border-dashed
          ${value.length > 0
            ? 'border-primary-500 bg-primary-900/30'
            : 'border-gray-600 bg-gray-800/50'
          }
          flex items-center justify-center
        `}>
          <span className={`
            text-xl font-bold tracking-wider
            ${value.length > 0 ? 'text-primary-300' : 'text-gray-500'}
          `}>
            {value || '?'}
          </span>
        </div>
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-3 gap-1.5 mb-1.5">
        {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map(renderNumberButton)}

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleClear}
          disabled={disabled || value.length === 0}
          className={`${btnBase} h-12 bg-yellow-900/60 border-yellow-700 text-yellow-400`}
          aria-label="Temizle"
        >
          C
        </motion.button>

        {renderNumberButton('0')}

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleDelete}
          disabled={disabled || value.length === 0}
          className={`${btnBase} h-12 bg-red-900/60 border-red-700 text-red-400`}
          aria-label="Sil"
        >
          <Delete size={18} />
        </motion.button>
      </div>

      {/* Submit button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={disabled || value.length === 0}
        className={`
          w-full h-11 rounded-xl font-bold text-base
          bg-gradient-to-r from-primary-500 to-primary-600
          text-white border border-primary-500
          active:scale-95 transition-all duration-100
          disabled:opacity-40 disabled:cursor-not-allowed
          disabled:from-gray-600 disabled:to-gray-700
          flex items-center justify-center gap-2
        `}
        aria-label="Cevabi gonder"
      >
        <Check size={20} />
        <span>Cevapla</span>
      </motion.button>
    </div>
  );
};
