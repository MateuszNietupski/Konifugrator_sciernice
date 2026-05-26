import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { plPL } from '@mui/x-data-grid/locales';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Zoom from '@mui/material/Zoom';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import CustomNoRowsOverlay from './CustomNowRowsOverlay';
import type { AbrasiveRow } from '../types/types';
import { getProductGridColumns } from './productGridColumns';

interface ProductGridDesktopProps {
    rows: AbrasiveRow[];
}

export default function ProductGridDesktop({ rows }: ProductGridDesktopProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [openImage, setOpenImage] = useState<AbrasiveRow | null>(null);
    const [imgLoading, setImgLoading] = useState<boolean>(true);

    const handleOpenImage = (row: AbrasiveRow) => {
        setImgLoading(true);
        setOpenImage(row);
    };

    const handleCloseImage = () => setOpenImage(null);

    const displayColumns = useMemo(() => {
        return getProductGridColumns({ isMobile, handleOpenImage });
    }, [isMobile]);

    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid

                rows={rows}
                columns={displayColumns}
                rowHeight={80}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                    sorting: { sortModel: [{ field: 'Length', sort: 'asc' }] },
                    columns: {
                        columnVisibilityModel: {
                            name: false,
                        }
                    }
                }}
                pageSizeOptions={[5, 10, 20, 50]}
                disableRowSelectionOnClick
                onCellClick={(params, event) => event.stopPropagation()}
                localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
                slots={{
                    noRowsOverlay: () => <CustomNoRowsOverlay />,
                }}
                sx={{
                    '& .no-focus-cell:focus, & .no-focus-cell:focus-within': {
                        outline: 'none !important',
                    },
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                        bgcolor: 'action.hover',
                        fontWeight: 700,
                    },
                    '& .MuiDataGrid-row:hover': {
                        bgcolor: 'rgba(228, 5, 5, 0.20)',
                    },
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'default',
                    },
                    minHeight: 400,
                    '& .MuiDataGrid-columnHeader[data-field="Title_URL"]': {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    '& .MuiDataGrid-columnHeader[data-field="Title_URL"] .MuiDataGrid-columnHeaderTitleContainer': {
                        display: 'none',
                    },
                    '& .MuiDataGrid-columnHeader[data-field="Title_URL"] .MuiDataGrid-menuIcon': {
                        visibility: 'visible',
                        width: 'auto',
                        margin: '0 auto',
                    },
                    '& .MuiDataGrid-columnHeader[data-field="Title_URL"] .MuiDataGrid-menuIconButton': {
                        opacity: 1,
                    },
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                        outline: 'none !important',
                    },
                }}
            />

            <Dialog
                open={Boolean(openImage)}
                onClose={handleCloseImage}
                maxWidth="md"
                TransitionComponent={Zoom}
                PaperProps={{
                    sx: {
                        bgcolor: 'transparent',
                        boxShadow: 'none',
                        overflow: 'visible',
                    }
                }}
            >
                <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <IconButton
                        onClick={handleCloseImage}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {imgLoading && (
                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    )}

                    <img
                        src={openImage?.imageUrl}
                        alt={openImage?.name || 'Podgląd ściernicy'}
                        onLoad={() => setImgLoading(false)}
                        onError={() => setImgLoading(false)}
                        style={{
                            maxWidth: '95vw',
                            maxHeight: '80vh',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                            padding: '10px',
                            display: imgLoading ? 'none' : 'block',
                            transition: 'opacity 0.3s ease',
                        }}
                    />

                    {openImage?.name && (
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mt: 1,
                                px: 2,
                                py: 0.5,
                                bgcolor: 'rgba(228, 5, 5, 0.8)',
                                color: '#fff',
                                borderRadius: 1,
                                fontWeight: 600,
                                textAlign: 'center',
                                maxWidth: '90vw',
                            }}
                        >
                            {openImage.name}
                        </Typography>
                    )}
                </Box>
            </Dialog>
        </Box>
    );
}