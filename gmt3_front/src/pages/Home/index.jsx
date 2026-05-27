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
			<Reveal animation="fadeUp" duration={1050}><ActivitiesSection /></Reveal>
			<Reveal animation="driftLeft" duration={1150}><DestinationsSection /></Reveal>
			<Reveal animation="fadeUp" duration={1050}><ToursSection /></Reveal>
			<Reveal animation="driftRight" duration={1150}><AboutSection /></Reveal>
			<Reveal animation="arc" duration={1200}><OffersSection /></Reveal>
			<Reveal animation="scaleUp" duration={1250}><GallerySection /></Reveal>
			<Reveal animation="fadeUp" duration={1050}><BannerSection /></Reveal>
			<Reveal animation="fadeUp" duration={1050}><ContactSection /></Reveal>
			<Footer />
		</div>
	);
}
