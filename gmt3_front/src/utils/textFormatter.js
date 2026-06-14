export function applyFormatting(textarea, before, after = before) {
	if (!textarea) return;

	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const text = textarea.value;
	const selectedText = text.substring(start, end) || 'texte';

	const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
	textarea.value = newText;

	textarea.selectionStart = start + before.length;
	textarea.selectionEnd = start + before.length + selectedText.length;
	textarea.focus();

	const event = new Event('input', { bubbles: true });
	textarea.dispatchEvent(event);
}
