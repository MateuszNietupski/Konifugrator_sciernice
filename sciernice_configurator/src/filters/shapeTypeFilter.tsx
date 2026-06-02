import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import { wheelTypesData } from '../utils/abrasivesConsts';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface LeafTypeNode {
  value: string;
  label: string;
}

interface SubtypeNode {
  key: string;
  label: string;
  children: LeafTypeNode[];
}

interface GroupNode {
  key: string;
  label: string;
  children: SubtypeNode[];
}

interface TypeFilterProps {
  value: string[];
  groups: GroupNode[];
  onChange: (newValue: string[]) => void;
  facetCounts?: Record<string, number>;
  title?: string;
  defaultExpanded?: string[];
}

const ShapeTypeFilter = ({
  value = [],
  groups = [],
  onChange,
  facetCounts = {},
  title = "Typ ściernicy",
  defaultExpanded = []
}: TypeFilterProps) => {

  const [expandedGroups, setExpandedGroups] = useState<string[]>(defaultExpanded);

  const handleAccordionToggle = (groupKey: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedGroups(prev =>
      isExpanded ? [...prev, groupKey] : prev.filter(key => key !== groupKey)
    );
  };

  // Logika kliknięcia w podtyp (obsługuje tablicę dzieci typu LeafTypeNode)
  const handleSubtypeToggle = (leafNodes: LeafTypeNode[]) => {
    const leafValues = leafNodes.map(node => node.value);
    const allSelected = leafValues.every(v => value.includes(v));
    let newValue: string[];

    if (allSelected) {
      newValue = value.filter(v => !leafValues.includes(v));
    } else {
      const toAdd = leafValues.filter(v => !value.includes(v));
      newValue = [...value, ...toAdd];
    }
    onChange(newValue);
  };

  const getSubtypeCount = (sub: SubtypeNode) => {
    return sub.children.reduce((sum, leaf) => sum + (facetCounts[leaf.value] || 0), 0);
  };

  const getGroupCount = (group: GroupNode) => {
    return group.children.reduce((sum, sub) => sum + getSubtypeCount(sub), 0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mb: 1, textTransform: 'uppercase', px: 1 }}>
        {title}
      </Typography>

      {groups.map((group) => {
        const groupCount = getGroupCount(group);
        const isGroupExpanded = expandedGroups.includes(group.key);

        const isGroupActive = group.children.some(sub =>
          sub.children.some(leaf => value.includes(leaf.value))
        );

        return (
          <Accordion
            key={group.key}
            expanded={isGroupExpanded}
            onChange={handleAccordionToggle(group.key)}
            disableGutters
            elevation={0}
            sx={{
              border: 'none',
              background: 'transparent',
              opacity: groupCount === 0 && !isGroupActive ? 0.5 : 1,
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pr: 1
                }
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isGroupActive ? 600 : 500,
                  color: isGroupActive ? 'primary.main' : 'text.primary'
                }}
              >
                {group.label}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                ({groupCount})
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ padding: '0 0 8px 0' }}>
              {group.children.map((sub) => {
                const subCount = getSubtypeCount(sub);
                const leafValues = sub.children.map(leaf => leaf.value);

                const isSubSelected = leafValues.every(v => value.includes(v));
                const isSubIndeterminate = !isSubSelected && leafValues.some(v => value.includes(v));

                const isDisabled = subCount === 0 && !isSubSelected && !isSubIndeterminate;

                // Tutaj generujemy treść tooltipa na podstawie Twojej logiki z wheelTypesData
                const tooltipContent = sub.children
                  .map((leaf) => {
                    const info = wheelTypesData[leaf.value];
                    return info ? `${info.name}: ${info.desc}` : `Typ ${leaf.value}`;
                  })
                  .join('\n\n');

                return (
                  <Box
                    key={sub.key}
                    onClick={() => !isDisabled && handleSubtypeToggle(sub.children)}
                    sx={{
                      display: 'grid',
                      // Idealny podział na 4 kolumny: Checkbox | Tekst | Licznik | Pytajnik na końcu
                      gridTemplateColumns: '40px 1fr 45px 25px',
                      alignItems: 'center',
                      width: '100%',
                      py: 0.75,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.4 : 1,
                      '&:hover': {
                        backgroundColor: isDisabled ? 'transparent' : 'action.hover',
                      },
                    }}
                  >
                    {/* Kolumna 1: Checkbox (Z przywróconymi kwadratowymi ikonami icon i checkedIcon) */}
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      checked={isSubSelected}
                      indeterminate={isSubIndeterminate}
                      size="small"
                      sx={{ p: 0, justifySelf: 'center' }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleSubtypeToggle(sub.children)}
                    />

                    {/* Kolumna 2: Nazwa podtypu */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isSubSelected || isSubIndeterminate ? 600 : 400,
                        lineHeight: 1.2,
                        pr: 1.5,
                        wordBreak: 'break-word',
                        color: isSubSelected || isSubIndeterminate ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {sub.label}
                    </Typography>

                    {/* Kolumna 3: Licznik produktów */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ justifySelf: 'end', pr: 0.5, fontVariantNumeric: 'tabular-nums' }}
                    >
                      ({subCount})
                    </Typography>

                    {/* Kolumna 4: Ikona znaku zapytania wyrównana do prawej krawędzi */}
                    <Box sx={{ justifySelf: 'center', display: 'flex' }} onClick={(e) => e.stopPropagation()}>
                      <Tooltip
                        title={<div style={{ whiteSpace: 'pre-line', padding: '4px' }}>{tooltipContent}</div>}
                        arrow
                        placement="left"
                      >
                        <HelpOutlineIcon
                          sx={{
                            fontSize: 16,
                            color: 'action.disabled',
                            cursor: 'help',
                            '&:hover': { color: 'action.active' }
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default ShapeTypeFilter;