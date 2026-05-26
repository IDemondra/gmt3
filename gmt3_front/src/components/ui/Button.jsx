import { clsx } from 'clsx';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'font-button text-sm font-medium rounded-lg transition-all duration-300';

  const variants = {
    primary: 'bg-on-primary text-primary hover:shadow-lg',
    container: 'bg-primary-container text-on-primary hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-on-primary',
  };

  const variantStyles = variants[variant] || variants.primary;

  return (
    <button
      class={clsx(baseStyles, variantStyles, className, 'px-6 py-3')}
      {...props}
    >
      {children}
    </button>
  );
}