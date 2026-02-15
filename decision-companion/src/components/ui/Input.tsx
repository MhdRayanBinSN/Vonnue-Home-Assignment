import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    const hasBg = className.includes('bg-');
    const baseBg = hasBg ? '' : 'bg-white';

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-medium text-inherit opacity-80">{label}</label>}
            <input
                className={`border rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${baseBg} ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300/20'
                    } ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};
