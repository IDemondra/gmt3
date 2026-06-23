import { HeroSection } from './components/HeroSection.jsx';
import { ActivitiesSection } from './components/ActivitiesSection.jsx';
import { DestinationsSection } from './components/DestinationsSection.jsx';
import { ToursSection } from './components/ToursSection.jsx';
import { AboutSection } from './components/AboutSection.jsx';
import { GallerySection } from './components/GallerySection.jsx';
import { ContactSection } from './components/ContactSection.jsx';
import { Footer } from '../../components/Footer.jsx';

export function Home() {
	return (
		<div class="home">
			<HeroSection />
			<ActivitiesSection />
			<DestinationsSection />
			<ToursSection />
			<AboutSection />
			<GallerySection />
			<ContactSection />
			<Footer />
		</div>
	);
}
