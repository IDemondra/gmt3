export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'font-button text-sm font-bold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95',
    container: 'bg-primary-container text-on-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-on-primary hover:scale-[1.02] active:scale-95',
    ghost: 'text-primary hover:bg-primary/10 hover:scale-[1.02] active:scale-95',
  };

  const variantStyles = variants[variant] || variants.primary;

  return (
    <button
      class={`${baseStyles} ${variantStyles} px-6 py-3 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}