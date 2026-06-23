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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { gritGroups, gritDefinitions } from '../utils/gritDataConsts';
import type { GritGroup } from '../utils/gritDataConsts';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface GritsFilterProps {
    value: number[];
    options: number[];
    onChange: (newValue: number[]) => void;
    facetCounts?: Record<string, number>;
}

const GritsFilter = ({
    value = [],
    options = [],
    onChange,
    facetCounts = {},
}: GritsFilterProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [activeMobileHint, setActiveMobileHint] = useState<string | null>(null);

    const visibleGroups = gritGroups.filter(group =>
        group.values.some(v => options.includes(v))
    );

    const getGroupValues = (group: GritGroup) =>
        group.values.filter(v => options.includes(v));

    const getGroupCount = (group: GritGroup) =>
        getGroupValues(group).reduce((sum, v) => sum + (facetCounts[v] || 0), 0);

    const handleAccordionToggle = (groupId: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedGroups(prev =>
            isExpanded ? [...prev, groupId] : prev.filter(k => k !== groupId)
        );
    };

    const handleLeafToggle = (grit: number) => {
        const newValue = value.includes(grit)
            ? value.filter(v => v !== grit)
            : [...value, grit];
        onChange(newValue);
    };

    const handleGroupMasterToggle = (group: GritGroup, e: React.MouseEvent) => {
        e.stopPropagation();
        const groupValues = getGroupValues(group);
        const allSelected = groupValues.every(v => value.includes(v));

        const newValue = allSelected
            ? value.filter(v => !groupValues.includes(v))
            : [...value, ...groupValues.filter(v => !value.includes(v))];

        onChange(newValue);
    };

    const handleHintClick = (key: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMobile) {
            setActiveMobileHint(prev => prev === key ? null : key);
        }
    };

    return (
        <ClickAwayListenerFromMui onClickAway={() => setActiveMobileHint(null)}>
            <Box sx={{ width: '100%' }}>
                <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mb: 1, textTransform: 'uppercase', px: 1 }}>
                    Gradacje
                </Typography>
                {visibleGroups.map((group) => {
                    const groupValues = getGroupValues(group);
                    const groupCount = getGroupCount(group);
                    const isGroupExpanded = expandedGroups.includes(group.id);

                    const isGroupSelected = groupValues.length > 0 && groupValues.every(v => value.includes(v));
                    const isGroupIndeterminate = !isGroupSelected && groupValues.some(v => value.includes(v));
                    const isGroupActive = groupValues.some(v => value.includes(v));
                    const isGroupDisabled = groupCount === 0 && !isGroupActive;

                    const isHintOpen = isMobile ? activeMobileHint === group.id : undefined;

                    return (
                        <Accordion
                            key={group.id}
                            expanded={isGroupExpanded}
                            onChange={handleAccordionToggle(group.id)}
                            disableGutters
                            elevation={0}
                            sx={{
                                border: 'none',
                                background: 'transparent',
                                opacity: isGroupDisabled ? 0.5 : 1,
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
                                        flexGrow: 1,
                                    }}
                                >
                                    {group.name}
                                </Typography>

                                <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                                    ({groupCount})
                                </Typography>

                                <Box
                                    sx={{ display: 'flex', ml: 0.5 }}
                                    onClick={(e) => handleHintClick(group.id, e)}
                                >
                                    <Tooltip
                                        title={group.hint}
                                        arrow
                                        placement="left"
                                        open={isHintOpen}
                                        disableHoverListener={isMobile}
                                        disableTouchListener={isMobile}
                                        slotProps={{
                                            popper: {
                                                onClick: (e) => e.stopPropagation(),
                                                onTouchStart: (e) => e.stopPropagation(),
                                            },
                                            tooltip: {
                                                sx: {
                                                    bgcolor: 'rgba(14, 33, 53, 0.9)',
                                                    color: '#ffffff',
                                                    fontSize: '0.75rem',
                                                    maxWidth: 220,
                                                },
                                            },
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
                            </AccordionSummary>

                            <AccordionDetails sx={{ padding: '0 0 8px 0' }}>
                                {groupValues.map((grit) => {
                                    const count = facetCounts[grit] || 0;
                                    const isSelected = value.includes(grit);
                                    const isDisabled = count === 0 && !isSelected;
                                    const hint = gritDefinitions[grit]?.hint ?? '';
                                    const hintKey = `grit-${grit}`;
                                    const isGritHintOpen = isMobile ? activeMobileHint === hintKey : undefined;

                                    return (
                                        <Box
                                            key={grit}
                                            onClick={() => !isDisabled && handleLeafToggle(grit)}
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: '40px 1fr 45px 25px',
                                                alignItems: 'center',
                                                width: '100%',
                                                py: 0.5,
                                                pl: 1.5,
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                opacity: isDisabled ? 0.4 : 1,
                                                '&:hover': {
                                                    backgroundColor: isDisabled ? 'transparent' : 'action.hover',
                                                },
                                            }}
                                        >
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                checked={isSelected}
                                                size="small"
                                                sx={{ p: 0, justifySelf: 'center' }}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={() => handleLeafToggle(grit)}
                                            />

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: isSelected ? 600 : 400,
                                                    color: isSelected ? 'primary.main' : 'text.primary',
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                {grit}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ justifySelf: 'end', pr: 0.5, fontVariantNumeric: 'tabular-nums' }}
                                            >
                                                ({count})
                                            </Typography>

                                            <Box
                                                sx={{ justifySelf: 'center', display: 'flex' }}
                                                onClick={(e) => handleHintClick(hintKey, e)}
                                            >
                                                {hint && (
                                                    <Tooltip
                                                        title={hint}
                                                        arrow
                                                        placement="left"
                                                        open={isGritHintOpen}
                                                        disableHoverListener={isMobile}
                                                        disableTouchListener={isMobile}
                                                        slotProps={{
                                                            popper: {
                                                                onClick: (e) => e.stopPropagation(),
                                                                onTouchStart: (e) => e.stopPropagation(),
                                                            },
                                                            tooltip: {
                                                                sx: {
                                                                    bgcolor: 'rgba(14, 33, 53, 0.9)',
                                                                    color: '#ffffff',
                                                                    fontSize: '0.75rem',
                                                                    maxWidth: 220,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <HelpOutlineIcon
                                                            sx={{
                                                                fontSize: 16,
                                                                color: isGritHintOpen ? 'primary.main' : 'action.disabled',
                                                                cursor: 'help',
                                                                transition: 'color 0.2s',
                                                            }}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </Box>
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

export default GritsFilter;