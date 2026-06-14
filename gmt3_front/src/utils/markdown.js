import { marked } from 'marked';

marked.setOptions({
	breaks: true,
	gfm: true,
});

export function parseMarkdown(text) {
	if (!text) return '';
	return marked(text);
}

export function parseMarkdownInline(text) {
	if (!text) return '';
	return text
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/__(.*?)__/g, '<strong>$1</strong>')
		.replace(/\*(.*?)\*/g, '<em>$1</em>')
		.replace(/_(.*?)_/g, '<em>$1</em>')
		.replace(/~~(.*?)~~/g, '<del>$1</del>');
}
