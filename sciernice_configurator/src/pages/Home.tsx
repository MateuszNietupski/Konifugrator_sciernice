import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Footer from "../components/Footer";
import FilterPanel from "../components/FilterPanel";
import { useFilters } from '../hooks/useFilters';
import type { AbrasiveRow } from '../types/types';
import MobileHeader from "../components/MobileHeader";
import DesktopHeader from "../components/DesktopHeader";
import ProductGridDesktop from "../components/AbrasivesDataGrid";
import ActiveFilters from "../components/ActiveFilters";


interface HomeProps {
    abrasives: AbrasiveRow[];
}

export default function Home({ abrasives }: HomeProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { state, results, handlers } = useFilters(abrasives);

    const filterProps = {
        abrasiveMaterials: results.abrasiveMaterials,
        wheelTypes: results.wheelTypes,
        gritOptions: results.gritOptions,
        bondOptions: results.bondOptions,
        usageOptions: results.usagesOptions,
        hardnessOptions: results.hardnessOptions,
        facetCounts: {
            Type: results.facetCounts.Type,
            Grit: results.facetCounts.Grit,
            Material: results.facetCounts.Material,
            Bond: results.facetCounts.Bond,
            Usage: results.facetCounts.Usage,
            Hardness: results.facetCounts.Hardness
        },

        selectedTypes: state.selectedTypes,
        selectedGrits: state.selectedGrits,
        selectedMaterials: state.selectedMaterials,
        selectedUsages: state.selectedUsages,
        selectedBonds: state.selectedBonds,
        selectedHardness: state.selectedHardness,
        searchModel: state.searchModel,
        dimensions: state.dimensions,

        onDimensionChange: handlers.setDimensionRange,
        onSearchModelChange: handlers.setSearchModel,
        onTypesChange: handlers.setSelectedTypes,
        onGritsChange: handlers.setSelectedGrits,
        onMaterialsChange: handlers.setSelectedMaterials,
        onHardnessChange: handlers.setSelectedHardness,
        onClearFilters: handlers.handleClearFilters,
        onBondsChange: handlers.setSelectedBonds,
        onUsagesChange: handlers.setSelectedUsages
    };
    const counts = {
        filtered: results.filteredWheels.length,
        total: abrasives.length
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{
                display: 'flex',
                flex: 1,
                flexDirection: isMobile ? 'column' : 'row',
                overflow: 'hidden'
            }}>
                {!isMobile && <FilterPanel {...filterProps} />}

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {isMobile ? (
                        <>
                            <MobileHeader
                                filteredCount={counts.filtered}
                                totalCount={counts.total}
                                viewMode="wheels"
                            />
                            <FilterPanel {...filterProps} />
                        </>
                    ) : (
                        <DesktopHeader
                            filteredCount={counts.filtered}
                            totalCount={counts.total}
                            viewMode="wheels"
                        />
                    )}

                    <Box sx={{ flex: 1, p: isMobile ? 1 : 2 }}>
                        <ActiveFilters
                            selectedTypes={state.selectedTypes}
                            selectedGrits={state.selectedGrits}
                            selectedBonds={state.selectedBonds}
                            selectedMaterials={state.selectedMaterials}
                            selectedUsages={state.selectedUsages}
                            selectedHardness={state.selectedHardness}
                            searchModel={state.searchModel}
                            dimensions={state.dimensions}
                            onRemoveDimensionFilter={handlers.removeDimensionFilter}
                            onRemoveHardness={handlers.removeSelectedHardness}
                            onRemoveSearchItem={handlers.removeSearchItem}
                            onRemoveType={handlers.removeSelectedType}
                            onRemoveGrit={handlers.removeSelectedGrit}
                            onRemoveMaterial={handlers.removeSelectedMaterial}
                            onRemoveBond={handlers.removeSelectedBond}
                            onRemoveUsage={handlers.removeSelectedUsage}
                            onClearAll={handlers.handleClearFilters}
                        />
                        <ProductGridDesktop
                            rows={results.filteredWheels}
                        />
                    </Box>
                </Box>
            </Box>
            <Footer />
        </Box>
    );
}