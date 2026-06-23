import { HeroSection } from './components/HeroSection.jsx';
import { ActivitiesSection } from './components/ActivitiesSection.jsx';
import { DestinationsSection } from './components/DestinationsSection.jsx';
import { ToursSection } from './components/ToursSection.jsx';
import { AboutSection } from './components/AboutSection.jsx';
import { GallerySection } from './components/GallerySection.jsx';
import { TestimonialsSection } from './components/TestimonialsSection.jsx';
import { ContactSection } from './components/ContactSection.jsx';
import { Footer } from '../../components/Footer.jsx';
import { ScrollProgress } from '../../components/ui/ScrollProgress.jsx';

export function Home() {
	return (
		<div class="home">
			<ScrollProgress />
			<HeroSection />
			<ActivitiesSection />
			<DestinationsSection />
			<ToursSection />
			<AboutSection />
			<GallerySection />
			<TestimonialsSection />
			<ContactSection />
			<Footer />
		</div>
	);
}
