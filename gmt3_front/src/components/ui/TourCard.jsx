import { Card } from './Card.jsx';
import { BlurBackgroundImage } from './BlurBackgroundImage.jsx';
import { img } from '../../utils/images.js';

const INLINE_MD = /(\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_)/g;
function InlineMd({ text }) {
	const occ = new Map();
	return String(text || '').split(INLINE_MD).map((part, idx) => {
		const c = occ.get(part) || 0;
		occ.set(part, c + 1);
		const key = `${idx}-${c}`;
		if (part.startsWith('**') && part.endsWith('**')) return <strong key={key}>{part.slice(2, -2)}</strong>;
		if (part.startsWith('__') && part.endsWith('__')) return <strong key={key}>{part.slice(2, -2)}</strong>;
		if (part.startsWith('~~') && part.endsWith('~~')) return <del key={key}>{part.slice(2, -2)}</del>;
		if (part.startsWith('*') && part.endsWith('*')) return <em key={key}>{part.slice(1, -1)}</em>;
		if (part.startsWith('_') && part.endsWith('_')) return <em key={key}>{part.slice(1, -1)}</em>;
		return <span key={key}>{part}</span>;
	});
}

export function TourCard({ image, badge, date, title, description, location, eventType, eventTypeIcon = 'category', href }) {
  return (
    <Card className="group h-full min-h-[36rem] overflow-hidden border border-outline-variant/70 bg-white/90">
      <div class="relative aspect-[4/5] min-h-[24rem] w-full overflow-hidden sm:aspect-[16/11] lg:min-h-[28rem]">
        <BlurBackgroundImage src={img(image)} class="absolute inset-0 group-hover:scale-[1.06]" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
        <div class="absolute inset-x-0 top-0 p-4 sm:p-5">
          <div class="flex max-w-full flex-wrap items-center gap-2">
            <span class="max-w-full truncate rounded-full bg-white/18 px-3 py-1.5 font-label-caps text-label-caps text-on-primary border border-white/15 shadow-md shadow-black/10">
              {badge}
            </span>
          </div>
        </div>
        <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
          <div class="space-y-4">
            <div class="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-1.5 font-label-caps text-label-caps text-on-primary/85">
              <span class="material-symbols-outlined text-[18px] text-primary-container shrink-0">calendar_month</span>
              <span class="truncate">{date}</span>
            </div>
            {(location || eventType) && (
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {location && (
                  <div class="flex min-w-0 items-center gap-2 rounded-xl border border-white/12 bg-black/20 px-3 py-2.5 text-on-primary/85 backdrop-blur-sm">
                    <span class="material-symbols-outlined shrink-0 text-[18px] text-primary-container" aria-hidden="true">location_on</span>
                    <span class="truncate font-label-caps text-[11px] font-semibold leading-tight tracking-[0.04em] sm:text-xs" title={location}>{location}</span>
                  </div>
                )}
                {eventType && (
                  <div class="flex min-w-0 items-center gap-2 rounded-xl border border-white/12 bg-black/20 px-3 py-2.5 text-on-primary/85 backdrop-blur-sm">
                    <span class="material-symbols-outlined shrink-0 text-[18px] text-primary-container" aria-hidden="true">{eventTypeIcon}</span>
                    <span class="truncate font-label-caps text-[11px] font-semibold leading-tight tracking-[0.04em] sm:text-xs" title={eventType}>{eventType}</span>
                  </div>
                )}
              </div>
            )}
            <div class="space-y-3">
              <h3 class="clamp-2 font-h3 text-h3 text-on-primary uppercase font-black leading-tight tracking-tight">
                {title}
              </h3>
              <p class="clamp-3 font-body-md text-body-md text-on-primary/82 leading-relaxed max-w-md whitespace-pre-line">
                <InlineMd text={description} />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-grow flex-col p-4 sm:p-5 lg:p-6">
        <div class="mt-auto flex flex-col items-start gap-4 sm:items-start">
          {href ? (
            <a
              class="inline-flex items-center justify-center gap-2 self-start whitespace-nowrap rounded-2xl bg-primary px-5 py-3 font-button text-button text-on-primary transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
              href={href}
            >
              EN SAVOIR PLUS
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          ) : (
            <button type="button" class="inline-flex items-center justify-center gap-2 self-start whitespace-nowrap rounded-2xl bg-primary px-5 py-3 font-button text-button text-on-primary transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 cursor-pointer">
              EN SAVOIR PLUS
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
