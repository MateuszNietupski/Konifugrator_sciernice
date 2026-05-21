import { useState, useMemo, useEffect } from 'react';
import type { AbrasiveRow } from '../types/types';

export function useFilters(abrasives: AbrasiveRow[]) {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedGrits, setSelectedGrits] = useState<number[]>([]);
    const [lengthRange, setLengthRange] = useState<[number, number]>([0, 0]); 
    const [abrasiveSearch, setAbrasiveSearch] = useState<string>('');
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

    const abrasiveMaterials = useMemo(() => {
        return [...new Set(abrasives.map((w) => w.material || ''))].filter(Boolean).sort();
    }, [abrasives]);

    const wheelTypes = useMemo(() => {
        return [...new Set(abrasives.map((w) => w.type || ''))].filter(Boolean).sort();
    }, [abrasives]);

    const gritOptions = useMemo(() => {
        const raw = abrasives.map((w) => Number(w.gritSize)).filter((g) => !isNaN(g) && g > 0);
        return [...new Set(raw)].sort((a, b) => a - b);
    }, [abrasives]);

    const lengthSteps = useMemo(() => {
        const available = abrasives.filter((abrasive) => {
            if (selectedTypes.length > 0 && !selectedTypes.includes(abrasive.type || '')) return false;
            if (selectedGrits.length > 0 && !selectedGrits.includes(Number(abrasive.gritSize))) return false;
            
            if (selectedMaterials.length > 0 && !selectedMaterials.includes(abrasive.material || '')) return false;

            if (abrasiveSearch.trim() !== '') {
                const searchLower = abrasiveSearch.toLowerCase();
                const nameMatch = (abrasive.name || '').toLowerCase().includes(searchLower);
                if (!nameMatch) return false;
            }
            return true;
        });

        const unique = [...new Set(available.map((w) => Number(w.outerDiameter)))].filter((d) => !isNaN(d)).sort((a, b) => a - b);
        return unique.length > 0 ? unique : [0];
    }, [abrasives, selectedTypes, selectedGrits, selectedMaterials, abrasiveSearch]);

    useEffect(() => {
        setLengthRange([0, lengthSteps.length - 1]);
    }, [lengthSteps]);

    const filteredWheels = useMemo(() => {
        return abrasives.filter((wheel) => {
            if (abrasiveSearch.trim() !== '') {
                const searchLower = abrasiveSearch.toLowerCase();
                const nameMatch = (wheel.name || '').toLowerCase().includes(searchLower);
                if (!nameMatch) return false;
            }

            if (selectedTypes.length > 0 && !selectedTypes.includes(wheel.type || '')) return false;

            if (selectedMaterials.length > 0 && !selectedMaterials.includes(wheel.material || '')) return false;

            if (selectedGrits.length > 0 && !selectedGrits.includes(Number(wheel.gritSize))) return false;

            const currentLen = Number(wheel.outerDiameter);
            const minVal = lengthSteps[lengthRange[0]];
            const maxVal = lengthSteps[lengthRange[1]];
            if (currentLen < minVal || currentLen > maxVal) return false;

            return true;
        });
    }, [abrasives, selectedTypes, selectedGrits, selectedMaterials, lengthRange, lengthSteps, abrasiveSearch]);

    const facetCounts = useMemo(() => {
        const countWheels = (field: 'type' | 'gritSize' | 'material') => {
            const filters = {
                type: selectedTypes,
                gritSize: selectedGrits,
                material: selectedMaterials,
            };
            
            if (field === 'type') delete (filters as any).type;
            if (field === 'gritSize') delete (filters as any).gritSize;
            if (field === 'material') delete (filters as any).material;

            return abrasives.reduce((acc: Record<string | number, number>, wheel) => {
                if (abrasiveSearch.trim() !== '') {
                    const searchLower = abrasiveSearch.toLowerCase();
                    const nameMatch = (wheel.name || '').toLowerCase().includes(searchLower);
                    if (!nameMatch ) return acc;
                }

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
            Type: countWheels('type'),
            Grit: countWheels('gritSize'),
            Material: countWheels('material') 
        };
    }, [abrasives, selectedTypes, selectedGrits, selectedMaterials, abrasiveSearch]);

    const handlers = {
        handleClearFilters: () => {
            setSelectedTypes([]);
            setSelectedGrits([]);
            setLengthRange([0, 0]);
            setAbrasiveSearch('');
            setSelectedMaterials([]);
        },
        setSelectedTypes,
        setSelectedGrits,
        setLengthRange,
        setAbrasiveSearch,
        setSelectedMaterials,
    };

    return {
        state: {
            selectedTypes,
            selectedGrits,
            selectedMaterials,
            lengthRange,
            lengthSteps,
            abrasiveSearch
        },
        results: {
            filteredWheels,
            wheelTypes, 
            abrasiveMaterials,
            gritOptions,
            facetCounts,
        },
        handlers
    };
}