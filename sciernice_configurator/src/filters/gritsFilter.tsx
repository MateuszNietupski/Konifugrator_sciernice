import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

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
            onChange={(event, newValue) => {
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
                        opacity: isDisabled ? 0.5 : 1,
                        pointerEvents: isDisabled ? 'none' : 'auto'
                    }}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant="body2">{option}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                ({count})
                            </Typography>
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