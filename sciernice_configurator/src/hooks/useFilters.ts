import { useState, useMemo, useEffect } from 'react';
// Import Twojego oficjalnego interfejsu danych ściernicy
import type { AbrasiveRow } from '../types/types';

export function useFilters(wheels: AbrasiveRow[]) {
    // 1. STANY FILTRÓW
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedGrits, setSelectedGrits] = useState<number[]>([]);
    const [lengthRange, setLengthRange] = useState<[number, number]>([0, 0]); // indeksy suwaka dla D (Średnica)


    const wheelTypes = useMemo(() => {
        return [...new Set(wheels.map((w) => w.description || ''))].filter(Boolean).sort();
    }, [wheels]);

    const gritOptions = useMemo(() => {
        const raw = wheels.map((w) => Number(w.gritSize)).filter((g) => !isNaN(g) && g > 0);
        return [...new Set(raw)].sort((a, b) => a - b);
    }, [wheels]);

    const lengthSteps = useMemo(() => {
        const available = wheels.filter((wheel) => {
            if (selectedTypes.length > 0 && !selectedTypes.includes(wheel.description || '')) return false;
            if (selectedGrits.length > 0 && !selectedGrits.includes(Number(wheel.gritSize))) return false;
            return true;
        });

        const unique = [...new Set(available.map((w) => Number(w.outerDiameter)))].filter((d) => !isNaN(d)).sort((a, b) => a - b);
        return unique.length > 0 ? unique : [0];
    }, [wheels, selectedTypes, selectedGrits]);

    useEffect(() => {
        setLengthRange([0, lengthSteps.length - 1]);
    }, [lengthSteps]);

    const filteredWheels = useMemo(() => {
        return wheels.filter((wheel) => {
            if (selectedTypes.length > 0 && !selectedTypes.includes(wheel.description || '')) return false;

            if (selectedGrits.length > 0 && !selectedGrits.includes(Number(wheel.gritSize))) return false;

            const currentLen = Number(wheel.outerDiameter);
            const minVal = lengthSteps[lengthRange[0]];
            const maxVal = lengthSteps[lengthRange[1]];
            if (currentLen < minVal || currentLen > maxVal) return false;

            return true;
        });
    }, [wheels, selectedTypes, selectedGrits, lengthRange, lengthSteps]);

    const facetCounts = useMemo(() => {
        const countWheels = (field: 'description' | 'gritSize') => {
            const filters = {
                description: selectedTypes,
                gritSize: selectedGrits,
            };
            
            if (field === 'description') delete (filters as any).description;
            if (field === 'gritSize') delete (filters as any).gritSize;

            return wheels.reduce((acc: Record<string | number, number>, wheel) => {
                const matchesOther = Object.entries(filters).every(([key, val]) => {
                    if (!val || val.length === 0) return true;
                    const wheelValue = key === 'gritSize' ? Number(wheel[key as keyof AbrasiveRow]) : wheel[key as keyof AbrasiveRow];
                    return (val as any[]).includes(wheelValue);
                });

                if (matchesOther) {
                    const rawValue = wheel[field as keyof AbrasiveRow];
                    const v = field === 'gritSize' ? Number(rawValue) : String(rawValue || '');
                    if (v) {
                        acc[v] = (acc[v] || 0) + 1;
                    }
                }
                return acc;
            }, {});
        };

        return {
            Type: countWheels('description'),
            Grit: countWheels('gritSize')
        };
    }, [wheels, selectedTypes, selectedGrits]);

    const handlers = {
        handleClearFilters: () => {
            setSelectedTypes([]);
            setSelectedGrits([]);
            setLengthRange([0, 0]);
        },
        setSelectedTypes,
        setSelectedGrits,
        setLengthRange,
    };

    return {
        state: {
            selectedTypes,
            selectedGrits,
            lengthRange,
            lengthSteps,
        },
        results: {
            filteredWheels,
            wheelTypes,
            gritOptions,
            facetCounts,
        },
        handlers
    };
}