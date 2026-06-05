import { useState, useRef, useEffect } from 'preact/hooks';

/**
 * @typedef {Object} SearchableSelectOption
 * @property {string|number} value
 * @property {string} label
 */

/**
 * @param {Object} props
 * @param {SearchableSelectOption[]} props.options
 * @param {string|number} [props.value]
 * @param {(value: string|number) => void} props.onChange
 * @param {string} [props.placeholder]
 * @param {string} [props.label]
 * @param {string} [props.id]
 * @param {boolean} [props.required]
 */
export function SearchableSelect({ options, value, onChange, placeholder = '', label, id, required }) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const rootRef = useRef(/** @type {HTMLDivElement|null} */(null));
	const inputRef = useRef(/** @type {HTMLInputElement|null} */(null));

	const selected = options.find((o) => o.value == value);

	// Sync input when value changes externally (edit mode)
	useEffect(() => {
		if (!open) setQuery(selected ? selected.label : '');
	}, [value, open, selected]);

	const filtered = query
		? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
		: options;

	const handleInput = (/** @type {string} */ val) => {
		setQuery(val);
		setOpen(true);
		setHighlightedIndex(-1);
		if (!val && value !== undefined && value !== '') {
			onChange('');
		}
	};

	const selectOption = (/** @type {SearchableSelectOption} */ opt) => {
		setQuery(opt.label);
		onChange(opt.value);
		setOpen(false);
		setHighlightedIndex(-1);
		inputRef.current?.focus();
	};

	const handleKeyDown = (/** @type {KeyboardEvent} */ e) => {
		if (!open) {
			if (e.key === 'ArrowDown' || e.key === 'Enter') {
				setOpen(true);
				e.preventDefault();
			}
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
				break;
			case 'Enter':
				e.preventDefault();
				if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
					selectOption(filtered[highlightedIndex]);
				}
				break;
			case 'Escape':
				e.preventDefault();
				setOpen(false);
				setHighlightedIndex(-1);
				break;
		}
	};

	// Click outside
	useEffect(() => {
		const handleClickOutside = (/** @type {MouseEvent} */ e) => {
			if (rootRef.current && !rootRef.current.contains(/** @type {Node} */(e.target))) {
				setOpen(false);
				setHighlightedIndex(-1);
				// Reset query to selected label if open was dismissed
				if (selected) setQuery(selected.label);
				else setQuery('');
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [selected]);

	const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

	return (
		<div ref={rootRef} class="relative">
			{label && (
				<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for={inputId}>
					{label}
				</label>
			)}
			<input
				ref={inputRef}
				id={inputId}
				type="text"
				class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background rounded-xl cursor-text"
				placeholder={placeholder}
				value={query}
				required={required}
				onInput={(e) => handleInput(e.currentTarget.value)}
				onFocus={() => {
					setOpen(true);
					setQuery('');
					setHighlightedIndex(-1);
				}}
				onKeyDown={handleKeyDown}
				autoComplete="off"
				role="combobox"
				aria-expanded={open}
				aria-controls={`${inputId}-listbox`}
				aria-activedescendant={highlightedIndex >= 0 ? `${inputId}-option-${highlightedIndex}` : undefined}
			/>
			{open && filtered.length > 0 && (
				<ul
					id={`${inputId}-listbox`}
					role="listbox"
					class="absolute z-[60] mt-1 w-full bg-surface border border-outline-variant/30 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar"
				>
					{filtered.map((opt, idx) => (
						<li
							id={`${inputId}-option-${idx}`}
							key={opt.value}
							role="option"
							aria-selected={opt.value == value}
							class={`px-4 py-3 font-body-md text-body-md cursor-pointer transition-colors duration-100 ${
								idx === highlightedIndex
									? 'bg-primary/10 text-primary'
									: opt.value == value
										? 'bg-primary/5 text-on-background font-semibold'
										: 'text-on-background hover:bg-surface-container'
							}`}
							onMouseDown={(e) => { e.preventDefault(); selectOption(opt); }}
							onMouseEnter={() => setHighlightedIndex(idx)}
						>
							{opt.label}
						</li>
					))}
				</ul>
			)}
			{open && filtered.length === 0 && (
				<div class="absolute z-[60] mt-1 w-full bg-surface border border-outline-variant/30 rounded-xl shadow-xl px-4 py-3 text-sm text-secondary">
					{options.length === 0 ? 'Aucune donnee disponible.' : 'Aucun resultat.'}
				</div>
			)}
		</div>
	);
}
