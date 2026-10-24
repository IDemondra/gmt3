export function Conditions() {
	return (
		<section class="flex flex-1 flex-col bg-background text-on-background">
			<div class="max-w-2xl mx-auto px-margin-mobile pt-32 pb-24">
				<div class="mx-auto mb-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
					<span class="material-symbols-outlined text-4xl" aria-hidden="true">description</span>
				</div>
				<h2 class="mb-6 font-h1-mobile text-h1-mobile font-black uppercase tracking-tight md:font-h1 md:text-h1">
					Conditions d'utilisation
				</h2>
				<p class="mb-10 font-body-lg text-secondary leading-relaxed text-sm">
					Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
				</p>

				<div class="space-y-8 text-sm leading-relaxed">
					{sections.map(({ title, body }) => (
						<div key={title} class="space-y-3">
							<h3 class="font-button text-xs tracking-widest uppercase text-primary">{title}</h3>
							<div class="prose-sm text-secondary/80 space-y-3">
								{body.map((p) => (
									<p key={p}>{p}</p>
								))}
							</div>
						</div>
					))}
				</div>

				<div class="mt-14 pt-8 border-t border-secondary/10">
					<p class="mb-4 font-button text-xs tracking-widest uppercase text-secondary">Contact</p>
					<p class="text-secondary/80 leading-relaxed">
						Pour toute question concernant ces conditions, contactez-nous à{' '}
						<a href="mailto:hanitra@great-madagascar-tours.com" class="text-primary hover:underline">
							hanitra@great-madagascar-tours.com
						</a>
						, ou par téléphone au +261 34 03 124 01.
					</p>
				</div>
			</div>
		</section>
	);
}

const sections = [
	{
		title: '1. Acceptation des conditions',
		body: [
			"En accédant au site GMT+3 Madagascar et en l'utilisant, vous acceptez les présentes conditions d'utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser le site.",
			"Ces conditions s'appliquent à tous les visiteurs, utilisateurs et clients qui réservent une expédition ou un circuit via la plateforme.",
		],
	},
	{
		title: '2. Description du service',
		body: [
			"GMT+3 Madagascar est une plateforme de réservation d'expéditions, circuits et destinations touristiques à Madagascar.",
			"Le site permet de consulter les événements disponibles et de participer à une expédition ou un circuit via une réservation directe.",
			"Nous nous réservons le droit de modifier ou d'interrompre le service à tout moment, sans préavis.",
		],
	},
	{
		title: '3. Participation aux événements',
		body: [
			"Aucune inscription n'est requise pour participer à un événement. La participation se fait par réservation directe.",
			"Vous devez fournir des informations exactes et à jour (nom, contact) pour valider votre participation.",
			"Nous pouvons refuser ou annuler une participation en cas de non-respect des présentes conditions.",
		],
	},
	{
		title: '4. Réservations et paiements',
		body: [
			"Toute réservation passée sur le site est soumise à disponibilité et confirmation de notre part.",
			"Les prix affichés sont ceux en vigueur au moment de la réservation, exprimés en devise locale ou internationale selon l'option choisie.",
			"Le paiement s'effectue selon les moyens proposés sur le site. Nous ne stockons pas vos données bancaires complètes.",
		],
	},
	{
		title: '5. Propriété intellectuelle',
		body: [
			"L'ensemble du contenu du site (textes, images, logos, vidéos, graphismes) est la propriété de GMT+3 Madagascar ou de ses partenaires, protégé par le droit d'auteur.",
			"Toute reproduction, totale ou partielle, est interdite sans autorisation écrite préalable.",
		],
	},
	{
		title: '6. Données personnelles',
		body: [
			"Nous collectons uniquement les données nécessaires à la gestion de votre participation et de votre réservation (nom, email, téléphone).",
			"Vos données ne sont pas vendues à des tiers. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
			"Conformément à la réglementation applicable, vous pouvez exercer ces droits en nous contactant.",
		],
	},
	{
		title: '7. Limitation de responsabilité',
		body: [
			"GMT+3 Madagascar s'efforce de fournir des informations exactes, mais ne garantit pas l'absence d'erreurs ou d'omissions.",
			"Nous ne sommes pas responsables des dommages indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le site.",
		],
	},
	{
		title: '8. Modification des conditions',
		body: [
			"Nous pouvons mettre à jour ces conditions à tout moment. La version en ligne fait foi.",
			"Nous vous invitons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.",
		],
	},
	{
		title: '9. Droit applicable',
		body: [
			"Les présentes conditions sont régies par le droit malgache. Tout litige relatif à leur interprétation ou exécution relève des juridictions compétentes de Madagascar.",
		],
	},
];
