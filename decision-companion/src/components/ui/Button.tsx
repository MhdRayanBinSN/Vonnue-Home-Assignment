import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
    const base = "px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm border border-transparent",
        secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/20 focus:ring-white/50 backdrop-blur-sm",
        danger: "bg-red-600/90 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm border border-transparent",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`} {...props} />
    );
};
