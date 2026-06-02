import { Slider, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface LengthFilterProps {
    lengthSteps: number[];
    lengthRange: [number, number];
    onChange: (value: [number, number]) => void;
}

export default function LengthFilter({ lengthSteps, lengthRange, onChange }: LengthFilterProps) {
    if (!lengthSteps || lengthSteps.length === 0) return null;

    const [localRange, setLocalRange] = useState<[number, number]>(lengthRange);

    useEffect(() => {
        setLocalRange(lengthRange);
    }, [lengthRange]);

    const handleLocalChange = (_event: Event, newValue: number | number[]) => {
        setLocalRange(newValue as [number, number]);
    };

    const handleCommitChange = (_event: React.SyntheticEvent | Event, newValue: number | number[]) => {
        onChange(newValue as [number, number]);
    };

    const valueLabelFormat = (index: number) => {
        return lengthSteps[index] ? `${lengthSteps[index]} mm` : '';
    };

    return (
        <Box sx={{
            px: 2.5,
            mt: 3,
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mb: 1 }}>Średnica/Długość ściernicy (MM)</Typography>
            <Slider
                value={localRange}
                onChange={handleLocalChange}
                onChangeCommitted={handleCommitChange}
                min={0}
                max={lengthSteps.length - 1}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={valueLabelFormat}
                marks={[
                    { value: 0, label: `${lengthSteps[0]}` },
                    { value: lengthSteps.length - 1, label: `${lengthSteps[lengthSteps.length - 1]}` }
                ]}
                sx={{
                    '& .MuiSlider-valueLabel': {
                        bgcolor: 'primary.main',
                        zIndex: 1000,
                    },
                    '& .MuiSlider-markLabel[data-index="0"]': {
                        transform: 'translateX(0%)',
                    },
                    '& .MuiSlider-markLabel[data-index="1"]': {
                        transform: 'translateX(-100%)',
                    },
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                    Od: <strong>{lengthSteps[lengthRange[0]]} mm</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Do: <strong>{lengthSteps[lengthRange[1]]} mm</strong>
                </Typography>
            </Box>
        </Box>
    );
}