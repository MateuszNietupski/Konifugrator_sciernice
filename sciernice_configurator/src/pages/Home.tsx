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
        facetCounts: {
            Type: results.facetCounts.Type,
            Grit: results.facetCounts.Grit,
            Material: results.facetCounts.Material
        },


        selectedTypes: state.selectedTypes,
        selectedGrits: state.selectedGrits,
        gritOptions: results.gritOptions,
        lengthRange: state.lengthRange,
        lengthSteps: state.lengthSteps,
        abrasiveSearch: state.abrasiveSearch,
        selectedMaterials: state.selectedMaterials,

        onTypesChange: handlers.setSelectedTypes,
        onGritsChange: handlers.setSelectedGrits,
        onLengthChange: handlers.setLengthRange,
        onMaterialsChange: handlers.setSelectedMaterials,
        onClearFilters: handlers.handleClearFilters,
        onSearchChange: handlers.setAbrasiveSearch,
        onAbrasiveSearchChange: handlers.setAbrasiveSearch
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