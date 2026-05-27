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
			<Reveal animation="fadeUp" duration={720}><ActivitiesSection /></Reveal>
			<Reveal animation="driftLeft" duration={760}><DestinationsSection /></Reveal>
			<Reveal animation="fadeUp" duration={720}><ToursSection /></Reveal>
			<Reveal animation="driftRight" duration={760}><AboutSection /></Reveal>
			<Reveal animation="arc" duration={800}><OffersSection /></Reveal>
			<Reveal animation="scaleUp" duration={820}><GallerySection /></Reveal>
			<Reveal animation="fadeUp" duration={720}><BannerSection /></Reveal>
			<Reveal animation="fadeUp" duration={720}><ContactSection /></Reveal>
			<Footer />
		</div>
	);
}
