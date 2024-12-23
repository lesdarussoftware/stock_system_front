import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Form } from 'react-bootstrap';

type Option = {
    id: number;
    label: string;
};

type AutocompleteProps = {
    options: Option[];
    onChange?: (selectedOptionId: number) => void;
    placeholder?: string;
};

export function Autocomplete({
    options,
    onChange,
    placeholder = "Buscar...",
}: AutocompleteProps) {
    const [query, setQuery] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setQuery(value);

        // Filtrar las opciones según el input del usuario
        const filtered = options.filter((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOptions(filtered);
        setShowDropdown(true);
    };

    const handleOptionSelect = (option: Option): void => {
        setQuery(option.label);
        setShowDropdown(false);
        if (onChange) onChange(option.id);
    };

    const handleOutsideClick = (e: MouseEvent): void => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
            <Form.Control
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                onFocus={() => setShowDropdown(true)} // Mostrar el dropdown al enfocar
            />
            {showDropdown && (
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        background: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto', // Scroll si hay muchas opciones
                    }}
                >
                    {filteredOptions.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => handleOptionSelect(option)}
                            style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = '#f8f9fa')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = 'white')
                            }
                        >
                            {option.label}
                        </div>
                    ))}
                    {filteredOptions.length === 0 && (
                        <div
                            style={{
                                padding: '8px 12px',
                                color: '#999',
                                textAlign: 'center',
                            }}
                        >
                            No hay opciones disponibles.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
