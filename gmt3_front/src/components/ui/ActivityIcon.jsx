export function ActivityIcon({ icon, label }) {
  return (
    <div class="flex flex-col items-center group cursor-pointer">
      <div class="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center shadow-[0_0_0_2px_#E31E24] hover:bg-primary transition-all duration-300">
        <span class="material-symbols-outlined text-4xl text-on-primary">{icon}</span>
      </div>
      <h4 class="mt-6 font-h3 text-h3 text-on-background text-base uppercase text-center group-hover:text-primary transition-colors">
        {label}
      </h4>
    </div>
  );
}