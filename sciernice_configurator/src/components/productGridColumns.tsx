import { type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { materialDescriptions, materialColors, getWheelTypeName, wheelTypesData } from '../utils/abrasivesConsts';
import { getGritHint } from '../utils/gritDataConsts';
import { BOND_FILTER_OPTIONS, getBondGroupId } from '../utils/filterGroups';
import type { AbrasiveRow } from '../types/types';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {getHardnessLabel} from '../utils/abrasivesConsts';

interface GetColumnsProps {
  isMobile: boolean;
  handleOpenImage: (row: AbrasiveRow) => void;
  setSelectedApplicationRow: (row: AbrasiveRow | null) => void;
}

export const getProductGridColumns = ({ isMobile, handleOpenImage, setSelectedApplicationRow }: GetColumnsProps): GridColDef<AbrasiveRow>[] => [
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
    headerClassName: 'clean-header',
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
    flex: 1.5,
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
    minWidth: isMobile ? 80 : 100,
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
    minWidth: isMobile ? 70 : 70,
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
    minWidth: isMobile ? 80 : 85,
    type: "number",
    renderCell: (params) => {
      const gritValue = params.value;
      const hint = getGritHint(gritValue);

      if (!hint) {
        return (
          <Box sx={{ fontSize: isMobile ? 11 : 13, fontWeight: 650 }}>
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
    headerName: "Charakterystyka",
    flex: 1.8,
    headerAlign: 'center',
    align: 'center',
    minWidth: isMobile ? 130 : 185,
    renderCell: (params) => {
      const materialName = params.value || '';
      const colors = materialColors[materialName] || { bg: '#F5F5F5', border: '#9E9E9E', text: '#616161' };
      const description = materialDescriptions[materialName] || 'Brak dodatkowego opisu.';
      const hardness = (params.row.hardness || '').trim().toUpperCase();
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
                {hardness && (
                  <>
                    <Typography variant="caption" component="div" sx={{ fontWeight: 700, color: '#f7571e', textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 10 }}>
                      Twardość ściernicy
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ mb: 0.75, fontWeight: 700, fontSize: 14 }}>
                      Klasa twardości: <b>{hardness} - {getHardnessLabel(hardness)}</b>
                    </Typography>
                  </>
                )}
                <Typography variant="caption" component="div" sx={{ fontWeight: 700, color: '#f7571e', textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 10 }}>
                  Materiał
                </Typography>
                <Typography variant="caption" component="div" sx={{ mb: rawBondCode ? 0.75 : 0 }}>
                  <b>{materialName}</b> — {description}
                </Typography>
                {rawBondCode && (
                  <>
                    <Typography variant="caption" component="div" sx={{ fontWeight: 700, color: '#f7571e', textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 10 }}>
                      Spoiwo
                    </Typography>
                    <Typography variant="caption" component="div">
                      <b>{rawBondCode} — {bondLabelPl}</b>
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
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.75,
                  px: 1,
                  py: 0.5,
                  color: colors.text,
                  fontWeight: 600,
                  fontSize: isMobile ? 11 : 12.5,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                }}
              >
                {hardness && (
                  <Box
                    component="span"
                    aria-label={`Twardość ${hardness}`}
                    sx={{
                      flex: '0 0 auto',
                      fontWeight: 900,
                      fontSize: isMobile ? 14 : 16,
                      lineHeight: 1,
                      color: colors.text,
                      letterSpacing: 0.5,
                      opacity: 0.95,
                      borderRight: `1px solid ${colors.border}`,
                      pr: 0.75,
                    }}
                  >
                    {hardness}
                  </Box>
                )}
                <Box
                  component="span"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {materialName}
                </Box>
              </Box>

              {rawBondCode && (
                <Box
                  aria-label={`Spoiwo ${bondLabelPl}`}
                  sx={{
                    flex: '0 0 auto',
                    px: isMobile ? 0.9 : 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: bondColors.bg,
                    color: bondColors.text,
                    fontWeight: 800,
                    fontSize: isMobile ? 11 : 12,
                    lineHeight: 1,
                    borderLeft: `1px solid ${colors.border}`,
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
    minWidth: isMobile ? 140 : 140,
    headerAlign: 'center',
    align: 'center',
    sortable: true,
    sortComparator: (v1, v2) => {
      return (v1 || '').localeCompare(v2 || '', 'pl');
    },
    valueGetter: (_value, row) => {
      return row.zastosowanie_detale?.grupa_glowna_nazwa || '';
    }, cellClassName: 'clickable-app-cell',
    renderCell: (params) => {
      const details = params.row.zastosowanie_detale;
      if (!details?.grupa_glowna_nazwa) {
        return <Box sx={{ color: 'text.disabled' }}>—</Box>;
      }

      const tags = details.tagi_zastosowania || [];
      const visibleTags = tags.slice(0, 2);
      const restCount = Math.max(0, tags.length - visibleTags.length);
      const hasWarning = Boolean(details.popup_tekst.ostrzezenie_krytyczne);

      return (
        <Box
          onClick={() => setSelectedApplicationRow(params.row)}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 0.5,
            px: 1,
            py: 0.75,
            cursor: 'pointer',
            borderRadius: 1,
            transition: 'background-color .12s, transform .12s',
            '&:hover': {
              bgcolor: 'rgba(228,5,5,0.05)',
              '& .app-info-icon': { opacity: 1 },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: isMobile ? 11 : 13,
                color: 'primary.main',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
                flex: 1,
                textAlign: 'left',
              }}
            >
              {details.grupa_glowna_nazwa}
            </Typography>
            {hasWarning && (
              <Tooltip
                title={
                  <Box sx={{ p: 0.5, maxWidth: 250 }}>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{ fontWeight: 800, color: '#f7571e', mb: 0.5, textTransform: 'uppercase', fontSize: 10 }}
                    >
                      Uwaga! Czego unikać:
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ lineHeight: 1.3, fontWeight: 500 }}>
                      {hasWarning ? details.popup_tekst.ostrzezenie_krytyczne : 'Brak krytycznych ostrzeżeń.'}
                    </Typography>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{ mt: 1, pt: 0.5, borderTop: '1px solid rgba(255,255,255,0.2)', opacity: 0.7, fontStyle: 'italic' }}
                    >
                      Kliknij po pełne szczegóły
                    </Typography>
                  </Box>
                }
                arrow
                placement="top"
                disableHoverListener={isMobile}
                enterTouchDelay={0}
              >
                <WarningAmberRoundedIcon
                  sx={{
                    fontSize: { xs: 16, md: 19 },
                    color: 'secondary.main',
                    flexShrink: 0,
                    animation: 'pulse 2s infinite ease-in-out',
                  }}
                />
              </Tooltip>
            )}
          </Box>

          {(visibleTags.length > 0 || restCount > 0) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, alignItems: 'center' }}>
              {visibleTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 10,
                    fontWeight: 500,
                    bgcolor: '#EEF2F7',
                    color: 'primary.main',
                    border: '1px solid #D9DFE8',
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              ))}
              {restCount > 0 && (
                <Typography sx={{ fontSize: 10, fontWeight: 600, color: 'text.secondary' }}>
                  +{restCount}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      );
    },
  },

  {
    field: 'Title_URL',
    headerName: 'Link do produktu',
    renderHeader: () => null,
    minWidth: isMobile ? 90 : 140,
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