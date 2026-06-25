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
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

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
    const [_openApplications, setOpenApplications] = useState<AbrasiveRow | null>(null);
    const [selectedApplicationRow, setSelectedApplicationRow] = useState<AbrasiveRow | null>(null);
    const appDetails = selectedApplicationRow?.zastosowanie_detale;


    const handleOpenImage = (row: AbrasiveRow) => {
        setImgLoading(true);
        setOpenImage(row);
    };

    const handleCloseImage = () => setOpenImage(null);

    const displayColumns = useMemo(() => {
        return getProductGridColumns({ isMobile, handleOpenImage, setSelectedApplicationRow });
    }, [isMobile]);

    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid

                rows={rows}
                columns={displayColumns}
                rowHeight={80}
                initialState={{
                    pagination: { paginationModel: { pageSize: isMobile ? 10 : 20 } },
                    sorting: { sortModel: [{ field: 'Length', sort: 'asc' }] },
                    columns: {
                        columnVisibilityModel: {
                            name: false,
                        }
                    }
                }}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                disableRowSelectionOnClick
                onCellClick={(params, event) => {
                    event.stopPropagation();

                    if (params.field === 'applications' && params.row.zastosowanie_detale) {
                        setOpenApplications(params.row);
                    }
                }} localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
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
                    '& .clickable-app-cell': {
                        cursor: 'pointer !important',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        }
                    },
                    '& .clean-header:focus': { outline: 'none' },
                    '& .clean-header:focus-within': { outline: 'none' },
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

            {/* Dialog 2: Szczegóły Zastosowania (Pokazuje się tylko po kliknięciu w kolumnę applications) */}
            <Dialog
                open={Boolean(selectedApplicationRow)}
                onClose={() => setSelectedApplicationRow(null)}
                fullWidth
                maxWidth="sm"
                fullScreen={isMobile}
            >
                {appDetails && (
                    <>
                        <DialogTitle sx={{ pb: 1 }}>
                            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                                Zastosowanie
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ lineHeight: 1.2 }}>
                                {appDetails.grupa_glowna_nazwa}
                            </Typography>
                            {appDetails.popup_tekst?.naglowek_marketingowy && (
                                <Typography
                                    sx={{
                                        mt: 1, fontSize: 15, fontStyle: 'italic',
                                        color: 'primary.main', fontWeight: 500,
                                    }}
                                >
                                    {appDetails.popup_tekst.naglowek_marketingowy}
                                </Typography>
                            )}
                        </DialogTitle>

                        <DialogContent dividers>
                            {appDetails.popup_tekst?.ostrzezenie_krytyczne && (
                                <Box
                                    sx={{
                                        mb: 2, p: 1.5, borderRadius: 1,
                                        bgcolor: 'rgba(228,5,5,0.08)',
                                        borderLeft: '4px solid', borderColor: 'secondary.main',
                                        display: 'flex', gap: 1, alignItems: 'flex-start',
                                    }}
                                >
                                    <WarningAmberRoundedIcon sx={{ color: 'secondary.main', mt: '2px' }} />
                                    <Typography sx={{ fontSize: 13, color: 'secondary.dark', fontWeight: 500 }}>
                                        UWAGA! CZEGO UNIKAĆ: {appDetails.popup_tekst.ostrzezenie_krytyczne}
                                    </Typography>
                                </Box>
                            )}

                            {appDetails.popup_tekst?.lista_zastosowan?.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                                        Idealna do:
                                    </Typography>
                                    <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                                        {appDetails.popup_tekst.lista_zastosowan.map((item) => (
                                            <li key={item} style={{ marginBottom: 4, fontSize: 13 }}>{item}</li>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {appDetails.tagi_zastosowania?.length > 0 && (
                                <>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                                        Tagi i właściwości
                                    </Typography>
                                    <Stack direction="row" flexWrap="wrap" gap={0.75}>
                                        {appDetails.tagi_zastosowania.map((tag) => (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#EEF2F7',
                                                    color: 'primary.main',
                                                    border: '1px solid #D9DFE8',
                                                    fontWeight: 500,
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 2 }}>
                            <Button onClick={() => setSelectedApplicationRow(null)}>Zamknij</Button>
                            {selectedApplicationRow?.productLink && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href={selectedApplicationRow.productLink}
                                    target="_blank"
                                    rel="noopener"
                                >
                                    Przejdź do produktu
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

        </Box>
    );
}