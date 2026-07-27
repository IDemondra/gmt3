function iconForName(name = '') {
	const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
	if (/randonnee|trek|marche/.test(normalized)) return 'hiking';
	if (/voyage|circuit|sejour/.test(normalized)) return 'luggage';
	if (/pique.?nique|pic.?nic/.test(normalized)) return 'outdoor_grill';
	if (/culture|musee|patrimoine|visite/.test(normalized)) return 'museum';
	if (/aventure|plein air|exploration/.test(normalized)) return 'explore';
	if (/camping|bivouac/.test(normalized)) return 'camping';
	if (/velo|cycl|vtt/.test(normalized)) return 'pedal_bike';
	if (/plage|mer|plongee|baignade/.test(normalized)) return 'beach_access';
	if (/kayak|canoe|bateau|navigation/.test(normalized)) return 'directions_boat';
	return 'category';
}

export function getEventTypeIcon(type) {
	if (!type) return 'category';
	if (type.icone && type.icone !== 'category') return type.icone;
	return iconForName(type.nom);
}
