import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';

interface SearchFilterProps {
  value: string;
  onChange: (newValue: string) => void;
  size?: 'small' | 'medium'; 
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  value, 
  onChange, 
  size = 'medium' 
}) => (    <TextField
        fullWidth
        size={size}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ mt: 1.5 }}
        placeholder="Szukaj..."
        label="Wpisz nazwę lub cechę ściernicy"
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                </InputAdornment>
            ),
            endAdornment: value ? (
                <InputAdornment position="end">
                    <IconButton size="small" onClick={() => onChange('')} aria-label="Wyczyść wyszukiwanie">
                        <CancelIcon fontSize="small" />
                    </IconButton>
                </InputAdornment>
            ) : null,
        }}
    />
);

export default SearchFilter;