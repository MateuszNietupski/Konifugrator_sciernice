import { Slider, Box, Typography, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface StepSliderFilterProps {
    label: string;
    steps: number[];
    currentRange: [number, number]; // [indexMin, indexMax]
    onChange: (value: [number, number]) => void;
    unit?: string;
}

export default function StepSliderFilter({
    label,
    steps,
    currentRange,
    onChange,
    unit = 'mm'
}: StepSliderFilterProps) {

    if (!steps || steps.length === 0) return null;

    const [localRange, setLocalRange] = useState<[number, number]>(currentRange);

    const [inputMin, setInputMin] = useState<string>(String(steps[currentRange[0]]));
    const [inputMax, setInputMax] = useState<string>(String(steps[currentRange[1]]));

    useEffect(() => {
        setLocalRange(currentRange);
        setInputMin(String(steps[currentRange[0]]));
        setInputMax(String(steps[currentRange[1]]));
    }, [currentRange[0], currentRange[1]]);

    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        const range = newValue as [number, number];
        setLocalRange(range);
        setInputMin(String(steps[range[0]]));
        setInputMax(String(steps[range[1]]));
    };

    const handleSliderCommit = (_event: React.SyntheticEvent | Event, newValue: number | number[]) => {
        onChange(newValue as [number, number]);
    };

    const findClosestStepIndex = (val: number): number => {
        return steps.reduce((closestIdx, currentVal, currentIdx) => {
            const currentDiff = Math.abs(currentVal - val);
            const closestDiff = Math.abs(steps[closestIdx] - val);
            return currentDiff < closestDiff ? currentIdx : closestIdx;
        }, 0);
    };

    const handleInputBlurOrEnter = () => {
        let numMin = parseFloat(inputMin);
        let numMax = parseFloat(inputMax);

        if (isNaN(numMin)) numMin = steps[0];
        if (isNaN(numMax)) numMax = steps[steps.length - 1];

        if (numMin > numMax) {
            const temp = numMin;
            numMin = numMax;
            numMax = temp;
        }

        const idxMin = findClosestStepIndex(numMin);
        const idxMax = findClosestStepIndex(numMax);

        const finalRange: [number, number] = [idxMin, idxMax];

        setLocalRange(finalRange);
        setInputMin(String(steps[idxMin]));
        setInputMax(String(steps[idxMax]));
        onChange(finalRange); // Wysyłamy filtr do grida
    };

    const valueLabelFormat = (index: number) => {
        return steps[index] !== undefined ? `${steps[index]} ${unit}` : '';
    };

    const hideSpinnersSx = {
        width: '80px',
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
        },
        '& input[type=number]': {
            '-moz-appearance': 'textfield',
        },
    };

    return (
        <Box sx={{ px: 2.5, mt: 3, width: '100%', boxSizing: 'border-box' }}>
            <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mb: 1, textTransform: 'uppercase' }}>
                {label} ({unit})
            </Typography>

            <Slider
                value={localRange}
                onChange={handleSliderChange}
                onChangeCommitted={handleSliderCommit}
                min={0}
                max={steps.length - 1}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={valueLabelFormat}
                marks={[
                    { value: 0, label: `${steps[0]}` },
                    { value: steps.length - 1, label: `${steps[steps.length - 1]}` }
                ]}
                sx={{
                    mb: 1,
                    '& .MuiSlider-valueLabel': { bgcolor: 'primary.main', zIndex: 1000 },
                    '& .MuiSlider-markLabel[data-index="0"]': { transform: 'translateX(0%)' },
                    '& .MuiSlider-markLabel[data-index="1"]': { transform: 'translateX(-100%)' },
                }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 1.5 }}>
                <TextField
                    label="Od"
                    size="small"
                    variant="outlined"
                    value={inputMin}
                    onChange={(e) => setInputMin(e.target.value)}
                    onBlur={handleInputBlurOrEnter}
                    onKeyDown={(e) => e.key === 'Enter' && handleInputBlurOrEnter()}
                    slotProps={{ htmlInput: { type: 'number', style: { textAlign: 'center', padding: '6px 8px' } } }}
                    sx={hideSpinnersSx}
                />

                <Box sx={{ width: '12px', height: '2px', bgcolor: 'text.secondary', flexShrink: 0 }} />

                <TextField
                    label="Do"
                    size="small"
                    variant="outlined"
                    value={inputMax}
                    onChange={(e) => setInputMax(e.target.value)}
                    onBlur={handleInputBlurOrEnter}
                    onKeyDown={(e) => e.key === 'Enter' && handleInputBlurOrEnter()}
                    slotProps={{ htmlInput: { type: 'number', style: { textAlign: 'center', padding: '6px 8px' } } }}
                    sx={hideSpinnersSx}
                />
            </Box>
        </Box>
    );
}