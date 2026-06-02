import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { materialColors, materialDescriptions } from '../utils/abrasivesConsts';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const defaultColors = { bg: '#F5F5F5', border: '#9E9E9E', text: '#616161' };

const tooltipSlotProps = {
    tooltip: {
        sx: {
            bgcolor: 'rgba(14, 33, 53, 0.95)',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 500,
            maxWidth: 280,
            textAlign: 'left',
            whiteSpace: 'pre-line',
            p: 1.5,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            '& .MuiTooltip-arrow': {
                color: 'rgba(14, 33, 53, 0.95)'
            }
        }
    }
};

const MaterialFilter = ({ value, options, onChange, size = 'medium', facetCounts = {} }: {
    value: string[];
    options: string[];
    onChange: (newValue: string[]) => void;
    size?: 'small' | 'medium';
    facetCounts?: Record<string, number>;
}) => {
    return (
        <Autocomplete
            multiple
            size={size}
            options={options}
            disableCloseOnSelect
            value={value}
            onChange={(_event, newValue) => {
                onChange(newValue);
            }}
            slotProps={{
                popper: {
                    sx: {
                        width: 'max-content !important',
                        maxWidth: '90vw',
                        '& .MuiPaper-root': {
                            minWidth: 280,
                        }
                    },
                    placement: 'bottom-start'
                }
            }}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                    const colors = materialColors[option] || defaultColors;
                    const description = materialDescriptions[option] || '';

                    return (
                        <Tooltip
                            key={option}
                            title={description}
                            arrow
                            placement="top"
                            disableHoverListener={!description}
                            slotProps={tooltipSlotProps}
                        >
                            <Chip
                                label={option}
                                {...getTagProps({ index })}
                                size="small"
                                sx={{
                                    backgroundColor: colors.bg,
                                    color: colors.text,
                                    borderColor: colors.border,
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    fontWeight: 600,
                                }}
                            />
                        </Tooltip>
                    );
                })
            }
            renderOption={(props, option, { selected }) => {
                const count = facetCounts[option] || 0;
                const isDisabled = count === 0 && !selected;
                const colors = materialColors[option] || defaultColors;
                const description = materialDescriptions[option] || '';

                const { key, ...otherProps } = props;

                return (
                    <li
                        key={key}
                        {...otherProps}
                        style={{
                            ...props.style,
                            opacity: isDisabled ? 0.4 : 1,
                            pointerEvents: isDisabled ? 'none' : 'auto',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '40px 1fr 45px 25px',
                            alignItems: 'center',
                            width: '100%',
                            px: 1,
                            py: 0.5,
                            '&:hover .row-hint-icon': { opacity: 0.6 }
                        }}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                checked={selected}
                                sx={{
                                    p: 0,
                                    color: selected ? colors.text : 'inherit',
                                    '&.Mui-checked': { color: colors.text },
                                }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, pr: 1.5 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.text, flexShrink: 0 }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: selected ? 600 : 400, 
                                        color: selected ? colors.text : 'text.primary',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {option}
                                </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ justifySelf: 'end', pr: 0.5 }}>
                                ({count})
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {description && (
                                    <Tooltip
                                        title={description}
                                        arrow
                                        placement="right"
                                        slotProps={tooltipSlotProps}
                                        componentsProps={{
                                            popper: {
                                                onClick: (e) => e.stopPropagation()
                                            }
                                        }}
                                    >
                                        <HelpOutlineIcon
                                            className="row-hint-icon"
                                            sx={{
                                                fontSize: 16,
                                                color: 'text.disabled',
                                                cursor: 'help',
                                                transition: 'all 0.15s ease-in-out',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    transform: 'scale(1.15)'
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Materiał"
                    placeholder={value.length === 0 ? "Szukaj materiału..." : ""}
                />
            )}
            filterOptions={(options, state) => {
                const query = state.inputValue.toLowerCase().trim();

                const displayOptions = options.filter((f) =>
                    f.toLowerCase().includes(query)
                );

                return displayOptions.sort((a, b) => {
                    const valA = a.toLowerCase();
                    const valB = b.toLowerCase();

                    if (query) {
                        const startsA = valA.startsWith(query);
                        const startsB = valB.startsWith(query);
                        if (startsA && !startsB) return -1;
                        if (!startsA && startsB) return 1;
                    }

                    const countA = facetCounts[a] || 0;
                    const countB = facetCounts[b] || 0;
                    if (countB !== countA) return countB - countA;

                    return valA.localeCompare(valB);
                });
            }}
        />
    );
};

export default MaterialFilter;