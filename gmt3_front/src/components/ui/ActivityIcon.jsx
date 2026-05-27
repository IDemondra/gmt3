export function ActivityIcon({ icon, label }) {
  return (
    <div class="flex flex-col items-center group cursor-pointer">
      <div class="w-24 h-24 rounded-2xl bg-on-secondary-fixed flex items-center justify-center group-hover:bg-primary group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:-translate-y-1">
        <span class="material-symbols-outlined text-4xl text-primary group-hover:text-on-primary transition-colors duration-300">{icon}</span>
      </div>
      <h4 class="mt-6 font-h3 text-h3 text-on-background text-base uppercase text-center group-hover:text-primary transition-colors duration-300 font-bold">
        {label}
      </h4>
    </div>
  );
}