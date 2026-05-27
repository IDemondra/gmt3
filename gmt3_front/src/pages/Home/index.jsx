import { Reveal } from '../../components/ui/Reveal.jsx';
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
			<Reveal animation="fadeUp"><ActivitiesSection /></Reveal>
			<Reveal animation="fadeLeft"><DestinationsSection /></Reveal>
			<Reveal animation="fadeUp"><ToursSection /></Reveal>
			<Reveal animation="fadeRight"><AboutSection /></Reveal>
			<Reveal animation="fadeUp"><OffersSection /></Reveal>
			<Reveal animation="scaleUp"><GallerySection /></Reveal>
			<Reveal animation="fadeUp"><BannerSection /></Reveal>
			<Reveal animation="fadeUp"><ContactSection /></Reveal>
			<Footer />
		</div>
	);
}
