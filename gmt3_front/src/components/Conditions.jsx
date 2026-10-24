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
			"En accédant au site GMT+3 Fianarantsoa et en l'utilisant, vous acceptez les présentes conditions d'utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser le site.",
			"Ces conditions s'appliquent à tout visiteur et à tout participant à une expédition, randonnée ou circuit organisé par GMT+3 Fianarantsoa.",
		],
	},
	{
		title: '2. Description du service',
		body: [
			"GMT+3 Fianarantsoa est une agence de tourisme basée à Fianarantsoa (Anolaka), en Haute Matsiatra, qui organise des expéditions, randonnées, treks guidés, excursions à la journée, séjours, voyages sur mesure et immersions culturelles dans la région.",
			"Le site présente le calendrier des expéditions, leurs caractéristiques (date, lieu, niveau de difficulté, places disponibles, tarif) et permet d'envoyer une demande de réservation.",
			"Une expédition peut être ajustée (date, itinéraire, tarif) pour des raisons de sécurité ou d'organisation ; toute modification substantielle vous est communiquée avant le départ.",
			"Le site ne propose ni compte utilisateur ni paiement en ligne : toute participation passe par une demande de réservation, puis par une confirmation de notre part.",
		],
	},
	{
		title: '3. Réservation et participation aux expéditions',
		body: [
			"La réservation s'effectue via le formulaire de la fiche expédition, par WhatsApp au +261 34 03 124 01, par email à hanitra@great-madagascar-tours.com ou par téléphone.",
			"Vous devez fournir votre nom et un contact (numéro de téléphone ou adresse email) pour que votre demande puisse être traitée.",
			"Toute demande est enregistrée comme « en attente », puis confirmée par nos soins après vérification des disponibilités. Seule la confirmation fait foi de votre participation.",
			"Chaque expédition dispose d'un nombre de places limité. Dès que la capacité est atteinte, les demandes sont refusées, et les inscriptions sont closes lorsque la date de départ est passée.",
		],
	},
	{
		title: '4. Prix et paiement',
		body: [
			"Les tarifs affichés sur le site sont exprimés en ariary (MGA) et correspondent au contenu et à la durée indiqués sur la fiche de l'expédition.",
			"Aucun paiement n'est effectué via le site. Les modalités de règlement (options disponibles et échéances) vous sont communiquées lors de la confirmation de votre réservation.",
			"Aucun moyen de paiement n'est enregistré sur le site.",
			"Le prix d'une expédition est celui affiché sur sa fiche au moment de la réservation ; les tarifs peuvent évoluer d'une saison à l'autre.",
		],
	},
	{
		title: '5. Annulation et remboursement',
		body: [
			"Vous pouvez annuler votre participation à tout moment en nous contactant par WhatsApp, email ou téléphone.",
			"Les conditions d'annulation et de remboursement applicables à chaque expédition vous sont précisées lors de la confirmation de votre réservation.",
			"Toute annulation est enregistrée et les places libérées sont remises à disposition des autres participants.",
		],
	},
	{
		title: '6. Obligations du participant',
		body: [
			"Pour garantir la sécurité du groupe, tout participant s'engage à suivre les consignes du guide, à ne pas s'éloigner du groupe et à signaler tout problème de santé ou matériel.",
			"Vous devez vous présenter au lieu et à l'heure de rendez-vous indiqués sur la fiche de l'expédition.",
			"L'équipement et les vêtements adaptés au terrain et à la difficulté annoncée sont à votre charge ; par sécurité, le guide peut refuser le départ d'un participant dont l'état de santé ou l'équipement ne le permet pas.",
			"Nous vous conseillons de contracter une assurance voyage couvrant l'annulation, les frais médicaux et l'évacuation.",
		],
	},
	{
		title: '7. Avis et témoignages',
		body: [
			"Après votre expédition, vous pouvez publier un avis (note, commentaire et, si vous le souhaitez, une photo) depuis la page de l'événement.",
			"Les avis sont publiés après validation par notre équipe ; les avis non validés ne sont pas visibles du public.",
			"Votre nom apparaît publiquement sur l'avis. Vous pouvez à tout moment demander la suppression de votre avis ou de votre photo.",
		],
	},
	{
		title: '8. Propriété intellectuelle',
		body: [
			"L'ensemble du contenu du site (textes, images, logos, vidéos, graphismes) est la propriété de GMT+3 Fianarantsoa ou de ses partenaires, protégé par le droit d'auteur.",
			"Toute reproduction, totale ou partielle, est interdite sans autorisation écrite préalable.",
		],
	},
	{
		title: '9. Données personnelles',
		body: [
			"Pour une réservation, nous collectons votre nom et votre contact (numéro de téléphone ou adresse email), uniquement pour traiter votre demande et organiser votre expédition.",
			"Pour un avis, nous collectons votre nom, votre note, votre commentaire et, si vous la joignez, une photo.",
			"Ces données ne sont ni vendues ni cédées à des tiers à des fins commerciales. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
			"Conformément à la réglementation applicable, vous pouvez exercer ces droits en nous contactant.",
		],
	},
	{
		title: '10. Limitation de responsabilité',
		body: [
			"GMT+3 Fianarantsoa s'efforce de fournir des informations exactes et à jour sur ses expéditions, mais ne garantit pas l'absence d'erreurs ou d'omissions.",
			"En randonnée, les aléas climatiques, le relief ou l'état des routes peuvent imposer une modification de l'itinéraire ou des horaires ; ces ajustements sont signalés aux participants.",
			"Nous ne sommes pas responsables des dommages indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le site.",
		],
	},
	{
		title: '11. Modification des conditions',
		body: [
			"Nous pouvons mettre à jour ces conditions à tout moment. La version en ligne fait foi.",
			"Nous vous invitons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.",
		],
	},
	{
		title: '12. Droit applicable et contact',
		body: [
			"Les présentes conditions sont régies par le droit malgache. Tout litige relatif à leur interprétation ou exécution relève des juridictions compétentes de Madagascar.",
			"En cas de différend, une résolution amiable par contact direct est recherchée en priorité.",
			"Pour toute demande relative à l'application des présentes conditions, adressez-vous à GMT+3 Fianarantsoa via les coordonnées de contact indiquées ci-dessous.",
		],
	},
];
