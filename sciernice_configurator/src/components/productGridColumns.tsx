import { type GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import StorefrontIcon from '@mui/icons-material/Storefront';

import type { AbrasiveRow } from '../types/types';
interface GetColumnsProps {
  isMobile: boolean;
  handleOpenImage: (row: AbrasiveRow) => void;
}

export const getProductGridColumns = ({ isMobile, handleOpenImage }: GetColumnsProps): GridColDef<AbrasiveRow>[] => [
  {
    field: "Image",
    headerName: "Ściernica",
    flex: 1.5,
    sortable: false,
    width: isMobile ? 58 : 116,
    headerAlign: 'center',
    align: 'center',
    cellClassName: 'no-focus-cell',
    renderCell: (params) => {
      const imgUrl = params.row.imageUrl;
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Avatar
            variant="rounded"
            src={imgUrl}
            onClick={(e) => {
              e.stopPropagation();
              if (imgUrl) handleOpenImage(params.row);
            }}
            slotProps={{
              img: {
                alt: params.row.name || 'Zdjęcie ściernicy',
                loading: 'lazy',
              },
            }}
            sx={{
              width: isMobile ? 48 : 100,
              height: isMobile ? 48 : 100,
              cursor: imgUrl ? 'zoom-in' : 'default',
              '& img': { objectFit: 'contain', p: 0 }
            }}
          />
        </Box>
      );
    },
  },
  {
    field: 'name',
    headerName: 'Nazwa',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    minWidth: isMobile ? 140 : 160,
     renderCell: (params) => (
                <Box sx={{
                    fontSize: isMobile ? 11 : 14,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {params.value}
                </Box>
            ),
  },
 
  {
    field: 'Title_URL',
    headerName: '',
    minWidth: isMobile ? 100 : 200,
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Button
        variant="outlined"
        size="small"
        color="primary"
        startIcon={<StorefrontIcon />}
        component="a"
        href={params.row.productLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title={`Ściernica  - ${params.row.name}`}
        aria-label={`Sprawdź cenę ściernicy ${params.row.name} w sklepie`}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          fontSize: isMobile ? 10 : 12,
        }}
      >
        {isMobile ? "Sklep" : "Sprawdź cenę"}
      </Button>
    ),
  }
];