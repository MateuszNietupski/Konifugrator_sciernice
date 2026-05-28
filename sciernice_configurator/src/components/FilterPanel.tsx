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
import BondFilter from '../filters/bondFilter';
import LengthFilter from '../filters/lengthFilter';
import StepSliderFilter from '../filters/StepSliderFilter';
import { type GridFilterModel } from '@mui/x-data-grid';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { type NumericDimension, type DimensionConfigItem } from '../hooks/useFilters';

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
    bondOptions: string[];
    facetCounts: {
        Type: Record<string, number>;
        Grit: Record<number, number>;
        Material: Record<string, number>;
        Bond: Record<string, number>;
    };

    selectedTypes: string[];
    selectedGrits: number[];
    selectedMaterials: string[];
    selectedBonds: string[];
    searchModel: GridFilterModel;
    dimensions: Record<NumericDimension, DimensionConfigItem>;

    onSearchModelChange: (newValue: GridFilterModel) => void;
    onTypesChange: (types: string[]) => void;
    onGritsChange: (grits: number[]) => void;
    onMaterialsChange: (materials: string[]) => void;
    onBondsChange: (bonds: string[]) => void;
    onClearFilters: () => void;
    onDimensionChange: (field: NumericDimension, indices: [number, number], steps: number[]) => void;
}

export default function FilterPanel({
    abrasiveMaterials,
    facetCounts,
    selectedTypes,
    selectedGrits,
    gritOptions,
    selectedMaterials,
    selectedBonds,
    bondOptions,
    searchModel,
    dimensions,
    onTypesChange,
    onGritsChange,
    onMaterialsChange,
    onClearFilters,
    onSearchModelChange,
    onBondsChange,
    onDimensionChange,
}: FilterPanelProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    console.log('FilterPanel props debug:', {
    onDimensionChange: typeof onDimensionChange,
    onDimensionChangeValue: onDimensionChange,
    dimensions: dimensions,
});

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

    const {
        outerDiameter = { steps: [0], rangeIndices: [0, 0], currentValues: [0, 0], isActive: false },
        thickness = { steps: [0], rangeIndices: [0, 0], currentValues: [0, 0], isActive: false },
        boreSize = { steps: [0], rangeIndices: [0, 0], currentValues: [0, 0], isActive: false }
    } = dimensions || {};
    const renderSearchFilter = (size: 'small' | 'medium' = 'medium') => (
        <SearchFilter
            searchModel={searchModel}
            onSearchModelChange={onSearchModelChange}
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

    const renderBondFilter = (size: 'small' | 'medium' = 'medium') => (
        <BondFilter
            value={selectedBonds}
            options={bondOptions}
            onChange={onBondsChange}
            size={size}
            facetCounts={facetCounts.Bond}
        />
    );

    const renderDimensionSliders = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {outerDiameter && (
                <StepSliderFilter
                    label="Średnica / Długość"
                    steps={outerDiameter.steps}
                    currentRange={outerDiameter.rangeIndices}
                    onChange={(indices) => onDimensionChange('outerDiameter', indices, outerDiameter.steps)}
                />
            )}

            {thickness && (
                <StepSliderFilter
                    label="Grubość / Szerokość"
                    steps={thickness.steps}
                    currentRange={thickness.rangeIndices}
                    onChange={(indices) => onDimensionChange('thickness', indices, thickness.steps)}
                />
            )}

            {boreSize && (
                <StepSliderFilter
                    label="Otwór wewnętrzny"
                    steps={boreSize.steps}
                    currentRange={boreSize.rangeIndices}
                    onChange={(indices) => onDimensionChange('boreSize', indices, boreSize.steps)}
                />
            )}
        </Box>
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

    return (
        <Box sx={{
            width: 280,
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            flexShrink: 0,
        }}>
            <BrandLogo />
            <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
                <SectionTitle extra={<ClearButton onClick={onClearFilters} />}>
                    FILTROWANIE ŚCIERNIC
                </SectionTitle>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                    {renderSearchFilter()}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                    {renderTypeFilter()}
                </Box>
                <Divider sx={{ my: 2 }} />

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            px: 0.5,
                            minHeight: 0,
                            '& .MuiAccordionSummary-content': { my: 1 }
                        }}
                    >
                        <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5, px: 0.5 }}>
                            FILTRY MATERIAŁU
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0, pb: 1, pt: 0 }}>
                        <Box sx={{ mb: 3, mt: 2 }}>
                            {renderMaterialFilter()}
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            {renderGritsFilter()}
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            {renderBondFilter()}
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Divider sx={{ my: 2 }} />

                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            px: 0.5,
                            minHeight: 0,
                            '& .MuiAccordionSummary-content': { my: 1 }
                        }}
                    >
                        <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5, px: 0.5 }}>
                            FILTRY WYMIARU
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0.5, pb: 1, pt: 0 }}>
                        <Box sx={{ mb: 2, mt: 2 }}>
                            {renderDimensionSliders()}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box >
    );
}