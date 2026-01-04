import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    // Primary style defined in index.css as .btn-primary
    // Adding secondary/danger variants inline or via classes if needed

    let variantClass = "btn-primary";

    if (variant === 'secondary') {
        variantClass = "bg-gray-800 hover:bg-gray-700 text-white font-bold uppercase tracking-widest px-6 py-3 rounded-lg border border-gray-700 transition-all active:scale-95";
    } else if (variant === 'danger') {
        variantClass = "bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900 font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all active:scale-95";
    }

    return (
        <button className={`${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
};
