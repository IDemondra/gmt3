import { FormModal } from './FormModal.jsx';
import { applyFormatting } from '../../utils/textFormatter.js';
import { handleDigitKeyDown, getDigitsValue } from '../../utils/digits.js';
import { formatMo } from '../../hooks/useGalleryUpload.js';

const DESC_MAX = 1000;

const toDateInputValue = (date = new Date()) => {
	if (typeof date === 'string') {
		if (!date) return toDateInputValue();
		return date.includes('-') ? date.split(' ')[0] : date.split('/').reverse().join('-');
	}
	if (!(date instanceof Date) || isNaN(date)) {
		return toDateInputValue();
	}
	const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	return offsetDate.toISOString().slice(0, 10);
};

function EventTypeField({ typeSelection, setTypeSelection, sortedEventTypes }) {
	return (
		<div>
			<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="typeEvenementId">Type d’événement</label>
			<select id="typeEvenementId" name="typeEvenementId" required value={typeSelection} onChange={(e) => setTypeSelection(e.currentTarget.value)} class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
				<option value="" disabled>— Choisir un type —</option>
				{sortedEventTypes.map((type) => <option key={type.id} value={type.id}>{type.nom}</option>)}
				<option value="__new__">＋ Ajouter un nouveau type</option>
			</select>
			{typeSelection === '__new__' && (
				<div class="mt-3">
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="typeEvenementNom">Nom du nouveau type</label>
					<input id="typeEvenementNom" name="typeEvenementNom" type="text" required maxLength="100" class="w-full px-4 py-2.5 bg-white border border-primary/30 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Ex. Sortie en bateau" />
				</div>
			)}
		</div>
	);
}

function DifficultyField({ selectedEventType, editingEvent }) {
	if (selectedEventType?.code !== 'randonnee' && selectedEventType?.code !== 'randonnee_touristique') return null;
	return (
		<div>
			<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="difficulte">Difficulté (randonnée)</label>
			<select id="difficulte" name="difficulte" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer" defaultValue={editingEvent?.difficulte || ''}>
				<option value="">— Non applicable —</option>
				<option value="Accessible">Accessible</option>
				<option value="Modéré">Modéré</option>
				<option value="Soutenu">Soutenu</option>
				<option value="Difficile">Difficile</option>
				<option value="Extrême">Extrême</option>
			</select>
		</div>
	);
}

function EventImageField({ previewSrc, setPreviewSrc }) {
	return (
		<div>
			<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="imagePrincipale">
				Image principale (jpg, png, webp, gif, heic)
			</label>
			<input id="imagePrincipale" name="imagePrincipale" type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-container" onInput={(e) => { const f = e.currentTarget.files?.[0]; if (f) setPreviewSrc(URL.createObjectURL(f)); }} />
			{previewSrc && (
				<div class="mt-4 rounded-lg overflow-hidden border border-gray-100">
					<img src={previewSrc} alt="Aperçu" class="max-h-48 object-cover w-full" />
				</div>
			)}
		</div>
	);
}

function EventGalleryField({ editingEvent, existingGalleryUrls, gallery }) {
	return (
		<div>
			<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
				Galerie photos (optionnel)
			</label>
			{editingEvent && existingGalleryUrls.length > 0 && (
				<div class="mb-3 flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
					<span class="material-symbols-outlined text-[16px] mt-0.5">warning</span>
					<span>L’ajout de nouvelles photos remplacera les {existingGalleryUrls.length} photo(s) existante(s).</span>
				</div>
			)}
			<input id="photosEvenement" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-container" disabled={gallery?.compressingCount > 0} onInput={(e) => {
				const files = Array.from(e.currentTarget.files || []);
				e.currentTarget.value = '';
				gallery?.addFiles(files);
			}} />
			{gallery?.compressingCount > 0 && <p class="text-[11px] text-primary mt-2">Compression {gallery.compressingCount} photo(s)...</p>}
			{(gallery?.count > 0 || existingGalleryUrls.length > 0) && (
				<p class="text-[11px] text-gray-400 mt-2">{formatMo(gallery.totalBytes)} Mo / {formatMo(gallery.maxTotalBytes)} Mo au total (nouvelles photos)</p>
			)}
			{existingGalleryUrls.length > 0 && (
				<div class="mt-4 grid grid-cols-3 gap-3">
					{existingGalleryUrls.map((src, i) => (
						<div key={src} class="relative aspect-square rounded-lg overflow-hidden border border-gray-100 opacity-60">
							<img src={src} alt={`Galerie existante ${i}`} class="w-full h-full object-cover" />
						</div>
					))}
				</div>
			)}
			{gallery?.previews.length > 0 && (
				<div class="mt-4 grid grid-cols-3 gap-3">
					{gallery.previews.map((src, i) => (
						<div key={src} class="relative aspect-square rounded-lg overflow-hidden border-2 border-primary/30">
							<img src={src} alt={`Nouvelle vue ${i}`} class="w-full h-full object-cover" />
							<button type="button" onClick={() => gallery.removeFile(i)} class="absolute top-1 right-1 p-1 rounded bg-black/50 text-white hover:bg-black/70 transition-all">
								<span class="material-symbols-outlined text-[16px]">close</span>
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function EventDescriptionField({ descText, setDescText, descRef }) {
	return (
		<div>
			<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="description">Description</label>
			<div class="border border-gray-100 rounded-lg overflow-hidden">
				<div class="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-100">
					<button type="button" onClick={() => applyFormatting(descRef.current, '**', '**')} class="p-2 rounded hover:bg-white transition-colors text-sm font-bold text-gray-700" title="Gras">
						<span class="material-symbols-outlined text-[18px]">format_bold</span>
					</button>
					<button type="button" onClick={() => applyFormatting(descRef.current, '*', '*')} class="p-2 rounded hover:bg-white transition-colors text-sm italic text-gray-700" title="Italique">
						<span class="material-symbols-outlined text-[18px]">format_italic</span>
					</button>
					<button type="button" onClick={() => applyFormatting(descRef.current, '~~', '~~')} class="p-2 rounded hover:bg-white transition-colors text-sm line-through text-gray-700" title="Barré">
						<span class="material-symbols-outlined text-[18px]">strikethrough_s</span>
					</button>
					<div class="w-px h-6 bg-gray-200 mx-1" />
					<button type="button" onClick={() => applyFormatting(descRef.current, '# ', '')} class="p-2 rounded hover:bg-white transition-colors text-sm font-bold text-gray-700" title="Titre">
						<span class="material-symbols-outlined text-[18px]">title</span>
					</button>
				</div>
				<textarea id="description" name="description" ref={descRef} class="w-full px-4 py-2.5 bg-white border-0 outline-none focus:ring-2 focus:ring-primary/20 focus:ring-inset" rows="3" placeholder="Description courte... (Markdown supporté)" maxLength={DESC_MAX} onInput={(e) => { setDescText(e.currentTarget.value); }} value={descText} />
			</div>
			<div class="mt-1 flex items-center justify-between gap-3 text-[10px] text-gray-400">
				<span>Supporte le markdown: **gras**, *italique*, ~~barré~~</span>
				<span class={descText.length >= DESC_MAX ? 'font-bold text-primary' : ''}>{descText.length}/{DESC_MAX}</span>
			</div>
		</div>
	);
}

function EventScheduleField({ editingEvent, todayStr, currentTimeStr }) {
	return (
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="dateDepart">Date départ</label>
				<input id="dateDepart" name="dateDepart" type="date" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" min={editingEvent ? undefined : todayStr} defaultValue={editingEvent?.dateDepart ? toDateInputValue(editingEvent.dateDepart) : ''} />
			</div>
			<div>
				<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="heureDepart">Heure départ</label>
				<input id="heureDepart" name="heureDepart" type="time" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" defaultValue={editingEvent?.heureDepart || currentTimeStr} />
			</div>
			<div>
				<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="dateRetour">Date retour</label>
				<input id="dateRetour" name="dateRetour" type="date" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" min={todayStr} defaultValue={editingEvent?.dateRetour ? toDateInputValue(editingEvent.dateRetour) : todayStr} />
			</div>
			<div>
				<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="heureRetour">Heure retour</label>
				<input id="heureRetour" name="heureRetour" type="time" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" defaultValue={editingEvent?.heureRetour || currentTimeStr} />
			</div>
		</div>
	);
}

export function EventFormModal({
	open,
	title,
	submitLabel = 'Enregistrer',
	onClose,
	onSubmit,
	uploading = false,
	uploadStatus = '',
	uploadProgress = 0,
	editingEvent = null,
	eventTypes = [],
	sortedEventTypes = eventTypes,
	typeSelection = '',
	setTypeSelection,
	descText = '',
	setDescText,
	descRef = null,
	previewSrc = '',
	setPreviewSrc,
	existingGalleryUrls = [],
	gallery,
	todayStr = '',
	currentTimeStr = '',
}) {
	const selectedEventType = eventTypes.find((type) => String(type.id) === typeSelection);

	return (
		<FormModal
			key={editingEvent?.id ?? 'new-event'}
			open={open}
			title={title}
			submitLabel={submitLabel}
			onClose={onClose}
			onSubmit={onSubmit}
			encType="multipart/form-data"
			submitting={uploading}
			submittingLabel={uploadStatus || 'Traitement...'}
			progressPercent={uploadStatus === 'Envoi en cours...' ? uploadProgress : undefined}
		>
			<EventTypeField typeSelection={typeSelection} setTypeSelection={setTypeSelection} sortedEventTypes={sortedEventTypes} />
			<div>
				<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="titre">Titre</label>
				<input id="titre" name="titre" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Nom de l'événement" required defaultValue={editingEvent?.titre || editingEvent?.title || ''} />
			</div>
				<EventDescriptionField descText={descText} setDescText={setDescText} descRef={descRef} />
				<EventScheduleField editingEvent={editingEvent} todayStr={todayStr} currentTimeStr={currentTimeStr} />
			<div>
				<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="lieu">Lieu</label>
				<input id="lieu" name="lieu" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="ex: Parc National de Ranomafana" defaultValue={editingEvent?.lieu || editingEvent?.location || ''} />
			</div>
			<DifficultyField selectedEventType={selectedEventType} editingEvent={editingEvent} />
			<div>
				<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="prix">Prix par place (Ar)</label>
				<input id="prix" name="prix" type="text" inputMode="numeric" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="ex: 150000" defaultValue={editingEvent?.prix ?? editingEvent?.price ?? ''} onKeyDown={handleDigitKeyDown} onInput={(e) => { e.currentTarget.value = getDigitsValue(e); }} />
			</div>
			<div>
				<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="capaciteMax">Capacité maximale</label>
				<input id="capaciteMax" name="capaciteMax" type="number" min="1" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Illimitée" defaultValue={editingEvent?.capaciteMax ?? ''} />
			</div>
			<div class="flex items-center gap-3">
				<input id="estPublie" name="estPublie" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer" defaultChecked={editingEvent?.estPublie || editingEvent?.published || false} />
				<label for="estPublie" class="text-sm text-gray-700 font-medium cursor-pointer">Publié</label>
			</div>
			<EventImageField previewSrc={previewSrc} setPreviewSrc={setPreviewSrc} />
			<EventGalleryField editingEvent={editingEvent} existingGalleryUrls={existingGalleryUrls} gallery={gallery} />
		</FormModal>
	);
}
