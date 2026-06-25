import { useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ANDRE_RED = '#e40505';

const HARDNESS_GROUP_DEFS = [
  {
    key: 'very-soft',
    label: 'Bardzo miękka',
    letters: ['E', 'F', 'G'],
    hint: 'Spoiwo bardzo łatwo uwalnia zużyte ziarna. Stosowana do szlifowania twardych i kruchych materiałów, gdzie ściernica musi się samoostrzyć.',
  },
  {
    key: 'soft',
    label: 'Miękka',
    letters: ['H', 'I', 'J'],
    hint: 'Dobre samoostrzenie przy obróbce twardych stali i stopów. Mniejsze nagrzewanie materiału niż w klasach twardych.',
  },
  {
    key: 'medium',
    label: 'Średnia',
    letters: ['K', 'L', 'M', 'N'],
    hint: 'Klasa najczęściej stosowana. Kompromis między trwałością ściernicy a zdolnością do samoostrzenia. Odpowiednia do większości stali.',
  },
  {
    key: 'hard',
    label: 'Twarda',
    letters: ['O', 'P', 'Q'],
    hint: 'Ziarna są dłużej utrzymywane przez spoiwo. Do szlifowania miękkich materiałów i dużych powierzchni kontaktu.',
  },
  {
    key: 'very-hard',
    label: 'Bardzo twarda',
    letters: ['R', 'S', 'T', 'U'],
    hint: 'Minimalne zużycie ściernicy. Stosowana do szlifowania bardzo miękkich materiałów lub przy wąskiej linii kontaktu.',
  },
] as const;

const HardnessFilter = ({
  value = [],
  onChange,
  options = [],
  facetCounts = {},
  title = 'Klasy twardości',
}: {
  value?: string[];
  onChange: (value: string[]) => void;
  options?: string[];
  facetCounts?: Record<string, number>;
  title?: string;
}) => {
  const selectedSet = useMemo(() => new Set(value), [value]);
  const optionsSet = useMemo(() => new Set(options), [options]);
  const [expanded, setExpanded] = useState(true);

  const visibleGroups = useMemo(
    () => HARDNESS_GROUP_DEFS.filter(g => g.letters.some(l => optionsSet.has(l))),
    [optionsSet]
  );

  const toggleLetter = (letter: string, disabled: boolean) => {
    if (disabled) return;
    if (selectedSet.has(letter)) onChange(value.filter(v => v !== letter));
    else onChange([...value, letter]);
  };

  const toggleGroup = (letters: readonly string[], allSelected: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const available = letters.filter(l => optionsSet.has(l) && (facetCounts[l] || 0) > 0);
    if (available.length === 0) return;
    if (allSelected) onChange(value.filter(v => !available.includes(v)));
    else onChange(Array.from(new Set([...value, ...available])));
  };

  return (
    <Accordion
      
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      disableGutters
      elevation={0}
      sx={{
        border: 'none',
        background: 'transparent',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
        sx={{
          padding: '0 8px',
          minHeight: '40px !important',
          '& .MuiAccordionSummary-content': {
            margin: '8px 0 !important',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            pr: 1,
          },
        }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ flex: 1 }}>
          {title}
          {value.length > 0 && (
            <Typography component="span" variant="caption" sx={{ ml: 0.75, color: ANDRE_RED, fontWeight: 700 }}>
              ({value.length})
            </Typography>
          )}
        </Typography>

        {value.length > 0 && (
          <Button
            size="small"
            onClick={(e) => { e.stopPropagation(); onChange([]); }}
            sx={{ minWidth: 0, fontSize: 11, color: 'text.secondary', mr: 0.5 }}
          >
            Wyczyść
          </Button>
        )}
      </AccordionSummary>

      <AccordionDetails sx={{ padding: '8px 0 8px 0' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {visibleGroups.map((group) => {
            const visibleLetters = group.letters.filter(l => optionsSet.has(l));
            const available = visibleLetters.filter(l => (facetCounts[l] || 0) > 0);
            const groupSelected = visibleLetters.filter(l => selectedSet.has(l));
            const allSelected = available.length > 0 && available.every(l => selectedSet.has(l));
            const groupCount = visibleLetters.reduce((s, l) => s + (facetCounts[l] || 0), 0);
            const groupDisabled = available.length === 0;
            const isGroupActive = groupSelected.length > 0;

            return (
              <Box key={group.key} sx={{ opacity: groupDisabled ? 0.45 : 1 }}>
                <Box
                  onClick={(e) => !groupDisabled && toggleGroup(group.letters, allSelected, e)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mb: 0.5,
                    px: 1,
                    cursor: groupDisabled ? 'default' : 'pointer',
                    userSelect: 'none',
                    '&:hover .group-label': {
                      color: groupDisabled ? 'text.secondary' : ANDRE_RED,
                    },
                  }}
                >
                  <Typography
                    className="group-label"
                    variant="caption"
                    sx={{
                      fontWeight: isGroupActive ? 700 : 500,
                      color: isGroupActive ? ANDRE_RED : 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: 0.4,
                      fontSize: 10.5,
                      flex: 1,
                      transition: 'color 0.15s',
                    }}
                  >
                    {group.label}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums', fontSize: 10.5 }}
                  >
                    ({groupCount})
                  </Typography>

                  <Tooltip
                    title={group.hint}
                    arrow
                    placement="left"
                    slotProps={{
                      popper: { onClick: (e) => e.stopPropagation() },
                      tooltip: {
                        sx: {
                          bgcolor: 'rgba(14, 33, 53, 0.9)',
                          color: '#fff',
                          fontSize: '0.72rem',
                          maxWidth: 220,
                        },
                      },
                    }}
                  >
                    <HelpOutlineIcon
                      onClick={(e) => e.stopPropagation()}
                      sx={{ fontSize: 13, color: 'action.disabled', cursor: 'help', flexShrink: 0 }}
                    />
                  </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 1, mb: 0.5 }}>
                  {visibleLetters.map((letter) => {
                    const count = facetCounts[letter] || 0;
                    const isSelected = selectedSet.has(letter);
                    const isDisabled = count === 0 && !isSelected;

                    return (
                      <Tooltip
                        key={letter}
                        title={count ? `${letter} (${count})` : `${letter} — brak produktów`}
                        arrow
                        disableInteractive
                        placement="top"
                      >
                        <Box
                          component="button"
                          type="button"
                          onClick={() => toggleLetter(letter, isDisabled)}
                          disabled={isDisabled}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.4,
                            px: 0.75,
                            py: 0.4,
                            border: '1.5px solid',
                            borderColor: isSelected ? ANDRE_RED : 'divider',
                            borderRadius: 0.75,
                            bgcolor: isSelected ? 'rgba(228,5,5,0.07)' : 'transparent',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            opacity: isDisabled ? 0.35 : 1,
                            transition: 'border-color 120ms, background-color 120ms',
                            font: 'inherit',
                            '&:hover': isDisabled ? {} : {
                              borderColor: ANDRE_RED,
                              bgcolor: 'rgba(228,5,5,0.05)',
                            },
                            '&:focus-visible': {
                              outline: `2px solid ${ANDRE_RED}`,
                              outlineOffset: 1,
                            },
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 800,
                              fontSize: 14,
                              lineHeight: 1,
                              color: isSelected ? ANDRE_RED : 'text.primary',
                              letterSpacing: 0.5,
                            }}
                          >
                            {letter}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: 11,
                              lineHeight: 1,
                              color: 'text.secondary',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {count}
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default HardnessFilter;