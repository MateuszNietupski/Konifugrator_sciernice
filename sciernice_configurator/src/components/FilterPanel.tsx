import React, { useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterListIcon from '@mui/icons-material/FilterList';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SearchFilter from '../filters/searchFilter';
import MaterialFilter from '../filters/materialFilter';
import GritsFilter from '../filters/gritsFilter';
import ShapeTypeFilter from '../filters/shapeTypeFilter';
import BondFilter from '../filters/bondFilter';
import StepSliderFilter from '../filters/StepSliderFilter';
import { type GridFilterModel } from '@mui/x-data-grid';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { type NumericDimension, type DimensionConfigItem } from '../hooks/useFilters';
import { buildTypeFilterGroups } from '../utils/filterGroups';
import UsageFilter from '../filters/usagesFilter';
import HardnessFilter from '../filters/hardnessFilter';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
    usageOptions: string[];
    gritOptions: number[];
    bondOptions: string[];
    hardnessOptions: string[];
    facetCounts: {
        Type: Record<string, number>;
        Grit: Record<number, number>;
        Material: Record<string, number>;
        Bond: Record<string, number>;
        Usage: Record<string, number>;
        Hardness: Record<string, number>;
    };

    selectedTypes: string[];
    selectedGrits: number[];
    selectedUsages: string[];
    selectedMaterials: string[];
    selectedBonds: string[];
    selectedHardness: string[];
    searchModel: GridFilterModel;
    dimensions: Record<NumericDimension, DimensionConfigItem>;

    onSearchModelChange: (newValue: GridFilterModel) => void;
    onTypesChange: (types: string[]) => void;
    onGritsChange: (grits: number[]) => void;
    onMaterialsChange: (materials: string[]) => void;
    onBondsChange: (bonds: string[]) => void;
    onClearFilters: () => void;
    onDimensionChange: (field: NumericDimension, indices: [number, number], steps: number[]) => void;
    onUsagesChange: (usages: string[]) => void;
    onHardnessChange: (hardness: string[]) => void;
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
    usageOptions,
    selectedUsages,
    hardnessOptions,
    selectedHardness,
    onTypesChange,
    onGritsChange,
    onMaterialsChange,
    onClearFilters,
    onSearchModelChange,
    onBondsChange,
    onDimensionChange,
    onUsagesChange,
    onHardnessChange
}: FilterPanelProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fabRef = useRef<HTMLButtonElement>(null);

    const handlePanelScroll = () => {
        const scrolled = (scrollRef.current?.scrollTop ?? 0) > 300;
        if (fabRef.current) {
            fabRef.current.style.opacity = scrolled ? '1' : '0';
            fabRef.current.style.pointerEvents = scrolled ? 'auto' : 'none';
        }
    };

    const {
        outerDiameter = { steps: [0], rangeIndices: [0, 0], currentValues: [0, 0], isActive: false },
        thickness = { steps: [0], rangeIndices: [0, 0], currentValues: [0, 0], isActive: false },
        boreSize = { steps: [0], rangeIndices: [0, 0], currentValues: [0, 0], isActive: false }
    } = dimensions || {};

    const activeFiltersCount =
        selectedTypes.length +
        selectedGrits.length +
        selectedMaterials.length +
        selectedBonds.length +
        (searchModel.items?.[0]?.value ? 1 : 0);

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

    const renderTypeFilter = () => (
        <ShapeTypeFilter
            value={selectedTypes}
            groups={buildTypeFilterGroups()}
            onChange={onTypesChange}
            facetCounts={facetCounts.Type || {}}
            title="Typ ściernicy"
            defaultExpanded={[]}
        />
    );

    const renderGritsFilter = () => (
        <GritsFilter
            value={selectedGrits}
            options={gritOptions}
            onChange={onGritsChange}
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

    const renderUsagesFilter = (size: 'small' | 'medium' = 'medium') => (
        <UsageFilter
            value={selectedUsages}
            options={usageOptions}
            onChange={onUsagesChange}
            size={size}
            facetCounts={facetCounts.Usage}
        />
    );

    const renderHardnessFilter = () => (
        <HardnessFilter
            value={selectedHardness}
            onChange={onHardnessChange}
            options={hardnessOptions}
            facetCounts={facetCounts.Hardness}
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
            <>
                <Box sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    p: 1.5,
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'center'
                }}>
                    <Box sx={{ flex: 1 }}>
                        {renderSearchFilter('small')}
                    </Box>
                    <Button
                        variant={activeFiltersCount > 0 ? "contained" : "outlined"}
                        startIcon={<FilterListIcon />}
                        onClick={() => setMobileOpen(true)}
                        size="medium"
                        sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                    >
                        Filtry {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
                    </Button>
                </Box>

                <Drawer
                    anchor="left"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    PaperProps={{
                        sx: { width: '85vw', maxWidth: 320, display: 'flex', flexDirection: 'column' }
                    }}
                >
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle1" fontWeight={700}>Filtrowanie ściernic</Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {activeFiltersCount > 0 && <ClearButton onClick={onClearFilters} />}
                            <IconButton onClick={() => setMobileOpen(false)} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ px: 0.5, minHeight: 0, '& .MuiAccordionSummary-content': { my: 1 } }}
                            >
                                <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ px: 0.5 }}>
                                    FILTRY MATERIAŁU
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 0, pb: 1, pt: 0 }}>
                                <Box sx={{ mb: 2 }}>
                                    {renderTypeFilter()}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Divider sx={{ my: 2 }} />

                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ px: 0.5, minHeight: 0, '& .MuiAccordionSummary-content': { my: 1 } }}
                            >
                                <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ px: 0.5 }}>
                                    FILTRY MATERIAŁU
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 0, pb: 1, pt: 0 }}>
                                <Box sx={{ mb: 3, mt: 2 }}>{renderGritsFilter()}</Box>
                                <Box sx={{ mb: 3 }}>{renderMaterialFilter()}</Box>
                                <Box sx={{ mb: 3 }}>{renderHardnessFilter()}</Box>
                                <Box sx={{ mb: 3 }}>{renderBondFilter()}</Box>
                            </AccordionDetails>
                        </Accordion>
                        <Divider sx={{ my: 2 }} />

                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ px: 0.5, minHeight: 0, '& .MuiAccordionSummary-content': { my: 1 } }}
                            >
                                <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ px: 0.5 }}>
                                    FILTRY WYMIARU
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 0.5, pb: 1, pt: 0 }}>
                                <Box sx={{ mb: 2, mt: 2 }}>{renderDimensionSliders()}</Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setMobileOpen(false)}
                            sx={{ textTransform: 'none' }}
                        >
                            Pokaż wyniki
                        </Button>
                    </Box>
                </Drawer>
            </>
        );
    }

    return (
        <Box sx={{
            width: 280,
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'sticky',
            top: 0,
            flexShrink: 0,
        }}>
            <BrandLogo />
            <Box
                ref={scrollRef}
                onScroll={handlePanelScroll}
                sx={{
                    p: 2.5,
                    flex: 1,
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#0e2135 #e0e0e0',

                    '&::-webkit-scrollbar': {
                        width: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                        bgcolor: '#f0f0f0',
                        borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        bgcolor: '#0e2135',
                        borderRadius: 4,
                        '&:hover': { bgcolor: '#1a3a5c' }
                    },

                }}>
                <SectionTitle extra={<ClearButton onClick={onClearFilters} />}>
                    FILTROWANIE ŚCIERNIC
                </SectionTitle>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                    {renderSearchFilter()}
                </Box>
                <Box sx={{ mb: 2 }}>
                    {renderUsagesFilter()}
                </Box>
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
                        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1.5, px: 0.5 }}>
                            TYPY ŚCIERNIC
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0, pb: 1, pt: 0 }}>
                        <Box sx={{ mb: 2 }}>
                            {renderTypeFilter()}
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
                        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1.5, px: 0.5 }}>
                            FILTRY MATERIAŁU
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0, pb: 1, pt: 0 }}>
                        <Box sx={{ mb: 3, mt: 2 }}>
                            {renderGritsFilter()}
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            {renderHardnessFilter()}
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            {renderMaterialFilter()}
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
                        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1.5, px: 0.5 }}>
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
            <Fab
                ref={fabRef}
                size="small"
                onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    opacity: 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.2s',
                }}
                aria-label="Na górę panelu"
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Box >
    );
}