const MAX_GALLERY_PHOTOS = 10;

function sanitizePhotoFilename(originalName: string, index: number): string {
	const normalized = originalName.replace(/\\/g, '/').split('/').pop() || `photo-${index}`;
	const parts = normalized.split('.');
	const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : 'jpg';
	const base = parts.join('.') || `photo-${index}`;
	const safeBase = base.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') || `photo-${index}`;
	const safeExt = ext.replace(/[^a-z0-9]+/g, '') || 'jpg';
	return `${String(index).padStart(2, '0')}-${safeBase}.${safeExt}`;
}

export interface GalleryUploadPlanItem {
	file: File;
	filename: string;
	url: string;
	ordre: number;
}

export function buildGalleryUploadPlan(evenementId: number, files: File[], maxItems = MAX_GALLERY_PHOTOS): GalleryUploadPlanItem[] {
	return files
		.filter((file): file is File => file instanceof File && file.size > 0)
		.slice(0, maxItems)
		.map((file, index) => {
			const ordre = index + 1;
			const filename = sanitizePhotoFilename(file.name, ordre);

			return {
				file,
				filename,
				url: `/uploads/evenements/${evenementId}/gallery/${filename}`,
				ordre,
			};
		});
}
