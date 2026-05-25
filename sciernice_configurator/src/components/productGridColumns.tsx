import { type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { materialDescriptions, materialColors, getGritHint, getWheelTypeName, wheelTypesData } from '../utils/abrasivesConsts';
import { getBondGroupId, getBondLabel, getBondDescription } from '../utils/filterGroups';
import type { AbrasiveRow } from '../types/types';

interface GetColumnsProps {
  isMobile: boolean;
  handleOpenImage: (row: AbrasiveRow) => void;
}

export const getProductGridColumns = ({ isMobile, handleOpenImage }: GetColumnsProps): GridColDef<AbrasiveRow>[] => [
  {
    field: "Image",
    headerName: '',
    flex: 1,
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
    minWidth: isMobile ? 140 : 140,
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
    field: 'type',
    headerName: 'Typ ściernicy',
    flex: 1,
    headerAlign: 'center' as const,
    align: 'center' as const,
    minWidth: isMobile ? 110 : 120,
    renderCell: (params: GridRenderCellParams<AbrasiveRow>) => {
      const typ = params.value;
      return (
        <Tooltip
          title={wheelTypesData[typ]?.desc ?? ''}
          arrow
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
          <Typography sx={{
            fontSize: isMobile ? 11 : 13,
            fontWeight: 500,
            cursor: 'help',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            textAlign: 'center',
            lineHeight: 1.2,
          }}>
            {getWheelTypeName(typ)}
          </Typography>
        </Tooltip>
      );
    },
  },

  {
    field: "outerDimension",
    headerName: "Śr/Dł(D/L)",
    description: "D - Średnica zewnętrzna (dla ściernic okrągłych) lub L - Długość (dla segmentów i osełek) w mm",
    flex: 0.8,
    minWidth: 120,
    headerAlign: 'center',
    align: 'center',
    type: 'number',
    valueGetter: (value, row) => {
      return row.outerDiameter ?? row.outerDiameter ?? null;
    },
    renderCell: (params) => params.value !== null ? `${params.value} mm` : '—'
  },
  {
    field: "thickness",
    headerName: "Gr./Szer.(T/B)",
    description: "T - Grubość (dla ściernic okrągłych) lub B - Szerokość (dla segmentów i osełek) w mm",
    flex: 1,
    minWidth: 120,
    headerAlign: 'center',
    align: 'center',
    type: 'number',
    valueGetter: (value, row) => {
      return row.thickness ?? row.boreSize ?? null;
    },
    renderCell: (params) => params.value !== null ? `${params.value} mm` : '—'
  },
  {
    field: "boreSize",
    headerName: "Otwór",
    description: "d - Średnica otworu wewnętrznego w mm (nie dotyczy segmentów, osełek i ściernic trzpieniowych)",
    flex: 1,
    minWidth: 80,
    headerAlign: 'center',
    align: 'center',
    type: 'number',
    valueGetter: (value, row) => {
      return row.boreSize ?? null;
    },
    renderCell: (params) => params.value !== null ? `${params.value} mm` : '—'
  },

  { field: "gritSize", flex: 1, headerAlign: 'center', align: 'center', headerName: "Gradacja", minWidth: 100, type: "number", renderCell: (params) => `${params.value}` },
  {
    field: "material",
    headerName: "Materiał",
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    minWidth: isMobile ? 100 : 130,
    renderCell: (params) => {
      const materialName = params.value || '';
      const colors = materialColors[materialName] || { bg: '#F5F5F5', border: '#9E9E9E', text: '#616161' };
      const description = materialDescriptions[materialName] || 'Brak dodatkowego opisu.';

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Tooltip
            title={description}
            arrow
            disableHoverListener={!description}
            disableFocusListener={!description}
            disableTouchListener={!description}
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
              size="small"
              icon={
                <Box sx={{
                  width: isMobile ? 6 : 8,
                  height: isMobile ? 6 : 8,
                  borderRadius: '50%',
                  bgcolor: colors.text,
                  ml: '6px !important',
                  mr: '-4px !important',
                  flexShrink: 0
                }} />
              }
              label={materialName}
              sx={{
                cursor: description ? 'help' : 'default',
                bgcolor: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                fontWeight: 600,
                borderRadius: '6px',
                fontSize: isMobile ? 11 : 12,
                height: 'auto',
                py: 0.4,
                '& .MuiChip-label': {
                  whiteSpace: 'normal',
                  textAlign: 'center',
                  lineHeight: 1.1,
                  pl: '8px',
                  pr: '8px'
                }
              }}
            />
          </Tooltip>
        </Box>
      );
    },
  },
  {
    field: "bond",
    headerName: "Spoiwo",
    description: "Rodzaj spoiwa zastosowanego w ściernicy",
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    minWidth: 130,
    valueGetter: (value, row) => {
      return getBondGroupId(row.bond || '');
    },
    renderCell: (params) => {
      const bondId = params.value;
      if (!bondId) return '—';

      const label = getBondLabel(bondId);
      const description = getBondDescription(bondId);

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Tooltip
            title={description}
            arrow
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
              size="small"
              label={label}
              sx={{
                cursor: 'help',
                bgcolor: '#E3F2FD',
                color: '#0D47A1',
                border: '1px solid #BBDEFB',
                fontWeight: 600,
                borderRadius: '6px',
                fontSize: isMobile ? 11 : 12,
                height: 'auto',
                py: 0.4,
                '& .MuiChip-label': {
                  whiteSpace: 'normal',
                  textAlign: 'center',
                  lineHeight: 1.1,
                }
              }}
            />
          </Tooltip>
        </Box>
      );
    }
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