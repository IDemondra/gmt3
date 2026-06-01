/**
 * @param {KeyboardEvent} e
 * @param {number} [maxLength]
 */
export function handleDigitKeyDown(e, maxLength) {
	if (e.ctrlKey || e.altKey || e.metaKey) return;
	const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
	if (allowed.includes(e.key)) return;
	if (!/^[0-9]$/.test(e.key)) e.preventDefault();
}

/**
 * @param {Event} e
 * @param {number} [maxLength]
 * @returns {string}
 */
export function getDigitsValue(e, maxLength) {
	const raw = e.currentTarget.value;
	return maxLength != null ? raw.replace(/\D/g, '').slice(0, maxLength) : raw.replace(/\D/g, '');
}
