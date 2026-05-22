import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from 'react';

interface SearchFilterProps {
    value: string;
    onChange: (newValue: string) => void;
    size?: 'small' | 'medium';
}

const SearchFilter: React.FC<SearchFilterProps> = ({ value, onChange, size = 'medium' }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') onChange(localValue);
        if (e.key === 'Escape') { setLocalValue(''); onChange(''); }
    };

    return (
        <TextField
            fullWidth
            size={size}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Szukaj... (Enter aby filtrować)"
            label="Wpisz nazwę lub cechę ściernicy"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                    </InputAdornment>
                ),
                endAdornment: localValue ? (
                    <InputAdornment position="end">
                        <IconButton size="small" onClick={() => { setLocalValue(''); onChange(''); }}>
                            <CancelIcon fontSize="small" />
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
        />
    );
};

export default SearchFilter;