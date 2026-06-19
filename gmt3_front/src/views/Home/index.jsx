import { HeroSection } from './components/HeroSection.jsx';
import { ActivitiesSection } from './components/ActivitiesSection.jsx';
import { DestinationsSection } from './components/DestinationsSection.jsx';
import { ToursSection } from './components/ToursSection.jsx';
import { AboutSection } from './components/AboutSection.jsx';
import { OffersSection } from './components/OffersSection.jsx';
import { GallerySection } from './components/GallerySection.jsx';
import { BannerSection } from './components/BannerSection.jsx';
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
			<OffersSection />
			<GallerySection />
			<BannerSection />
			<ContactSection />
			<Footer />
		</div>
	);
}
