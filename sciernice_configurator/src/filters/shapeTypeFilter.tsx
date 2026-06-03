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
import ClickAwayListenerFromMui from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery'; 
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [expandedGroups, setExpandedGroups] = useState<string[]>(defaultExpanded);
  const [expandedSubtypes, setExpandedSubtypes] = useState<string[]>([]);
  const [activeMobileHint, setActiveMobileHint] = useState<string | null>(null);

  const handleAccordionToggle = (groupKey: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedGroups(prev =>
      isExpanded ? [...prev, groupKey] : prev.filter(key => key !== groupKey)
    );
  };

  const handleSubtypeDropdownToggle = (subKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubtypes(prev =>
      prev.includes(subKey) ? prev.filter(key => key !== subKey) : [...prev, subKey]
    );
  };

  const handleLeafToggle = (leafValue: string) => {
    const newValue = value.includes(leafValue)
      ? value.filter(v => v !== leafValue)
      : [...value, leafValue];
    onChange(newValue);
  };

  const handleSubtypeMasterToggle = (leafNodes: LeafTypeNode[]) => {
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

  const handleGroupMasterToggle = (group: GroupNode, event: React.MouseEvent) => {
    event.stopPropagation();
    const allGroupValues = group.children.flatMap(sub => sub.children.map(leaf => leaf.value));
    const allSelected = allGroupValues.every(v => value.includes(v));

    let newValue: string[];
    if (allSelected) {
      newValue = value.filter(v => !allGroupValues.includes(v));
    } else {
      const toAdd = allGroupValues.filter(v => !value.includes(v));
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
    <ClickAwayListenerFromMui onClickAway={() => setActiveMobileHint(null)}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mb: 1, textTransform: 'uppercase', px: 1 }}>
          {title}
        </Typography>

        {groups.map((group) => {
          const groupCount = getGroupCount(group);
          const isGroupExpanded = expandedGroups.includes(group.key);
          const allGroupValues = group.children.flatMap(sub => sub.children.map(leaf => leaf.value));
          
          const isGroupSelected = allGroupValues.length > 0 && allGroupValues.every(v => value.includes(v));
          const isGroupIndeterminate = !isGroupSelected && allGroupValues.some(v => value.includes(v));
          const isGroupActive = allGroupValues.some(v => value.includes(v));

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
                    alignItems: 'center',
                    gap: 1,
                    pr: 1
                  }
                }}
              >
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  checked={isGroupSelected}
                  indeterminate={isGroupIndeterminate}
                  size="small"
                  sx={{ p: 0 }}
                  onClick={(e) => handleGroupMasterToggle(group, e)}
                />

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isGroupActive ? 600 : 500,
                    color: isGroupActive ? 'primary.main' : 'text.primary',
                    flexGrow: 1
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
                  const isSubDisabled = subCount === 0 && !isSubSelected && !isSubIndeterminate;
                  const isSubDropdownOpen = expandedSubtypes.includes(sub.key);
                  
                  // ✅ Sprawdzenie czy podtyp ma więcej niż jednego potomka (liścia)
                  const hasMultipleLeaves = sub.children.length > 1;

                  const tooltipContent = sub.children
                    .map((leaf) => {
                      const info = wheelTypesData[leaf.value];
                      return info ? `${info.name}: ${info.desc}` : `Typ ${leaf.value}`;
                    })
                    .join('\n\n');

                  const isHintOpen = isMobile ? activeMobileHint === sub.key : undefined;

                  const handleHintClick = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (isMobile) {
                      setActiveMobileHint(prev => prev === sub.key ? null : sub.key);
                    }
                  };

                  return (
                    <Box key={sub.key} sx={{ width: '100%' }}>
                      {/* POZIOM 2: Podtyp */}
                      <Box
                        onClick={() => !isSubDisabled && handleSubtypeMasterToggle(sub.children)}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '40px 1fr auto 45px 25px',
                          alignItems: 'center',
                          width: '100%',
                          py: 0.75,
                          cursor: isSubDisabled ? 'not-allowed' : 'pointer',
                          opacity: isSubDisabled ? 0.4 : 1,
                          pl: 1.5,
                          '&:hover': {
                            backgroundColor: isSubDisabled ? 'transparent' : 'action.hover',
                          },
                        }}
                      >
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          checked={isSubSelected}
                          indeterminate={isSubIndeterminate}
                          size="small"
                          sx={{ p: 0, justifySelf: 'center' }}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleSubtypeMasterToggle(sub.children)}
                        />

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

                        {/* ✅ ZMIANA: Strzałka rozwijania pokazuje się TYLKO, gdy są minimum 2 elementy */}
                        {hasMultipleLeaves ? (
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleSubtypeDropdownToggle(sub.key, e)}
                            sx={{ p: 0.25, color: 'text.secondary' }}
                          >
                            {isSubDropdownOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                          </IconButton>
                        ) : (
                          <Box sx={{ width: 24, height: 24 }} /> // Pusty wypełniacz struktury siatki
                        )}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ justifySelf: 'end', pr: 0.5, fontVariantNumeric: 'tabular-nums' }}
                        >
                          ({subCount})
                        </Typography>

                        <Box sx={{ justifySelf: 'center', display: 'flex' }} onClick={handleHintClick}>
                          <Tooltip
                            title={<div style={{ whiteSpace: 'pre-line', padding: '4px' }}>{tooltipContent}</div>}
                            arrow
                            placement="left"
                            open={isHintOpen} 
                            disableHoverListener={isMobile} 
                            disableTouchListener={isMobile} 
                            slotProps={{
                              popper: {
                                onClick: (e) => e.stopPropagation(),
                                onTouchStart: (e) => e.stopPropagation()
                              }
                            }}
                          >
                            <HelpOutlineIcon
                              sx={{
                                fontSize: 16,
                                color: isHintOpen ? 'primary.main' : 'action.disabled',
                                cursor: 'help',
                                transition: 'color 0.2s',
                              }}
                            />
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* POZIOM 3: Lista ukryta pod Collapse – renderuje się TYLKO dla wielu elementów */}
                      {hasMultipleLeaves && (
                        <Collapse in={isSubDropdownOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ pl: 5, bgcolor: 'rgba(0, 0, 0, 0.02)', borderLeft: '2px solid', borderColor: 'divider', mb: 0.5 }}>
                            {sub.children.map((leaf) => {
                              const leafCount = facetCounts[leaf.value] || 0;
                              const isLeafSelected = value.includes(leaf.value);
                              const isLeafDisabled = leafCount === 0 && !isLeafSelected;

                              return (
                                <Box
                                  key={leaf.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isLeafDisabled) handleLeafToggle(leaf.value);
                                  }}
                                  sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '40px 1fr auto 45px 25px',
                                    alignItems: 'center',
                                    py: 0.5,
                                    cursor: isLeafDisabled ? 'not-allowed' : 'pointer',
                                    opacity: isLeafDisabled ? 0.4 : 1,
                                    '&:hover': { bgcolor: 'action.selected' }
                                  }}
                                >
                                  <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    checked={isLeafSelected}
                                    size="small"
                                    sx={{ p: 0, justifySelf: 'center' }}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => handleLeafToggle(leaf.value)}
                                  />
                                  <Typography 
                                    variant="body2" 
                                    color={isLeafSelected ? 'primary.main' : 'text.secondary'} 
                                    sx={{ fontWeight: isLeafSelected ? 600 : 400, pr: 1.5, wordBreak: 'break-word', lineHeight: 1.2 }}
                                  >
                                    {leaf.label}
                                  </Typography>
                                  
                                  <Box />

                                  <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    sx={{ justifySelf: 'end', pr: 0.5, fontVariantNumeric: 'tabular-nums' }}
                                  >
                                    ({leafCount})
                                  </Typography>
                                  
                                  <Box />
                                </Box>
                              );
                            })}
                          </Box>
                        </Collapse>
                      )}
                    </Box>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </ClickAwayListenerFromMui>
  );
};

export default ShapeTypeFilter;