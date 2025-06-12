'use client';

import { useState, useEffect, useRef, FC } from 'react';
import CustomIcon from './CustomIcon';
import { Option } from '@/types';

interface StatusProps {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
}

const Status: FC<StatusProps> = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(selected);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentStatus(selected);
  }, [selected]);

  const handleStatusChange = (option: Option) => {
    setCurrentStatus(option.value);
    onChange(option.value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === currentStatus);

  return (
    <div ref={dropdownRef} className='relative inline-block text-left'>
      <div>
        <button
          type='button'
          className='inline-flex w-full justify-center gap-x-1.5 rounded-full px-1.5 py-0.5 text-xs font-semibold shadow-sm ring-current ring-[0.3px] focus:outline-none hover:shadow-inner'
          onClick={toggleDropdown}
          aria-haspopup='true'
          aria-expanded={isOpen}
        >
          {selectedOption && (
            <div className='flex items-center gap-2'>
              <CustomIcon
                name={{ category: 'status', icon: selectedOption.icon }}
                className={`${selectedOption.color} w-3 h-3`}
              />
              <span className={selectedOption.color}>{selectedOption.label}</span>
            </div>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className='absolute z-10 mt-1 w-auto origin-top-right rounded-md bg-lightBgColor dark:bg-darkBgColor shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
          role='menu'
          aria-orientation='vertical'
          aria-labelledby='options-menu' // Assuming the button acts as the label, though ideally it would have an id
        >
          <div className='py-1' role='none'>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option)}
                className='block w-full px-2 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700'
                role='menuitem'
              >
                <div className='flex items-center gap-2'>
                  <CustomIcon
                    name={{ category: 'status', icon: option.icon }}
                    className={`${option.color} w-3 h-3`} // Removed extra space before w-3
                  />
                  <span className={option.color}>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
