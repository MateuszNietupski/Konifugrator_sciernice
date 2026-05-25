import { Box, Chip, Button, Tooltip } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CategoryIcon from '@mui/icons-material/Category';
import GrainIcon from '@mui/icons-material/Grain';
import TextureIcon from '@mui/icons-material/Texture';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

import { getBondLabel, getBondDescription, getWheelTypeLabel, getWheelTypeDescription } from '../utils/filterGroups';

interface ChipItem {
    key: string;
    icon: React.ReactElement;
    label: string;
    tooltip?: string;
    onDelete: () => void;
}

interface ActiveFiltersProps {
    selectedTypes: string[];
    selectedGrits: number[];
    selectedMaterials: string[];
    selectedBonds: string[];
    abrasiveSearch: string;
    onRemoveType: (type: string) => void;
    onRemoveGrit: (grit: number) => void;
    onRemoveMaterial: (material: string) => void;
    onRemoveBond: (bond: string) => void;
    onClearSearch: () => void;
    onClearAll: () => void;
}

const ActiveFilters = ({
    selectedTypes,
    selectedGrits,
    selectedMaterials,
    selectedBonds,
    abrasiveSearch,
    onRemoveType,
    onRemoveGrit,
    onRemoveMaterial,
    onRemoveBond,
    onClearSearch,
    onClearAll,
}: ActiveFiltersProps) => {
    const chips: ChipItem[] = [
        ...selectedTypes.map((t) => ({
            key: `type-${t}`,
            icon: <CategoryIcon />,
            label: getWheelTypeLabel(t),
            tooltip: getWheelTypeDescription(t),
            onDelete: () => onRemoveType(t),
        })),
        ...selectedGrits.map((g) => ({
            key: `grit-${g}`,
            icon: <GrainIcon />,
            label: `Ziarno ${g}`,
            tooltip: `Ziarno ${g}`,
            onDelete: () => onRemoveGrit(g),
        })),
        ...selectedMaterials.map((m) => ({
            key: `mat-${m}`,
            icon: <TextureIcon />,
            label: m,
            tooltip: `Materiał ${m}`,
            onDelete: () => onRemoveMaterial(m),
        })),
        ...(selectedBonds || []).map((b) => ({
            key: `bond-${b}`,
            icon: <TextureIcon />,
            label: getBondLabel(b),
            tooltip: getBondDescription(b),
            onDelete: () => onRemoveBond(b),
        })),
        ...(abrasiveSearch ? [{
            key: 'search',
            icon: <SearchIcon />,
            label: `„${abrasiveSearch}"`,
            onDelete: onClearSearch,
        }] : []),
    ];

    if (chips.length === 0) return null;

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            px: 1.5,
            py: 1,
            mb: 1,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderLeft: '3px solid',
            borderLeftColor: 'secondary.main',
            borderRadius: 1,
        }}>
            Aktywne filtry:
            {chips.map((c) => (
                <Tooltip
                    key={c.key}
                    title={c.tooltip || ''}
                    arrow
                    enterDelay={400}
                    disableHoverListener={!c.tooltip}
                    disableFocusListener={!c.tooltip}
                    disableTouchListener={!c.tooltip}
                    placement="top"
                    slotProps={{
                        tooltip: {
                            sx: {
                                bgcolor: 'rgba(14, 33, 53, 0.9)',
                                color: '#ffffff',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                maxWidth: 250,
                                textAlign: 'center',
                                '& .MuiTooltip-arrow': { color: 'rgba(14, 33, 53, 0.9)' }
                            }
                        }
                    }}
                >
                    <Chip
                        icon={c.icon}
                        label={c.label}
                        size="small"
                        onDelete={c.onDelete}
                        deleteIcon={
                            <Tooltip title="Usuń filtr">
                                <CancelIcon />
                            </Tooltip>
                        }
                        sx={{
                            cursor: c.tooltip ? 'help' : 'default',
                            bgcolor: '#fff',
                            border: '1px solid',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            fontWeight: 600,
                            maxWidth: 320,
                            '& .MuiChip-icon': { color: 'primary.main', fontSize: 16 },
                            '& .MuiChip-deleteIcon': {
                                color: 'primary.main',
                                '&:hover': { color: 'secondary.main' },
                            },
                            '&:hover': {
                                borderColor: 'secondary.main',
                                boxShadow: '0 0 0 2px rgba(228,5,5,0.08)',
                            },
                        }}
                    />
                </Tooltip>
            ))}

            {chips.length >= 2 && (
                <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={onClearAll}
                    sx={{
                        ml: 'auto',
                        color: 'secondary.main',
                        fontWeight: 700,
                        '&:hover': { bgcolor: 'rgba(228,5,5,0.06)' },
                    }}
                >
                    Wyczyść wszystkie
                </Button>
            )}
        </Box>
    );
};

export default ActiveFilters;