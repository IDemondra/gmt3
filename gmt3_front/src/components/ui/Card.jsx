export function Card({ children, className }) {
  return (
    <div class={`bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/8 border border-white/20 group ${className || ''}`}>
      {children}
    </div>
  );
}
