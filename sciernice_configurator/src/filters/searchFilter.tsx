import React, { useMemo, useState, useEffect, memo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import CheckIcon from '@mui/icons-material/Check';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // 🌟 Nowa ikonka podpowiedzi
import { type GridFilterModel } from '@mui/x-data-grid';

const FIELDS = [
    { value: 'name', label: 'Nazwa', short: 'Nazwa', type: 'text' },
    { value: 'type', label: 'Typ', short: 'Typ', type: 'text' },
    { value: 'material', label: 'Materiał', short: 'Materiał', type: 'text' },
    { value: 'bond', label: 'Spoiwo', short: 'Spoiwo', type: 'text' },
    { value: 'grit', label: 'Gradacja', short: 'Grit', type: 'number' },
    { value: 'outerDiameter', label: 'Średnica/ Długość', short: 'Dł/Śr', type: 'number' },
    { value: 'boreSize', label: 'Otwór', short: 'Otwór', type: 'number' },
    { value: 'thickness', label: 'Grubość/Szerokość', short: 'Grubość', type: 'number' },
];

const TEXT_OPERATORS = [
    { value: 'contains', label: 'zawiera' },
    { value: 'startsWith', label: 'zaczyna się od' },
    { value: 'endsWith', label: 'kończy się na' },
    { value: 'equals', label: 'jest równe' },
];

const NUMBER_OPERATORS = [
    { value: 'equals', label: 'równe (=)' },
    { value: 'onOrAfter', label: 'większe lub równe (>=)' },
    { value: 'onOrBefore', label: 'mniejsze lub równe (<=)' },
];

const tooltipSlotProps = {
    tooltip: {
        sx: {
            bgcolor: 'rgba(14, 33, 53, 0.9)',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 500,
            maxWidth: 280,
            p: 1,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            '& .MuiTooltip-arrow': {
                color: 'rgba(14, 33, 53, 0.9)'
            }
        }
    }
};

const FieldChips = memo(({ currentField, onFieldChange }: { currentField: string, onFieldChange: (field: string) => void }) => {
    const [showAll, setShowAll] = useState(false);

    const MAIN_FIELDS = ['name', 'type', 'material'];

    const visibleFields = useMemo(() => {
        if (showAll) return FIELDS;
        return FIELDS.filter(f => MAIN_FIELDS.includes(f.value));
    }, [showAll]);

    useEffect(() => {
        if (!MAIN_FIELDS.includes(currentField)) {
            setShowAll(true);
        }
    }, [currentField]);

    const hiddenCount = FIELDS.length - MAIN_FIELDS.length;

    return (
        <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 0.75, alignItems: 'center' }}>
            {visibleFields.map((f) => {
                const active = f.value === currentField;
                return (
                    <Chip
                        key={f.value}
                        label={f.label}
                        size="small"
                        variant={active ? 'filled' : 'outlined'}
                        color={active ? 'primary' : 'default'}
                        onClick={() => onFieldChange(f.value)}
                        sx={{ fontSize: 11, fontWeight: active ? 700 : 500, height: 24, borderRadius: 1 }}
                    />
                );
            })}

            {!showAll ? (
                <Chip
                    label={`+ ${hiddenCount} więcej parametrów`}
                    size="small"
                    variant="outlined"
                    onClick={() => setShowAll(true)}
                    sx={{
                        fontSize: 11,
                        height: 24,
                        borderRadius: 1,
                        borderStyle: 'dashed',
                        color: 'text.secondary',
                        '&:hover': { bgcolor: 'action.hover', color: 'primary.main' }
                    }}
                />
            ) : (
                <Typography
                    component="button"
                    onClick={() => setShowAll(false)}
                    sx={{
                        border: 0,
                        bgcolor: 'transparent',
                        cursor: 'pointer',
                        fontSize: 11,
                        color: 'text.secondary',
                        ml: 0.5,
                        textDecoration: 'underline',
                        '&:hover': { color: 'secondary.main' }
                    }}
                >
                    pokaż mniej
                </Typography>
            )}
        </Stack>
    );
});
FieldChips.displayName = 'FieldChips';

interface SearchFilterProps {
    searchModel?: GridFilterModel;
    onSearchModelChange: (model: GridFilterModel) => void;
    size?: 'small' | 'medium';
    title?: string;
}

const SearchFilter = ({ searchModel, onSearchModelChange, size = 'small', title = 'Wyszukiwarka' }: SearchFilterProps) => {
    const [activeField, setActiveField] = useState<string>('name');
    const [activeOperator, setActiveOperator] = useState<string>('contains');
    const [localText, setLocalText] = useState<string>('');
    const [opAnchor, setOpAnchor] = useState<HTMLElement | null>(null);

    const activeFilters = useMemo(() => {
        return searchModel?.items.filter(item =>
            item.value !== undefined &&
            item.value !== null &&
            String(item.value).trim() !== '' &&
            item.id !== 'search'
        ) || [];
    }, [searchModel]);

    const currentFieldConfig = useMemo(() => {
        return FIELDS.find((f) => f.value === activeField) || FIELDS[0];
    }, [activeField]);

    const availableOperators = useMemo(() => {
        return currentFieldConfig.type === 'number' ? NUMBER_OPERATORS : TEXT_OPERATORS;
    }, [currentFieldConfig.type]);

    const currentOperatorLabel = useMemo(() => {
        return [...TEXT_OPERATORS, ...NUMBER_OPERATORS].find((o) => o.value === activeOperator)?.label ?? 'zawiera';
    }, [activeOperator]);

    const inputHintMessage = useMemo(() => {
        if (currentFieldConfig.type === 'number') {
            return `Wybrałeś pole liczbowe (${currentFieldConfig.label}). Dozwolone są wyłącznie cyfry. Litery i znaki specjalne są automatycznie blokowane przez przeglądarkę. Wpisz wartość i kliknij Enter.`;
        }
        return `Wybrałeś pole tekstowe (${currentFieldConfig.label}). Możesz wpisać dowolną frazę, a następnie wyszukać ją wciskając Enter.`;
    }, [currentFieldConfig]);

    const triggerUpdate = (field: string, operator: string, value: string) => {
        const cleanValue = value.trim();
        if (cleanValue === '') return;

        const currentItems = searchModel?.items ? [...searchModel.items] : [];
        const targetId = `${field}-${operator}`;

        const existingIndex = currentItems.findIndex(item => item.id === targetId);

        const newItem = { id: targetId, field, operator, value: cleanValue };
        if (existingIndex > -1) {
            currentItems[existingIndex] = newItem;
        } else {
            currentItems.push(newItem);
        }

        setLocalText('');

        const finalItems = currentItems.filter(item => item.value !== '');
        if (finalItems.length === 0) {
            finalItems.push({ id: 'search', field: 'name', operator: 'contains', value: '' });
        }

        onSearchModelChange({ items: finalItems });
    };

    const handleFieldChange = (newField: string) => {
        if (newField === activeField) return;

        const targetField = FIELDS.find(f => f.value === newField);
        const nextOperator = targetField?.type === 'number' ? 'equals' : 'contains';

        setActiveField(newField);
        setActiveOperator(nextOperator);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            triggerUpdate(activeField, activeOperator, localText);
        }
        if (e.key === 'Escape') {
            setLocalText('');
        }
    };

    const handleRemoveFilter = (idToRemove: string) => {
        let currentItems = searchModel?.items ? searchModel.items.filter(item => item.id !== idToRemove) : [];
        if (currentItems.length === 0) {
            currentItems.push({ id: 'search', field: 'name', operator: 'contains', value: '' });
        }
        onSearchModelChange({ items: currentItems });
    };

    const handleClearAll = () => {
        setLocalText('');
        onSearchModelChange({
            items: [{ id: 'search', field: 'name', operator: 'contains', value: '' }]
        });
    };

    return (
        <Box sx={{ p: 1.25, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="overline" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1 }}>
                    {title}
                </Typography>
                {activeFilters.length > 0 && (
                    <Typography
                        component="button"
                        onClick={handleClearAll}
                        sx={{ border: 0, bgcolor: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'secondary.main', p: 0, '&:hover': { textDecoration: 'underline' } }}
                    >
                        Wyczyść wszystkie
                    </Typography>
                )}
            </Stack>

            {activeFilters.length > 0 && (
                <Stack direction="row" spacing={0.5} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                    {activeFilters.map((item) => {
                        const fieldCfg = FIELDS.find(f => f.value === item.field);
                        const opCfg = [...TEXT_OPERATORS, ...NUMBER_OPERATORS].find(o => o.value === item.operator);
                        return (
                            <Chip
                                key={item.id}
                                size="small"
                                color="primary"
                                label={`${fieldCfg?.short || item.field} ${opCfg?.label || ''}: ${item.value}`}
                                onDelete={() => handleRemoveFilter(String(item.id))}
                                sx={{ borderRadius: 1, fontSize: 10, height: 20 }}
                            />
                        );
                    })}
                </Stack>
            )}

            <TextField
                fullWidth
                size={size}
                value={localText}
                type={currentFieldConfig.type === 'number' ? 'number' : 'text'}
                onChange={(e) => setLocalText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                    currentFieldConfig.type === 'number'
                        ? `Szukaj liczb...`
                        : `Szukaj`
                }
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                            <Tooltip title={inputHintMessage} arrow placement="top-start" slotProps={tooltipSlotProps}>
                                <HelpOutlineIcon
                                    fontSize="small"
                                    sx={{
                                        color: currentFieldConfig.type === 'number' ? 'secondary.main' : 'text.disabled',
                                        cursor: 'help',
                                        transition: 'color 0.2s'
                                    }}
                                />
                            </Tooltip>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            {localText && (
                                <IconButton size="small" onClick={() => setLocalText('')}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                            <Tooltip title={`Dopasowanie: ${currentOperatorLabel}`} arrow slotProps={tooltipSlotProps}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => setOpAnchor(e.currentTarget)}
                                    sx={{ color: opAnchor ? 'primary.main' : 'text.secondary' }}
                                >
                                    <TuneIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1.25, bgcolor: 'background.default' },
                    '& input[type=number]': { MozAppearance: 'textfield' },
                    '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                    '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                }}
            />

            <Menu
                anchorEl={opAnchor}
                open={Boolean(opAnchor)}
                onClose={() => setOpAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem disabled dense sx={{ opacity: 0.6, fontSize: 11, textTransform: 'uppercase' }}>
                    {currentFieldConfig.type === 'number' ? 'Warunek matematyczny' : 'Warunek dopasowania'}
                </MenuItem>
                {availableOperators.map((op) => {
                    const active = op.value === activeOperator;
                    return (
                        <MenuItem
                            key={op.value}
                            dense
                            selected={active}
                            onClick={() => {
                                setOpAnchor(null);
                                setActiveOperator(op.value);
                            }}
                        >
                            <ListItemText primaryTypographyProps={{ fontSize: 13, fontWeight: active ? 700 : 500 }}>
                                {op.label}
                            </ListItemText>
                            {active && <CheckIcon fontSize="small" sx={{ color: 'primary.main', ml: 1 }} />}
                        </MenuItem>
                    );
                })}
            </Menu>

            <FieldChips currentField={activeField} onFieldChange={handleFieldChange} />
        </Box>
    );
};

export default SearchFilter;