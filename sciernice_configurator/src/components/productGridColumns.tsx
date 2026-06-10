import { type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { materialDescriptions, materialColors, getGritHint, getWheelTypeName, wheelTypesData } from '../utils/abrasivesConsts';
import { BOND_FILTER_OPTIONS, getBondGroupId, getBondLabel, getBondDescription } from '../utils/filterGroups';
import type { AbrasiveRow } from '../types/types';

interface GetColumnsProps {
  isMobile: boolean;
  handleOpenImage: (row: AbrasiveRow) => void;
}

export const getProductGridColumns = ({ isMobile, handleOpenImage }: GetColumnsProps): GridColDef<AbrasiveRow>[] => [
  {
    field: "Image",
    disableColumnMenu: true,
    headerName: "Zdjęcie",
    renderHeader: () => null,
    flex: 1.4,
    sortable: false,
    width: isMobile ? 58 : 116,
    minWidth: isMobile ? 40 : 75,
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
              width: isMobile ? 48 : 90,
              height: isMobile ? 48 : 90,
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
    disableColumnMenu: true,
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
    disableColumnMenu: true,
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
          disableHoverListener={isMobile}
          enterTouchDelay={0}
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
    disableColumnMenu: true,
    headerName: "Śr/Dł(D/L)",
    description: "D - Średnica zewnętrzna (dla ściernic okrągłych) lub L - Długość (dla segmentów i osełek) w mm",
    flex: 0.8,
    minWidth: isMobile ? 80 : 110,
    headerAlign: 'center',
    align: 'center',
    type: 'number',
    valueGetter: (_value, row) => {
      return row.outerDiameter ?? row.outerDiameter ?? null;
    },
    renderCell: (params) => params.value !== null ? `${params.value} mm` : '—'
  },
  {
    field: "thickness",
    disableColumnMenu: true,
    headerName: "Gr./Szer.(T/B)",
    description: "T - Grubość (dla ściernic okrągłych) lub B - Szerokość (dla segmentów i osełek) w mm",
    flex: 1,
    minWidth: isMobile ? 80 : 120,
    headerAlign: 'center',
    align: 'center',
    type: 'number',
    valueGetter: (_value, row) => {
      return row.thickness ?? row.boreSize ?? null;
    },
    renderCell: (params) => params.value !== null ? `${params.value} mm` : '—'
  },
  {
    field: "boreSize",
    disableColumnMenu: true,
    headerName: "Otwór",
    description: "d – Średnica otworu wewnętrznego (dla ściernic tarczowych) lub średnica trzpienia (d dla ściernic trzpieniowych). Nie dotyczy osełek i segmentów.",
    flex: 1,
    minWidth: isMobile ? 70 : 80,
    headerAlign: 'center',
    align: 'center',
    type: 'number',
    valueGetter: (_value, row) => {
      return row.boreSize ?? null;
    },
    renderCell: (params) => params.value !== null ? `${params.value} mm` : '—'
  },
  {
    field: "gritSize",
    disableColumnMenu: true,
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    headerName: "Gradacja",
    minWidth: isMobile ? 80 : 90,
    type: "number",
    renderCell: (params) => {
      const gritValue = params.value;
      const hint = getGritHint(gritValue, isMobile);

      if (!hint) {
        return (
          <Box sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 500 }}>
            {gritValue}
          </Box>
        );
      }

      return (
        <Tooltip
          title={hint}
          arrow
          placement="top"
          disableHoverListener={isMobile}
          enterTouchDelay={0}
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
            textAlign: 'center',
          }}>
            {gritValue}
          </Typography>
        </Tooltip>
      );
    }
  },
  {
    field: "material",
    disableColumnMenu: true,
    headerName: "Materiał / Spoiwo",
    flex: 1.5,
    headerAlign: 'center',
    align: 'center',
    minWidth: isMobile ? 130 : 160,
    renderCell: (params) => {
      const materialName = params.value || '';
      const colors = materialColors[materialName] || { bg: '#F5F5F5', border: '#9E9E9E', text: '#616161' };
      const description = materialDescriptions[materialName] || 'Brak dodatkowego opisu.';

      // Pobieramy surowy kod spoiwa z bazy danych (np. "V", "BF", "G")
      const rawBondCode = (params.row.bond || '').trim().toUpperCase();

      const bondId = getBondGroupId(rawBondCode);
      const bondGroup = BOND_FILTER_OPTIONS.find(g => g.id === bondId);
      const bondColors = bondGroup?.colorConfig || { bg: '#616161', text: '#ffffff' };

      const bondLabelPl = bondGroup ? bondGroup.label : '';
      const bondDescription = bondGroup ? bondGroup.description : '';

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', px: 0.5, py: 0.5 }}>
          <Tooltip
            arrow
            placement="top"
            disableHoverListener={isMobile}
            enterTouchDelay={0}
            title={
              <Box sx={{ p: 0.5, textAlign: 'left', maxWidth: 260 }}>
                <Typography variant="caption" component="div" sx={{ fontWeight: 700, color: '#d45728', textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 10 }}>
                  Materiał
                </Typography>
                <Typography variant="caption" component="div" sx={{ mb: rawBondCode ? 0.75 : 0 }}>
                  <b>{materialName}</b> — {description}
                </Typography>
                {rawBondCode && (
                  <>
                    <Typography variant="caption" component="div" sx={{ fontWeight: 700, color: '#d45728', textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 10 }}>
                      Spoiwo
                    </Typography>
                    <Typography variant="caption" component="div">
                      <b>{rawBondCode} — {bondLabelPl}</b>{' '}
                    </Typography>
                    {bondDescription && (
                      <Typography variant="caption" component="div" sx={{ mt: 0.25, opacity: 0.9 }}>
                        {bondDescription}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            }
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: 'rgba(14,33,53,0.95)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  maxWidth: 280,
                  '& .MuiTooltip-arrow': { color: 'rgba(14,33,53,0.95)' },
                },
              },
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'stretch',
                minHeight: isMobile ? 32 : 36,
                maxWidth: '100%',
                borderRadius: '8px',
                overflow: 'hidden',
                border: `1px solid ${colors.border}`,
                bgcolor: colors.bg,
                cursor: 'help',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                transition: 'transform .12s ease, box-shadow .12s ease, filter .12s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  filter: 'brightness(1.03)',
                },
              }}
            >
              {/* Główna sekcja: Nazwa materiału (teraz po lewej stronie) */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 1,
                  py: 0.5,
                  color: colors.text,
                  fontWeight: 600,
                  fontSize: isMobile ? 11 : 12.5,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {materialName}
              </Box>

              {/* Sekcja drugorzędna: Litera spoiwa (teraz po prawej stronie jako domknięcie) */}
              {rawBondCode && (
                <Box
                  aria-label={`Spoiwo ${bondLabelPl}`}
                  sx={{
                    flex: '0 0 auto',
                    px: isMobile ? 0.8 : 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: bondColors.bg,
                    color: bondColors.text,
                    fontWeight: 800,
                    fontSize: isMobile ? 11 : 12,
                    lineHeight: 1,
                    letterSpacing: 0,
                    borderLeft: `1px solid ${colors.border}`, // Zmiana z borderRight na borderLeft
                  }}
                >
                  {rawBondCode}
                </Box>
              )}
            </Box>
          </Tooltip>
        </Box>
      );
    },
  },
  {
    field: "applications",
    disableColumnMenu: true,
    headerName: "Zastosowanie",
    flex: 1.5,
    minWidth: isMobile ? 120 : 130,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    cellClassName: 'clickable-app-cell',
    renderCell: (params) => {
      const details = params.row.zastosowanie_detale;

      if (!details?.grupa_glowna_nazwa) {
        return <Box sx={{ color: 'text.disabled' }}>—</Box>;
      }

      return (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            width: '100%',
            px: 1
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              color: 'primary.main', 
              fontSize: isMobile ? 11 : 13,
              textAlign: 'center',
              lineHeight: 1.2,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
              textUnderlineOffset: '3px',
              '&:hover': {
                color: 'primary.dark'
              }
            }}
          >
            {details.grupa_glowna_nazwa}
          </Typography>
        </Box>
      );
    }
  },
  {
    field: 'Title_URL',
    headerName: 'Link do produktu',
    renderHeader: () => null,
    minWidth: isMobile ? 90 : 160,
    flex: 1.1,
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