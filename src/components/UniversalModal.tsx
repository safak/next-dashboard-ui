import React from 'react';

interface UniversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Optional title
  children: React.ReactNode; // Main content
  footerContent?: React.ReactNode; // Optional footer for buttons
  maxWidth?: string; // Optional max width class (e.g., 'max-w-lg', 'max-w-xl')
}

const UniversalModal: React.FC<UniversalModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
  maxWidth = 'max-w-md', // Default max width
}) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm transition-opacity duration-300 ease-in-out'
      onClick={onClose} // Close on overlay click
      role='dialog'
      aria-modal='true'
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Stop propagation to prevent closing when clicking inside the modal content */}
      <div
        className={`bg-popover text-popover-foreground p-6 rounded-lg shadow-xl ${maxWidth} w-full relative max-h-[90vh] overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out transform scale-95 opacity-0 animate-modal-enter`}
        onClick={(e) => e.stopPropagation()} // Prevent overlay click handler
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-accent-hover'
          aria-label='Close modal'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>

        {/* Optional Title */}
        {title && (
          <h2 id='modal-title' className='text-lg font-semibold mb-4'>
            {title}
          </h2>
        )}

        {/* Main Content Area */}
        <div className='flex-grow mb-6'>
          {' '}
          {/* flex-grow allows content to take available space */}
          {children}
        </div>

        {/* Optional Footer */}
        {footerContent && (
          <div className='mt-auto pt-4 border-t flex justify-end gap-3'>{footerContent}</div>
        )}
      </div>
      {/* Add keyframes for animation in globals.css if needed */}
      <style jsx global>{`
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-enter {
          animation: modal-enter 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UniversalModal;
