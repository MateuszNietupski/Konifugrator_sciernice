import { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

export const HARDNESS_GROUPS = [
  { key: 'very-soft', label: 'Bardzo miękka', letters: ['E', 'F', 'G'],            color: '#90A4AE' },
  { key: 'soft',      label: 'Miękka',        letters: ['H', 'I', 'J'],            color: '#64B5F6' },
  { key: 'medium',    label: 'Średnia',       letters: ['K', 'L', 'M', 'N'],       color: '#4DB6AC' },
  { key: 'hard',      label: 'Twarda',        letters: ['O', 'P', 'Q'],            color: '#FFB74D' },
  { key: 'very-hard', label: 'Bardzo twarda', letters: ['R', 'S', 'T', 'U'],       color: '#E57373' },
];

export const getHardnessLabel = (letter: string): string => {
  for (const g of HARDNESS_GROUPS) if (g.letters.includes(letter)) return g.label;
  return 'Nieokreślona';
};

const HardnessFilter = ({
  value = [],
  onChange,
  facetCounts = {},
  title = 'Twardość',
}: {
  value?: string[];
  onChange: (value: string[]) => void;
  facetCounts?: Record<string, number>;
  title?: string;
}) => {
  const selectedSet = useMemo(() => new Set(value), [value]);
  const totalSelected = value.length;

  const toggleLetter = (letter: string, disabled: boolean) => {
    if (disabled) return;
    if (selectedSet.has(letter)) onChange(value.filter((v) => v !== letter));
    else onChange([...value, letter]);
  };

  const toggleGroup = (letters: string[], allSelected: boolean) => {
    const available = letters.filter((l) => (facetCounts[l] || 0) > 0);
    if (available.length === 0) return;
    if (allSelected) {
      onChange(value.filter((v) => !available.includes(v)));
    } else {
      onChange(Array.from(new Set([...value, ...available])));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight={700}>
          {title}
          {totalSelected > 0 && (
            <Typography component="span" variant="caption" sx={{ ml: 0.75, color: 'secondary.main', fontWeight: 700 }}>
              ({totalSelected})
            </Typography>
          )}
        </Typography>
        {totalSelected > 0 && (
          <Button
            size="small"
            onClick={() => onChange([])}
            sx={{ minWidth: 0, fontSize: 11, color: 'text.secondary' }}
          >
            Wyczyść
          </Button>
        )}
      </Box>

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          p: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {HARDNESS_GROUPS.map((group) => {
          const available = group.letters.filter((l) => (facetCounts[l] || 0) > 0);
          const groupSelected = group.letters.filter((l) => selectedSet.has(l));
          const allSelected = available.length > 0 && available.every((l) => selectedSet.has(l));
          const groupCount = group.letters.reduce((s, l) => s + (facetCounts[l] || 0), 0);
          const groupDisabled = available.length === 0;

          return (
            <Box key={group.key}>
              <Box
                onClick={() => toggleGroup(group.letters, allSelected)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  mb: 0.5,
                  cursor: groupDisabled ? 'default' : 'pointer',
                  opacity: groupDisabled ? 0.5 : 1,
                  userSelect: 'none',
                  '&:hover .group-label': { color: groupDisabled ? 'text.secondary' : 'primary.main' },
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: group.color, flex: '0 0 auto' }} />
                <Typography
                  className="group-label"
                  variant="caption"
                  sx={{
                    fontWeight: groupSelected.length > 0 ? 700 : 600,
                    color: groupSelected.length > 0 ? 'primary.main' : 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: 0.4,
                    fontSize: 10.5,
                    flex: 1,
                  }}
                >
                  {group.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: 10.5,
                  }}
                >
                  {groupCount}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {group.letters.map((letter) => {
                  const count = facetCounts[letter] || 0;
                  const isSelected = selectedSet.has(letter);
                  const isDisabled = count === 0 && !isSelected;

                  return (
                    <Tooltip
                      key={letter}
                      title={`${letter} — ${group.label}${count ? ` (${count})` : ' (brak)'}`}
                      arrow
                      disableInteractive
                    >
                      <Box
                        component="button"
                        type="button"
                        onClick={() => toggleLetter(letter, isDisabled)}
                        disabled={isDisabled}
                        sx={{
                          flex: '1 1 56px',
                          minWidth: 56,
                          maxWidth: 88,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          px: 0.75,
                          py: 0.5,
                          border: '1.5px solid',
                          borderColor: isSelected ? group.color : 'divider',
                          borderRadius: 1,
                          bgcolor: isSelected ? `${group.color}1F` : 'transparent',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.4 : 1,
                          transition: 'all 120ms',
                          font: 'inherit',
                          '&:hover': isDisabled ? {} : {
                            borderColor: group.color,
                            bgcolor: `${group.color}14`,
                          },
                          '&:focus-visible': {
                            outline: '2px solid',
                            outlineColor: group.color,
                            outlineOffset: 1,
                          },
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 900,
                            fontSize: 14,
                            lineHeight: 1,
                            color: isSelected ? group.color : 'text.primary',
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
    </Box>
  );
};

export default HardnessFilter;
