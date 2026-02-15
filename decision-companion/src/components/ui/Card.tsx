import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
    // Use a default style ONLY if no background/border classes are provided in className
    // However, simpler to just rely on the parent checking or just use a sensible default that is easily overridden.
    // We'll remove specific colors and border colors from base, letting them be passed in or default to white/gray if nothing passed.
    // Actually, to preserve backward compat with other cards, we can check if className contains 'bg-', but that's messy.
    // Better approach: Make the base style lighter/neutral or explicitly allow the passed className to win by placing it last (which we do).
    // The issue is likely CSS specificity or order. We'll use clsx-like logic by just not forcing bg-white if distinct style is needed.

    // Let's make it accept "variant" or just strip the hardcoded colors.
    // For this project, we want 'bg-white' to be decomposable.

    const defaultStyles = "rounded-xl shadow-sm border overflow-hidden";
    // If className has bg-, assume it overrides. Otherwise default to bg-white.
    const hasBg = className.includes('bg-');
    const hasBorder = className.includes('border-');

    const baseBg = hasBg ? '' : 'bg-white';
    const baseBorder = hasBorder ? '' : 'border-gray-200';

    return (
        <div className={`${defaultStyles} ${baseBg} ${baseBorder} ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
    return <div className={`px-6 py-4 border-b border-gray-100/10 ${className}`} {...props}>{children}</div>;
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', children, ...props }) => {
    return <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>{children}</h3>;
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
    return <div className={`p-6 ${className}`} {...props}>{children}</div>;
};
