import * as React from 'react';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...props }, ref) => {
  return <input ref={ref} className={`h-10 w-full px-3 ${className}`} {...props} />;
});

Input.displayName = 'Input';