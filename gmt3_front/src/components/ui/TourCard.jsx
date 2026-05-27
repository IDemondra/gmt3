import { Card } from './Card.jsx';
import { img } from '../../utils/images.js';

export function TourCard({ image, badge, date, title, description }) {
  return (
    <Card>
      <div class="h-64 w-full bg-cover bg-center relative overflow-hidden" style={`background-image: url('${img(image)}')`}>
        <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
        <div class="absolute top-4 left-4 bg-primary-container text-on-primary font-label-caps text-label-caps px-3 py-1.5 rounded-lg shadow-lg">
          {badge}
        </div>
      </div>
      <div class="p-6 flex-grow flex flex-col">
        <div class="flex items-center gap-2 text-secondary font-label-caps text-label-caps mb-3">
          <span class="material-symbols-outlined text-sm text-primary">calendar_month</span>
          {date}
        </div>
        <h3 class="font-h3 text-h3 text-primary mb-4 uppercase font-bold leading-tight">{title}</h3>
        <p class="font-body-md text-body-md text-on-background mb-6 flex-grow leading-relaxed">
          {description}
        </p>
        <button class="w-full font-button text-button bg-primary text-on-primary px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-center mt-auto hover:scale-[1.02] active:scale-95 font-bold tracking-wider">
          EN SAVOIR PLUS
        </button>
      </div>
    </Card>
  );
}