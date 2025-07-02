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

// Sayısal klavye bileşeni - dokunmatik arayüz için optimize edilmiş
export const NumericPad: React.FC<NumericPadProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  maxLength = 6
}) => {
  // Rakam tuşuna basma
  const handleNumberPress = (number: string) => {
    if (disabled || value.length >= maxLength) return;
    
    const newValue = value + number;
    onChange(newValue);
  };

  // Silme işlemi
  const handleDelete = () => {
    if (disabled || value.length === 0) return;
    
    const newValue = value.slice(0, -1);
    onChange(newValue);
  };

  // Tüm değeri temizle
  const handleClear = () => {
    if (disabled) return;
    onChange('');
  };

  // Cevabı gönder
  const handleSubmit = () => {
    if (disabled || value.length === 0) return;
    onSubmit();
  };

  // Tuş animasyon varyantları
  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  };

  // Rakam tuşları (0-9)
  const renderNumberButton = (number: string) => (
    <motion.button
      key={number}
      variants={buttonVariants}
      whileTap="tap"
      whileHover="hover"
      onClick={() => handleNumberPress(number)}
      disabled={disabled}
      className={`
        h-16 w-16 sm:h-18 sm:w-18 rounded-2xl font-bold text-xl sm:text-2xl
        bg-white dark:bg-gray-800 text-gray-800 dark:text-white
        border-2 border-gray-200 dark:border-gray-600
        shadow-lg hover:shadow-xl transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:transform active:scale-95
        ${!disabled ? 'hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900' : ''}
      `}
      aria-label={`Rakam ${number}`}
    >
      {number}
    </motion.button>
  );

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Değer görüntüleme alanı */}
      <div className="mb-6">
        <div className={`
          h-16 px-6 rounded-2xl border-2 border-dashed
          ${value.length > 0 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' 
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
          }
          flex items-center justify-center transition-all duration-200
        `}>
          <span className={`
            text-2xl sm:text-3xl font-bold tracking-wider
            ${value.length > 0 
              ? 'text-primary-700 dark:text-primary-300' 
              : 'text-gray-400 dark:text-gray-500'
            }
          `}>
            {value || '?'}
          </span>
        </div>
      </div>

      {/* Rakam tuş takımı */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* İlk sıra: 7, 8, 9 */}
        {['7', '8', '9'].map(renderNumberButton)}
        
        {/* İkinci sıra: 4, 5, 6 */}
        {['4', '5', '6'].map(renderNumberButton)}
        
        {/* Üçüncü sıra: 1, 2, 3 */}
        {['1', '2', '3'].map(renderNumberButton)}
        
        {/* Son sıra: Temizle, 0, Sil */}
        <motion.button
          variants={buttonVariants}
          whileTap="tap"
          whileHover="hover"
          onClick={handleClear}
          disabled={disabled || value.length === 0}
          className={`
            h-16 w-16 sm:h-18 sm:w-18 rounded-2xl font-bold text-lg
            bg-warning text-white border-2 border-warning
            shadow-lg hover:shadow-xl transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            active:transform active:scale-95
          `}
          aria-label="Temizle"
        >
          C
        </motion.button>
        
        {renderNumberButton('0')}
        
        <motion.button
          variants={buttonVariants}
          whileTap="tap"
          whileHover="hover"
          onClick={handleDelete}
          disabled={disabled || value.length === 0}
          className={`
            h-16 w-16 sm:h-18 sm:w-18 rounded-2xl font-bold
            bg-danger text-white border-2 border-danger
            shadow-lg hover:shadow-xl transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            active:transform active:scale-95
            flex items-center justify-center
          `}
          aria-label="Son rakamı sil"
        >
          <Delete size={20} />
        </motion.button>
      </div>

      {/* Gönder butonu */}
      <motion.button
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        onClick={handleSubmit}
        disabled={disabled || value.length === 0}
        className={`
          w-full h-16 rounded-2xl font-bold text-xl
          bg-gradient-to-r from-primary-500 to-primary-600
          text-white border-2 border-primary-500
          shadow-lg hover:shadow-xl transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:from-gray-400 disabled:to-gray-500
          active:transform active:scale-95
          flex items-center justify-center gap-3
          ${!disabled && value.length > 0 ? 'hover:from-primary-600 hover:to-primary-700' : ''}
        `}
        aria-label="Cevabı gönder"
      >
        <Check size={24} />
        <span>Cevapla</span>
      </motion.button>
    </div>
  );
};