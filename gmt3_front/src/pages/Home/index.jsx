import { Reveal } from '../../components/ui/Reveal.jsx';
import { HeroSection } from './components/HeroSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { DestinationsSection } from './components/DestinationsSection';
import { ToursSection } from './components/ToursSection';
import { AboutSection } from './components/AboutSection';
import { OffersSection } from './components/OffersSection';
import { GallerySection } from './components/GallerySection';
import { BannerSection } from './components/BannerSection';
import { Footer } from '../../components/Footer.jsx';
// NOTE: No changes needed here for the new page.

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
			<Footer />
		</div>
	);
}
