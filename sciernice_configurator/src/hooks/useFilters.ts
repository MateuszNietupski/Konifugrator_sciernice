import { useState, useMemo, useEffect, useRef } from 'react';
import type { AbrasiveRow } from '../types/types';
import { BOND_FILTER_OPTIONS, getBondGroupId } from '../utils/filterGroups';
import { type GridFilterModel } from '@mui/x-data-grid';

export function useFilters(abrasives: AbrasiveRow[]) {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedGrits, setSelectedGrits] = useState<number[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [selectedBonds, setSelectedBonds] = useState<string[]>([]);
    const [searchModel, setSearchModel] = useState<GridFilterModel>({
        items: [{ id: 'search', field: 'name', operator: 'contains', value: '' }]
    });

    const [lengthValues, setLengthValues] = useState<[number, number] | null>(null);

    const matchesSearchModel = (wheel: AbrasiveRow, model: GridFilterModel): boolean => {
        const activeItems = model.items.filter(
            item => item.value !== undefined && item.value !== null && String(item.value).trim() !== ''
        );
        if (activeItems.length === 0) return true;

        return activeItems.every((filterItem) => {
            const { field, operator, value } = filterItem;
            const numberFields = ['grit', 'outerDiameter', 'boreSize', 'thickness'];
            if (numberFields.includes(field)) {
                let rowRawValue: any;
                if (field === 'grit') rowRawValue = wheel.gritSize;
                else rowRawValue = wheel[field as keyof AbrasiveRow];

                const rowValue = Number(rowRawValue);
                const searchValue = Number(value);
                if (isNaN(rowValue) || isNaN(searchValue)) return false;

                switch (operator) {
                    case 'equals': return rowValue === searchValue;
                    case 'onOrAfter': return rowValue >= searchValue;
                    case 'onOrBefore': return rowValue <= searchValue;
                    default: return rowValue === searchValue;
                }
            }

            const searchStr = String(value).trim().toLowerCase();
            let cellValue = '';
            if (field === 'bond') {
                cellValue = getBondGroupId(wheel.bond || '');
            } else {
                cellValue = String(wheel[field as keyof AbrasiveRow] || '');
            }
            cellValue = cellValue.toLowerCase();

            switch (operator) {
                case 'contains': return cellValue.includes(searchStr);
                case 'startsWith': return cellValue.startsWith(searchStr);
                case 'endsWith': return cellValue.endsWith(searchStr);
                case 'equals': return cellValue === searchStr;
                default: return true;
            }
        });
    };

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
        const unique = [...new Set(abrasives.map((w) => Number(w.outerDiameter)))].filter((d) => !isNaN(d)).sort((a, b) => a - b);
        return unique.length > 0 ? unique : [0];
    }, [abrasives]);

    const minAbsolute = lengthSteps[0];
    const maxAbsolute = lengthSteps[lengthSteps.length - 1];

    useEffect(() => {
        if (abrasives.length > 0 && lengthValues === null) {
            setLengthValues([minAbsolute, maxAbsolute]);
        }
    }, [abrasives, minAbsolute, maxAbsolute, lengthValues]);

    const currentValues = lengthValues || [minAbsolute, maxAbsolute];

    const isLengthFilterActive = useMemo(() => {
        return currentValues[0] !== minAbsolute || currentValues[1] !== maxAbsolute;
    }, [currentValues, minAbsolute, maxAbsolute]);

    const filteredWheels = useMemo(() => {
        return abrasives.filter((wheel) => {
            if (!matchesSearchModel(wheel, searchModel)) return false;
            if (selectedTypes.length > 0 && !selectedTypes.includes(wheel.type || '')) return false;
            if (selectedMaterials.length > 0 && !selectedMaterials.includes(wheel.material || '')) return false;
            if (selectedGrits.length > 0 && !selectedGrits.includes(Number(wheel.gritSize))) return false;
            if (selectedBonds.length > 0) {
                const bondId = getBondGroupId(wheel.bond || '');
                if (!selectedBonds.includes(bondId)) return false;
            }

            const currentLen = Number(wheel.outerDiameter);
            if (currentLen < currentValues[0] || currentLen > currentValues[1]) return false;

            return true;
        });
    }, [abrasives, searchModel, selectedTypes, selectedGrits, selectedMaterials, selectedBonds, currentValues]);

    const facetCounts = useMemo(() => {
        const Type: Record<string, number> = {};
        const Grit: Record<number, number> = {};
        const Material: Record<string, number> = {};
        const Bond: Record<string, number> = {};

        for (const w of abrasives) {
            if (!matchesSearchModel(w, searchModel)) continue;

            const wType = w.type || '';
            const wGrit = Number(w.gritSize);
            const wMat = w.material || '';
            const wBondId = getBondGroupId(w.bond || '');
            const currentLen = Number(w.outerDiameter);

            const matchesLength = currentLen >= currentValues[0] && currentLen <= currentValues[1];
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(wType);
            const matchesGrit = selectedGrits.length === 0 || selectedGrits.includes(wGrit);
            const matchesMat = selectedMaterials.length === 0 || selectedMaterials.includes(wMat);
            const matchesBond = selectedBonds.length === 0 || selectedBonds.includes(wBondId);

            if (matchesGrit && matchesMat && matchesBond && matchesLength && wType) Type[wType] = (Type[wType] || 0) + 1;
            if (matchesType && matchesMat && matchesBond && matchesLength && wGrit) Grit[wGrit] = (Grit[wGrit] || 0) + 1;
            if (matchesType && matchesGrit && matchesBond && matchesLength && wMat) Material[wMat] = (Material[wMat] || 0) + 1;
            if (matchesType && matchesGrit && matchesMat && matchesLength && wBondId) Bond[wBondId] = (Bond[wBondId] || 0) + 1;
        }

        return { Type, Grit, Material, Bond };
    }, [abrasives, searchModel, selectedTypes, selectedGrits, selectedMaterials, selectedBonds, currentValues]);

    const lengthRangeIndices = useMemo<[number, number]>(() => {
        let minIdx = lengthSteps.findIndex(v => v >= currentValues[0]);
        let maxIdx = lengthSteps.findIndex(v => v >= currentValues[1]);
        if (minIdx === -1) minIdx = 0;
        if (maxIdx === -1) maxIdx = lengthSteps.length - 1;
        return [minIdx, maxIdx];
    }, [currentValues, lengthSteps]);

    const handlers = {
        handleClearFilters: () => {
            setSelectedTypes([]);
            setSelectedGrits([]);
            setSelectedMaterials([]);
            setSelectedBonds([]);
            setSearchModel({
                items: [{ id: 'search', field: 'name', operator: 'contains', value: '' }]
            });
            setLengthValues([minAbsolute, maxAbsolute]);
        },
        setSelectedTypes,
        setSelectedGrits,
        setLengthRange: (indices: [number, number]) => {
            const minVal = lengthSteps[indices[0]] ?? minAbsolute;
            const maxVal = lengthSteps[indices[1]] ?? maxAbsolute;
            setLengthValues([minVal, maxVal]);
        },
        setSearchModel,
        setSelectedMaterials,
        setSelectedBonds,

        removeSelectedType: (type: string) => setSelectedTypes((prev) => prev.filter((t) => t !== type)),
        removeSelectedGrit: (grit: number) => setSelectedGrits((prev) => prev.filter((g) => g !== grit)),
        removeSelectedMaterial: (material: string) => setSelectedMaterials((prev) => prev.filter((m) => m !== material)),
        removeSelectedBond: (bondId: string) => setSelectedBonds((prev) => prev.filter((b) => b !== bondId)),
        removeLengthFilter: () => {
            setLengthValues([minAbsolute, maxAbsolute]);
        },
        removeSearchItem: (id: string) => {
            setSearchModel((prev) => {
                let currentItems = prev.items.filter(item => String(item.id) !== id);
                if (currentItems.length === 0) {
                    currentItems = [{ id: 'search', field: 'name', operator: 'contains', value: '' }];
                }
                return { ...prev, items: currentItems };
            });
        },
    };

    return {
        state: {
            selectedTypes,
            selectedGrits,
            selectedMaterials,
            selectedBonds,
            lengthRange: lengthRangeIndices, 
            lengthSteps,
            searchModel,
            isLengthFilterActive,
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