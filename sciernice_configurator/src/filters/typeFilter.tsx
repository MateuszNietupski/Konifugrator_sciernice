import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { theme } from '../utils/theme';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const TypeFilter = ({ value, options, onChange, size = 'medium', facetCounts = {} }: {
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
            onChange={(event, newValue) => {
                onChange(newValue);
            }}
            slotProps={{
                listbox: {
                    sx: {
                        padding: '8px 0',
                        '& li[role="option"]': {
                            paddingTop: '14px',
                            paddingBottom: '14px',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-of-type': { borderBottom: 'none' },
                        },
                    },
                },
            }}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip
                        label={option}
                        {...getTagProps({ index })}
                        size="small"
                        key={option}
                    />
                ))
            }
            renderOption={(props, option, { selected }) => {
                const count = facetCounts[option] || 0;
                const isDisabled = count === 0 && !selected;

                return (
                    <li {...props} style={{
                        opacity: isDisabled ? 0.4 : 1,
                        pointerEvents: isDisabled ? 'none' : 'auto',
                        padding: '10px 12px',
                        backgroundColor: selected ? theme.palette.action.selected : undefined,
                    }}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            checked={selected}
                            size="small"
                            sx={{ mr: 1, p: 0.5 }}
                        />
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            gap: 1,
                        }}>
                            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                                {option}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: count > 0 ? 'text.secondary' : 'text.disabled',
                                    fontVariantNumeric: 'tabular-nums',
                                    minWidth: 24,
                                    textAlign: 'right',
                                    flexShrink: 0,
                                }}
                            >
                                {count}
                            </Typography>
                        </Box>
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Typ ściernicy"
                    inputProps={{
                        ...params.inputProps,
                        readOnly: true,
                    }}
                />
            )}
            filterOptions={(options) => {
                return [...options].sort((a, b) => {
                    const countA = facetCounts[a] || 0;
                    const countB = facetCounts[b] || 0;
                    if (countB !== countA) return countB - countA;

                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
            }}
        />
    );
};

export default TypeFilter;