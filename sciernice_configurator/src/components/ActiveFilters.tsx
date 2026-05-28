import { Box, Chip, Button, Tooltip } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CategoryIcon from '@mui/icons-material/Category';
import GrainIcon from '@mui/icons-material/Grain';
import TextureIcon from '@mui/icons-material/Texture';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { type GridFilterModel } from '@mui/x-data-grid';
import StraightenIcon from '@mui/icons-material/Straighten';

import { getBondLabel, getBondDescription, getWheelTypeLabel, getWheelTypeDescription } from '../utils/filterGroups';
import type { NumericDimension, DimensionConfigItem } from '../hooks/useFilters';

interface ChipItem {
    key: string;
    icon: React.ReactElement;
    label: string;
    tooltip?: string;
    onDelete: () => void;
}

interface FilterGroup {
    title: string;
    chips: ChipItem[];
}

interface ActiveFiltersProps {
    selectedTypes: string[];
    selectedGrits: number[];
    selectedMaterials: string[];
    selectedBonds: string[];
    searchModel: GridFilterModel;
    dimensions: Record<NumericDimension, DimensionConfigItem>;
    onRemoveDimensionFilter: (field: NumericDimension) => void;
    onRemoveType: (type: string) => void;
    onRemoveGrit: (grit: number) => void;
    onRemoveMaterial: (material: string) => void;
    onRemoveBond: (bond: string) => void;
    onRemoveSearchItem: (id: string) => void;
    onClearAll: () => void;
}

const columnLabels: Record<string, string> = {
    name: 'Nazwa',
    type: 'Typ',
    material: 'Materiał',
    bond: 'Spoiwo',
    grit: 'Gradacja',
    outerDiameter: 'Średnica/Długość',
    boreSize: 'Otwór',
    thickness: 'Grubość',
};

const operatorLabels: Record<string, string> = {
    contains: 'zawiera',
    startsWith: 'zaczyna się od',
    endsWith: 'kończy się na',
    equals: 'równa się',
    onOrAfter: '≥',
    onOrBefore: '≤',
};

const ActiveFilters = ({
    selectedTypes,
    selectedGrits,
    selectedMaterials,
    selectedBonds,
    searchModel,
    dimensions,
    onRemoveType,
    onRemoveGrit,
    onRemoveMaterial,
    onRemoveBond,
    onRemoveSearchItem,
    onRemoveDimensionFilter,
    onClearAll,
}: ActiveFiltersProps) => {

    const activeSearchItems = searchModel?.items?.filter(
        item => item.value !== undefined && item.value !== null && String(item.value).trim() !== '' && item.id !== 'search'
    ) || [];

    const isOuterActive = dimensions?.outerDiameter?.isActive || false;
    const isThicknessActive = dimensions?.thickness?.isActive || false;
    const isBoreActive = dimensions?.boreSize?.isActive || false;

    const dimensionChips: ChipItem[] = [];

    if (isOuterActive && dimensions?.outerDiameter) {
        dimensionChips.push({
            key: 'dim-outerDiameter',
            icon: <StraightenIcon />,
            label: `Średnica: ${dimensions.outerDiameter.currentValues[0]} - ${dimensions.outerDiameter.currentValues[1]} mm`,
            tooltip: `Średnica zewnętrzna w przedziale od ${dimensions.outerDiameter.currentValues[0]} do ${dimensions.outerDiameter.currentValues[1]} mm`,
            onDelete: () => onRemoveDimensionFilter('outerDiameter'),
        });
    }

    if (isThicknessActive && dimensions?.thickness) {
        dimensionChips.push({
            key: 'dim-thickness',
            icon: <StraightenIcon />,
            label: `Grubość: ${dimensions.thickness.currentValues[0]} - ${dimensions.thickness.currentValues[1]} mm`,
            tooltip: `Grubość/Szerokość w przedziale od ${dimensions.thickness.currentValues[0]} do ${dimensions.thickness.currentValues[1]} mm`,
            onDelete: () => onRemoveDimensionFilter('thickness'),
        });
    }

    if (isBoreActive && dimensions?.boreSize) {
        dimensionChips.push({
            key: 'dim-boreSize',
            icon: <StraightenIcon />,
            label: `Otwór: ${dimensions.boreSize.currentValues[0]} - ${dimensions.boreSize.currentValues[1]} mm`,
            tooltip: `Otwór wewnętrzny w przedziale od ${dimensions.boreSize.currentValues[0]} do ${dimensions.boreSize.currentValues[1]} mm`,
            onDelete: () => onRemoveDimensionFilter('boreSize'),
        });
    }

    const filterGroups: FilterGroup[] = [
        {
            title: 'Frazy',
            chips: activeSearchItems.map((item) => {
                const fieldLabel = columnLabels[item.field] || item.field;
                const opLabel = operatorLabels[item.operator] || item.operator;
                return {
                    key: `search-chip-${item.id}`,
                    icon: <SearchIcon />,
                    label: `${fieldLabel} ${opLabel} „${item.value}”`,
                    tooltip: `Szukasz frazy, gdzie pole ${fieldLabel} ${opLabel} „${item.value}”`,
                    onDelete: () => onRemoveSearchItem(String(item.id)),
                };
            })
        },
        {
            title: 'Typ',
            chips: selectedTypes.map((t) => ({
                key: `type-${t}`,
                icon: <CategoryIcon />,
                label: getWheelTypeLabel(t),
                tooltip: getWheelTypeDescription(t),
                onDelete: () => onRemoveType(t),
            }))
        },
        {
            title: 'Właściwości',
            chips: [
                ...selectedMaterials.map((m) => ({
                    key: `mat-${m}`,
                    icon: <TextureIcon />,
                    label: m,
                    tooltip: `Materiał ${m}`,
                    onDelete: () => onRemoveMaterial(m),
                })),
                ...selectedGrits.map((g) => ({
                    key: `grit-${g}`,
                    icon: <GrainIcon />,
                    label: `Ziarno ${g}`,
                    tooltip: `Ziarno ${g}`,
                    onDelete: () => onRemoveGrit(g),
                })),
                ...(selectedBonds || []).map((b) => ({
                    key: `bond-${b}`,
                    icon: <TextureIcon />,
                    label: getBondLabel(b),
                    tooltip: getBondDescription(b),
                    onDelete: () => onRemoveBond(b),
                }))
            ]
        },
        {
            title: 'Wymiary',
            chips: dimensionChips
        }
    ];

    const chips = filterGroups.flatMap((group) => group.chips);
    const totalChipsCount = chips.length;
    if (totalChipsCount === 0) return null;

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