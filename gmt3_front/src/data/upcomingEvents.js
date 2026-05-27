export const upcomingEvents = [
	{
		slug: 'defi-des-tsingy',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp-WIeKr_a7VCmtcqnIFUlqRrFWsSSgE1Flw-1ab94TTrxSmlltLXWtOaqQ2_Uy3L_6BwllDGxshfnJ_emrhTdUrZKhnY8OOJ3shRHtfFn7Riop9OlCPRqMt2GSkToYX4pjlV8m-q78VdV6-rNYMckztRxBOwNF72FgxFsBC5S2nUjLVy6LD9ELFCWhvMYg-gQqnm4hRU_b5ofzaNe2VcAa_6yfhJtoUcFIsTEyRVko1hj2XtHVk_ocv5egThycNYJ3agjXgBrDaM',
		badge: 'EXTREME TREK',
		date: '15 - 22 OCTOBRE 2024',
		title: 'DÉFI DES TSINGY',
		description: 'Traversez les forêts de calcaire les plus abruptes de Madagascar lors d’une expédition exigeante pensée pour les marcheurs expérimentés.',
		price: '€1,200',
		location: 'Parc national des Tsingy de Bemaraha',
		duration: '8 jours',
		difficulty: 'Extrême',
		groupSize: '6 à 10 voyageurs',
		season: 'Saison sèche',
		highlights: [
			'Crêtes calcaires et canyons naturels',
			'Guides experts en terrain technique',
			'Bivouacs sous ciel dégagé',
		],
		itinerary: [
			'Jour 1-2: arrivée, briefing sécurité et approche du massif',
			'Jour 3-5: traversée des reliefs calcaires et exploration des gorges',
			'Jour 6-8: retour progressif, panoramas et clôture de l’expédition',
		],
	},
	{
		slug: 'suivi-des-lemuriens',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Tj3wID0H6VbGQcK05TnegTtu6Fa5S7CQiR1nRH3Vn2FgLbrg8G15VQOeSO0FSZqMIP9J6O7bP-yDHQMv3PNl0QvWwNprl4uEJxW7Wb8TGrFG-EGyEBO4pII2znSImeT7xn4RWAau2XtDNQcT7YDNMLU8_YANrCTImaKpb-Rp5285BIGTCUoUQBGbclD6Zcc9JkwzQfwNbUA_qp9W9FbiAhIxPzd5gGPWX-2JE-jW3vcfPqcdO9EKtdGFeZK_LaiOC6hQhRWpu94',
		badge: 'WILDLIFE',
		date: '02 - 05 NOVEMBRE 2024',
		title: 'SUIVI DES LÉMURIENS',
		description: 'Partez au cœur d’Andasibe pour observer des espèces rares dans leur habitat naturel et préservé.',
		price: '€450',
		location: 'Andasibe-Mantadia',
		duration: '4 jours',
		difficulty: 'Modéré',
		groupSize: '4 à 8 voyageurs',
		season: 'Toute l’année',
		highlights: [
			'Observation au lever du jour',
			'Biodiversité de forêt humide',
			'Approche respectueuse et discrète',
		],
		itinerary: [
			'Jour 1: installation et repérage des zones d’observation',
			'Jour 2-3: sorties guidées et lecture de traces',
			'Jour 4: session finale et départ',
		],
	},
	{
		slug: 'masterclass-coucher-de-soleil',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgYJTEHnnc--WHOQ2V2aJ0luE0SsWDUG_KvejUxd98vb4G0Cs179gmDf1YjKVOyDDFNn4y6kCuugQrMNPx5zNeqma25kEvobaTngOO0K9GG-eA1KsmUUdVXcEhEDNriKc3wtdPnL_jlQYaYh0-UPRTRBIavCwRWDg9s8sfnRfMTIlnLeAxcKrfReqf0ycC7VJY0EBGcrTPi9y8lGRP7mdmYdif7tk3IXMHUfKHgNazhIs9owP7e0q9mj6sU0-a3PIp4FoS2eXiYxQ',
		badge: 'PHOTOGRAPHY',
		date: '10 - 14 DÉCEMBRE 2024',
		title: 'MASTERCLASS COUCHER DE SOLEIL',
		description: 'Capturez l’avenue des Baobabs sous une lumière spectaculaire avec l’accompagnement de photographes reconnus.',
		price: '€800',
		location: 'Avenue des Baobabs',
		duration: '5 jours',
		difficulty: 'Accessible',
		groupSize: '8 à 12 voyageurs',
		season: 'Fin d’année',
		highlights: [
			'Sessions photo au golden hour',
			'Ateliers de composition sur site',
			'Relecture critique des images',
		],
		itinerary: [
			'Jour 1: installation et réglages de base',
			'Jour 2-4: prises de vue guidées et masterclass',
			'Jour 5: sélection finale et conseils de post-production',
		],
	},
];

export function getUpcomingEventBySlug(slug) {
	return upcomingEvents.find((event) => event.slug === slug);
}
