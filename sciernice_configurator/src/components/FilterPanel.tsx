import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchFilter from '../filters/searchFilter';
import MaterialFilter from '../filters/materialFilter';
import GritsFilter from '../filters/gritsFilter';
import ShapeTypeFilter from '../filters/shapeTypeFilter';

interface ClearButtonProps {
    onClick: () => void;
    size?: 'small' | 'medium' | 'large';
    label?: string;
}

const ClearButton = ({ onClick, size = 'small', label = "Wyczyść" }: ClearButtonProps) => (
    <Button
        size={size}
        startIcon={<FilterAltOffIcon />}
        onClick={onClick}
        color="inherit"
        sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}
    >
        {label}
    </Button>
);

interface SectionTitleProps {
    children: React.ReactNode;
    extra?: React.ReactNode;
}

const SectionTitle = ({ children, extra }: SectionTitleProps) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 2 }}>
        <Typography variant="body2" fontWeight={600} color="text.secondary">
            {children}
        </Typography>
        {extra}
    </Box>
);

interface FilterPanelProps {
    wheelTypes: string[];
    abrasiveMaterials: string[];
    gritOptions: number[];
    lengthSteps: number[];
    facetCounts: {
        Type: Record<string, number>;
        Grit: Record<number, number>;
        Material: Record<string, number>;
    };

    selectedTypes: string[];
    selectedGrits: number[];
    selectedMaterials: string[];
    lengthRange: [number, number];

    onTypesChange: (types: string[]) => void;
    onGritsChange: (grits: number[]) => void;
    onLengthChange: (range: [number, number]) => void;
    onMaterialsChange: (materials: string[]) => void;
    onClearFilters: () => void;
    abrasiveSearch: string;
    onAbrasiveSearchChange: (newValue: string) => void;
}

export default function FilterPanel({
    wheelTypes,
    abrasiveMaterials,
    lengthSteps,
    facetCounts,
    selectedTypes,
    selectedGrits,
    gritOptions,
    selectedMaterials,
    lengthRange,
    abrasiveSearch,
    onTypesChange,
    onGritsChange,
    onLengthChange,
    onMaterialsChange,
    onClearFilters,
    onAbrasiveSearchChange,

}: FilterPanelProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const renderSearchFilter = (size: 'small' | 'medium' = 'medium') => (
        <SearchFilter
            value={abrasiveSearch}
            onChange={onAbrasiveSearchChange}
            size={size}
        />
    );

    const renderMaterialFilter = (size: 'small' | 'medium' = 'medium') => (
        <MaterialFilter
            value={selectedMaterials}
            options={abrasiveMaterials}
            onChange={onMaterialsChange}
            size={size}
            facetCounts={facetCounts.Material}
        />
    );

    const renderTypeFilter = (size: 'small' | 'medium' = 'medium') => (
        <ShapeTypeFilter
            selectedTypes={selectedTypes}
            onTypesChange={onTypesChange}
            facetCounts={facetCounts.Type}
        />
    );

    const renderGritsFilter = (size: 'small' | 'medium' = 'medium') => (
        <GritsFilter
            value={selectedGrits}
            options={gritOptions}
            onChange={onGritsChange}
            size={size}
            facetCounts={facetCounts.Grit}
        />
    );


    const BrandLogo = () => (
        <Link
            href="https://www.e-darmet.pl"
            target="_blank"
            rel="noopener"
            sx={{
                textDecoration: 'none',
                display: 'block',
                '&:hover .logo-box': { filter: 'brightness(0.9)' },
                '&:hover .text-link': { color: 'primary.main' }
            }}
        >
            <Box sx={{ p: 2.5, textAlign: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box className="logo-box" sx={{ bgcolor: '#0e2135', p: 1, borderRadius: 1, mb: 0.5, transition: 'filter 0.2s' }}>
                    <img src="https://www.e-darmet.pl/darmet_logo_1.webp" alt="Darmet - Strona główna" style={{ height: 40, objectFit: "contain" }} />
                </Box>
                <Typography variant="caption" color="text.secondary" className="text-link" sx={{ transition: 'color 0.2s' }}>
                    wróć do strony głównej
                </Typography>
            </Box>
        </Link>
    );

    if (isMobile) {
        return (
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary">Filtry mobilne ściernic (w budowie)</Typography>
                    </Box>
                    <ClearButton onClick={onClearFilters} />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ width: 280, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <BrandLogo />
            <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
                <SectionTitle extra={<ClearButton onClick={onClearFilters} />}>
                    FILTROWANIE ŚCIERNIC
                </SectionTitle>

                <Box sx={{ mb: 2 }}>
                    {renderSearchFilter()}
                </Box>
                <Box sx={{ mb: 2 }}>
                    {renderTypeFilter()}
                </Box>
                <Box sx={{ mb: 2 }}>
                    {renderMaterialFilter()}
                </Box>
                
                <Box sx={{ mb: 2 }}>
                    {renderGritsFilter()}
                </Box>
            </Box>
        </Box>
    );
}