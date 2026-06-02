import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { BOND_FILTER_OPTIONS } from '../utils/filterGroups';
import { getBondDescription } from '../utils/filterGroups';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface BondFilterProps {
    value: string[];
    options: string[];
    onChange: (newValue: string[]) => void;
    size?: 'small' | 'medium';
    facetCounts?: Record<string, number>;
}

const BondFilter = ({ value, options, onChange, size = 'medium', facetCounts = {} }: BondFilterProps) => {

    const getLabel = (id: string) => {
        return BOND_FILTER_OPTIONS.find(g => g.id === id)?.label || id;
    };

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
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip
                        label={getLabel(option)}
                        {...getTagProps({ index })}
                        size="small"
                        key={option}
                    />
                ))
            }
            renderOption={(props, option, { selected }) => {
                const count = facetCounts[option] || 0;
                const isDisabled = count === 0 && !selected;
                const label = getLabel(option);
                const description = getBondDescription(option);

                const { key, ...otherProps } = props;

                return (
                    <li key={key} {...otherProps} style={{
                        ...props.style,
                        opacity: isDisabled ? 0.5 : 1,
                        pointerEvents: isDisabled ? 'none' : 'auto',
                        padding: 0
                    }}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '40px 1fr 45px 25px',
                            alignItems: 'center',
                            width: '100%',
                            px: 1,
                            py: 0.5,
                        }}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                sx={{ p: 0 }}
                                checked={selected}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: selected ? 600 : 400,
                                    lineHeight: 1.2,
                                    pr: 1.5,
                                    wordBreak: 'break-word'
                                }}
                            >
                                {label}
                            </Typography>

                            <Typography variant="caption" color="text.secondary" sx={{ justifySelf: 'end', pr: 0.5 }}>
                                ({count})
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {description && (
                                    <Tooltip title={description} arrow placement="right" componentsProps={{ popper: { onClick: (e) => e.stopPropagation() } }}>
                                        <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.disabled', cursor: 'help' }} />
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
                    label="Spoiwo"
                    inputProps={{
                        ...params.inputProps,
                        readOnly: true,
                    }}
                />
            )}
        />
    );
};

export default BondFilter;