import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
	breaks: true,
	gfm: true,
});

function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
}

export function parseMarkdown(text) {
	if (!text) return '';
	return DOMPurify.sanitize(marked(text));
}

export function parseMarkdownInline(text) {
	if (!text) return '';
	return escapeHtml(text)
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/__(.*?)__/g, '<strong>$1</strong>')
		.replace(/\*(.*?)\*/g, '<em>$1</em>')
		.replace(/_(.*?)_/g, '<em>$1</em>')
		.replace(/~~(.*?)~~/g, '<del>$1</del>');
}
