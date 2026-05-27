import { Card } from './Card.jsx';
import { img } from '../../utils/images.js';

export function TourCard({ image, badge, date, title, description, href }) {
  return (
    <Card className="group h-full min-h-[36rem] overflow-hidden border border-outline-variant/70 bg-white/90">
      <div class="relative aspect-[4/5] min-h-[24rem] w-full overflow-hidden sm:aspect-[16/11] lg:min-h-[28rem]">
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.06]" style={`background-image: url('${img(image)}')`} />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
        <div class="absolute inset-x-0 top-0 p-4 sm:p-5">
          <div class="flex max-w-full flex-wrap items-center gap-2">
            <span class="max-w-full truncate rounded-full bg-white/18 px-3 py-1.5 font-label-caps text-label-caps text-on-primary border border-white/15 shadow-md shadow-black/10">
              {badge}
            </span>
            <span class="max-w-full truncate rounded-full border border-white/15 bg-white/12 px-3 py-1.5 font-label-caps text-label-caps text-on-primary/85">
              {date}
            </span>
          </div>
        </div>
        <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
          <div class="space-y-4">
            <div class="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-1.5 font-label-caps text-label-caps text-on-primary/85">
              <span class="material-symbols-outlined text-[18px] text-primary-container shrink-0">calendar_month</span>
              <span class="truncate">{date}</span>
            </div>
            <div class="space-y-3">
              <h3 class="clamp-2 font-h3 text-h3 text-on-primary uppercase font-black leading-tight tracking-tight">
                {title}
              </h3>
              <p class="clamp-3 font-body-md text-body-md text-on-primary/82 leading-relaxed max-w-md">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-grow flex-col p-4 sm:p-5 lg:p-6">
        <div class="mt-auto flex flex-col items-start gap-4 sm:items-start">
          {href ? (
            <a
              class="inline-flex items-center justify-center gap-2 self-start whitespace-nowrap rounded-2xl bg-primary px-5 py-3 font-button text-button text-on-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              href={href}
            >
              EN SAVOIR PLUS
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          ) : (
            <button type="button" class="inline-flex items-center justify-center gap-2 self-start whitespace-nowrap rounded-2xl bg-primary px-5 py-3 font-button text-button text-on-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-95">
              EN SAVOIR PLUS
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
