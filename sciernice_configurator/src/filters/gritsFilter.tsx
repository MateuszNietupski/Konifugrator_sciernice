import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { getGritHint } from '../utils/abrasivesConsts';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const GritsFilter = ({ value, options, onChange, size = 'medium', facetCounts = {} }: {
    value: number[];
    options: number[];
    onChange: (newValue: number[]) => void;
    size?: 'small' | 'medium';
    facetCounts?: Record<string, number>;
}) => {
    return (
        <Autocomplete
            multiple
            size={size}
            options={options}
            getOptionLabel={(option) => String(option)}
            disableCloseOnSelect
            value={value}
            onChange={(_event, newValue) => {
                onChange(newValue);
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
                            gridTemplateColumns: '40px 50px 1fr 45px 25px',
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
                            <Typography variant="body1" sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                lineHeight: 1
                            }}>
                                {option}
                            </Typography>
                            <Box />
                            <Typography variant="caption" color="text.secondary" sx={{ justifySelf: 'end', pr: 0.5 }}>
                                ({count})
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {getGritHint(option) && (
                                    <Tooltip title={getGritHint(option)} arrow placement="right" componentsProps={{ popper: { onClick: (e) => e.stopPropagation() } }}>
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
                    label="Gradacja"
                    inputProps={{
                        ...params.inputProps,
                        readOnly: true,
                    }}
                />
            )}
            filterOptions={(options) => {
                return [...options].sort((a, b) => {
                    const numA = Number(a);
                    const numB = Number(b);

                    return numA - numB;
                });
            }}
        />
    );
};

export default GritsFilter;