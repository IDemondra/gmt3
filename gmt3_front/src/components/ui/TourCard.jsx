import { Button } from './Button.jsx';
import { Card } from './Card.jsx';
import { img } from '../../utils/images.js';

export function TourCard({ image, badge, date, title, description }) {
  return (
    <Card>
      <div class="h-64 w-full bg-cover bg-center relative" style={`background-image: url('${img(image)}')`}>
        <div class="absolute top-4 left-4 bg-primary-container text-on-primary font-label-caps text-label-caps px-3 py-1 rounded">
          {badge}
        </div>
      </div>
      <div class="p-6 flex-grow flex flex-col">
        <div class="text-secondary font-label-caps text-label-caps mb-2">{date}</div>
        <h3 class="font-h3 text-h3 text-primary-container mb-4 uppercase">{title}</h3>
        <p class="font-body-md text-body-md text-on-background mb-6 flex-grow">
          {description}
        </p>
        <button class="w-full font-button text-button bg-primary-container text-on-primary px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300 text-center mt-auto">
          EN SAVOIR PLUS
        </button>
      </div>
    </Card>
  );
}