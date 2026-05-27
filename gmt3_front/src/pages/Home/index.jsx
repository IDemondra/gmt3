import { HeroSection } from './components/HeroSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { DestinationsSection } from './components/DestinationsSection';
import { ToursSection } from './components/ToursSection';
import { AboutSection } from './components/AboutSection';
import { OffersSection } from './components/OffersSection';
import { GallerySection } from './components/GallerySection';
import { BannerSection } from './components/BannerSection';
import { ContactSection } from './components/ContactSection';
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
