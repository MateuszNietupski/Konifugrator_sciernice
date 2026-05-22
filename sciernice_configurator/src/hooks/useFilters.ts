import { useState, useMemo, useEffect } from 'react';
import type { AbrasiveRow } from '../types/types';
import { BOND_FILTER_OPTIONS, getBondGroupId } from '../utils/filterGroups';


export function useFilters(abrasives: AbrasiveRow[]) {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedGrits, setSelectedGrits] = useState<number[]>([]);
    const [lengthRange, setLengthRange] = useState<[number, number]>([0, 0]);
    const [abrasiveSearch, setAbrasiveSearch] = useState<string>('');
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [selectedBonds, setSelectedBonds] = useState<string[]>([]);

    const searchNormalized = useMemo(
        () => abrasiveSearch.trim().toLowerCase(),
        [abrasiveSearch]
    );

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

    const bondOptions = useMemo(() => BOND_FILTER_OPTIONS.map(g => g.id), []);

    const lengthSteps = useMemo(() => {
        const available = abrasives.filter((abrasive) => {
            if (selectedTypes.length > 0 && !selectedTypes.includes(abrasive.type || '')) return false;
            if (selectedGrits.length > 0 && !selectedGrits.includes(Number(abrasive.gritSize))) return false;

            if (selectedMaterials.length > 0 && !selectedMaterials.includes(abrasive.material || '')) return false;
            if (selectedBonds.length > 0) {
                const bondId = getBondGroupId(abrasive.bond || '');
                if (!selectedBonds.includes(bondId)) return false;
            }

            if (abrasiveSearch.trim() !== '') {
                const searchLower = abrasiveSearch.toLowerCase();
                const nameMatch = (abrasive.name || '').toLowerCase().includes(searchLower);
                if (!nameMatch) return false;
            }
            return true;
        });

        const unique = [...new Set(available.map((w) => Number(w.outerDiameter)))].filter((d) => !isNaN(d)).sort((a, b) => a - b);
        return unique.length > 0 ? unique : [0];
    }, [abrasives, selectedTypes, selectedGrits, selectedMaterials,selectedBonds, abrasiveSearch]);

    useEffect(() => {
        setLengthRange([0, lengthSteps.length - 1]);
    }, [lengthSteps]);



    const filteredWheels = useMemo(() => {
        return abrasives.filter((wheel) => {
            if (searchNormalized && !(wheel.name || '').toLowerCase().includes(searchNormalized)) return false;

            if (selectedTypes.length > 0 && !selectedTypes.includes(wheel.type || '')) return false;

            if (selectedMaterials.length > 0 && !selectedMaterials.includes(wheel.material || '')) return false;

            if (selectedGrits.length > 0 && !selectedGrits.includes(Number(wheel.gritSize))) return false;

            if (selectedBonds.length > 0) {
                const bondId = getBondGroupId(wheel.bond || '');
                if (!selectedBonds.includes(bondId)) return false;
            }

            const currentLen = Number(wheel.outerDiameter);
            const minVal = lengthSteps[lengthRange[0]];
            const maxVal = lengthSteps[lengthRange[1]];
            if (currentLen < minVal || currentLen > maxVal) return false;

            return true;
        });
    }, [abrasives, searchNormalized, selectedTypes, selectedGrits, selectedMaterials, selectedBonds, lengthRange, lengthSteps]);

    const facetCounts = useMemo(() => {
        const Type: Record<string, number> = {};
        const Grit: Record<number, number> = {};
        const Material: Record<string, number> = {};
        const Bond: Record<string, number> = {};

        for (const w of abrasives) {
            if (searchNormalized && !(w.name || '').toLowerCase().includes(searchNormalized)) continue;

            const wType = w.type || '';
            const wGrit = Number(w.gritSize);
            const wMat = w.material || '';
            const wBondId = getBondGroupId(w.bond || '');

            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(wType);
            const matchesGrit = selectedGrits.length === 0 || selectedGrits.includes(wGrit);
            const matchesMat = selectedMaterials.length === 0 || selectedMaterials.includes(wMat);
            const matchesBond = selectedBonds.length === 0 || selectedBonds.includes(wBondId);

            if (matchesGrit && matchesMat && matchesBond && wType) Type[wType] = (Type[wType] || 0) + 1;
            if (matchesType && matchesMat && matchesBond && wGrit) Grit[wGrit] = (Grit[wGrit] || 0) + 1;
            if (matchesType && matchesGrit && matchesBond && wMat) Material[wMat] = (Material[wMat] || 0) + 1;
            if (matchesType && matchesGrit && matchesMat && wBondId) Bond[wBondId] = (Bond[wBondId] || 0) + 1;
        }

        return { Type, Grit, Material, Bond };
    }, [abrasives, searchNormalized, selectedTypes, selectedGrits, selectedMaterials, selectedBonds]);


    const handlers = {
        handleClearFilters: () => {
            setSelectedTypes([]);
            setSelectedGrits([]);
            setLengthRange([0, 0]);
            setAbrasiveSearch('');
            setSelectedMaterials([]);
            setSelectedBonds([]);
        },
        setSelectedTypes,
        setSelectedGrits,
        setLengthRange,
        setAbrasiveSearch,
        setSelectedMaterials,
        setSelectedBonds,
        removeSelectedType: (type: string) =>
            setSelectedTypes((prev) => prev.filter((t) => t !== type)),
        removeSelectedGrit: (grit: number) =>
            setSelectedGrits((prev) => prev.filter((g) => g !== grit)),
        removeSelectedMaterial: (material: string) =>
            setSelectedMaterials((prev) => prev.filter((m) => m !== material)),
        removeSelectedBond: (bondId: string) =>
            setSelectedBonds((prev) => prev.filter((b) => b !== bondId)),
        clearAbrasiveSearch: () => setAbrasiveSearch(''),
    };

    return {
        state: {
            selectedTypes,
            selectedGrits,
            selectedMaterials,
            selectedBonds,
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
            bondOptions,
        },
        handlers
    };
}