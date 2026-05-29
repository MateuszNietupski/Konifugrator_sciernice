import { useState, useMemo, useCallback } from 'react';
import type { AbrasiveRow } from '../types/types';
import { BOND_FILTER_OPTIONS, getBondGroupId } from '../utils/filterGroups';
import { type GridFilterModel } from '@mui/x-data-grid';

export type NumericDimension = 'outerDiameter' | 'thickness' | 'boreSize';

export interface DimensionConfigItem {
    steps: number[];
    currentValues: [number, number];
    rangeIndices: [number, number];
    isActive: boolean;
}

function buildSteps(abrasives: AbrasiveRow[], field: NumericDimension): number[] {
    const unique = [...new Set(abrasives.map((w) => Number(w[field])))]
        .filter((d) => !isNaN(d) && d > 0)
        .sort((a, b) => a - b);
    return unique.length > 0 ? unique : [0];
}

export function useFilters(abrasives: AbrasiveRow[]) {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedGrits, setSelectedGrits] = useState<number[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [selectedBonds, setSelectedBonds] = useState<string[]>([]);

    const [searchModel, setSearchModel] = useState<GridFilterModel>({ items: [] });

    const [numFilters, setNumFilters] = useState<Record<NumericDimension, [number, number] | null>>({
        outerDiameter: null,
        thickness: null,
        boreSize: null,
    });

    const matchesSearchModel = useCallback((wheel: AbrasiveRow, model: GridFilterModel): boolean => {
        if (!model || !model.items || model.items.length === 0) return true;

        const activeItems = model.items.filter(
            item => item.value !== undefined && item.value !== null && String(item.value).trim() !== ''
        );
        if (activeItems.length === 0) return true;

        return activeItems.every(({ field, operator, value }) => {
            const numberFields = ['grit', 'outerDiameter', 'boreSize', 'thickness'];

            if (numberFields.includes(field)) {
                const raw = field === 'grit' ? wheel.gritSize : wheel[field as keyof AbrasiveRow];
                if (raw === undefined || raw === null || String(raw).trim() === '') return false;

                const rowValue = Number(raw);
                const searchValue = Number(value);
                if (isNaN(rowValue) || isNaN(searchValue)) return false;

                const activeOperator = ['equals', 'onOrAfter', 'onOrBefore'].includes(operator)
                    ? operator
                    : 'equals';

                switch (activeOperator) {
                    case 'equals': return rowValue === searchValue;
                    case 'onOrAfter': return rowValue >= searchValue;
                    case 'onOrBefore': return rowValue <= searchValue;
                    default: return rowValue === searchValue;
                }
            }

            const searchStr = String(value).trim().toLowerCase();
            const cellValue = (
                field === 'bond'
                    ? getBondGroupId(wheel.bond || '')
                    : String(wheel[field as keyof AbrasiveRow] || '')
            ).toLowerCase();

            const activeOperator = ['contains', 'startsWith', 'endsWith', 'equals'].includes(operator)
                ? operator
                : 'contains';

            switch (activeOperator) {
                case 'contains': return cellValue.includes(searchStr);
                case 'startsWith': return cellValue.startsWith(searchStr);
                case 'endsWith': return cellValue.endsWith(searchStr);
                case 'equals': return cellValue === searchStr;
                default: return cellValue.includes(searchStr);
            }
        });
    }, []);

    const getFilteredForDimension = useCallback((fieldToIgnore: NumericDimension) => {
        return abrasives.filter(w => {
            if (!matchesSearchModel(w, searchModel)) return false;
            if (selectedTypes.length > 0 && !selectedTypes.includes(w.type || '')) return false;
            if (selectedMaterials.length > 0 && !selectedMaterials.includes(w.material || '')) return false;
            if (selectedGrits.length > 0 && !selectedGrits.includes(Number(w.gritSize))) return false;
            if (selectedBonds.length > 0 && !selectedBonds.includes(getBondGroupId(w.bond || ''))) return false;

            const dims: NumericDimension[] = ['outerDiameter', 'thickness', 'boreSize'];
            for (const dim of dims) {
                if (dim !== fieldToIgnore && numFilters[dim] !== null) {
                    const val = Number(w[dim]);
                    const [lo, hi] = numFilters[dim]!;
                    if (val < lo || val > hi) return false;
                }
            }
            return true;
        });
    }, [abrasives, searchModel, selectedTypes, selectedMaterials, selectedGrits, selectedBonds, numFilters, matchesSearchModel]);

    const lengthSteps = useMemo(() => buildSteps(getFilteredForDimension('outerDiameter'), 'outerDiameter'), [getFilteredForDimension]);
    const thicknessSteps = useMemo(() => buildSteps(getFilteredForDimension('thickness'), 'thickness'), [getFilteredForDimension]);
    const boreSteps = useMemo(() => buildSteps(getFilteredForDimension('boreSize'), 'boreSize'), [getFilteredForDimension]);

    const dimensionsConfig = useMemo<Record<NumericDimension, DimensionConfigItem>>(() => {
        const getValues = (field: NumericDimension, steps: number[]): [number, number] =>
            numFilters[field] ?? [steps[0], steps[steps.length - 1]];

        const getIndices = (vals: [number, number], steps: number[]): [number, number] => {
            let minIdx = steps.findIndex(v => v >= vals[0]);
            if (minIdx === -1) minIdx = 0;

            let maxIdx = -1;
            for (let i = steps.length - 1; i >= 0; i--) {
                if (steps[i] <= vals[1]) { maxIdx = i; break; }
            }
            if (maxIdx === -1) maxIdx = steps.length - 1;

            return [minIdx, maxIdx];
        };

        const currentLen = getValues('outerDiameter', lengthSteps);
        const currentThick = getValues('thickness', thicknessSteps);
        const currentBore = getValues('boreSize', boreSteps);

        return {
            outerDiameter: {
                steps: lengthSteps,
                currentValues: currentLen,
                rangeIndices: getIndices(currentLen, lengthSteps),
                isActive: numFilters.outerDiameter !== null,
            },
            thickness: {
                steps: thicknessSteps,
                currentValues: currentThick,
                rangeIndices: getIndices(currentThick, thicknessSteps),
                isActive: numFilters.thickness !== null,
            },
            boreSize: {
                steps: boreSteps,
                currentValues: currentBore,
                rangeIndices: getIndices(currentBore, boreSteps),
                isActive: numFilters.boreSize !== null,
            },
        };
    }, [numFilters, lengthSteps, thicknessSteps, boreSteps]);

    const matchesNumericDimensions = useCallback((wheel: AbrasiveRow): boolean => {
        const cfg = dimensionsConfig;
        const checks: [NumericDimension, number][] = [
            ['outerDiameter', Number(wheel.outerDiameter)],
            ['thickness', Number(wheel.thickness)],
            ['boreSize', Number(wheel.boreSize)],
        ];
        for (const [field, val] of checks) {
            if (cfg[field].isActive && !isNaN(val) && val > 0) {
                const [lo, hi] = cfg[field].currentValues;
                if (val < lo || val > hi) return false;
            }
        }
        return true;
    }, [dimensionsConfig]);

    const abrasiveMaterials = useMemo(() => [...new Set(abrasives.map(w => w.material || ''))].filter(Boolean).sort(), [abrasives]);
    const wheelTypes = useMemo(() => [...new Set(abrasives.map(w => w.type || ''))].filter(Boolean).sort(), [abrasives]);
    const gritOptions = useMemo(() => [...new Set(abrasives.map(w => Number(w.gritSize)).filter(g => !isNaN(g) && g > 0))].sort((a, b) => a - b), [abrasives]);
    const bondOptions = useMemo(() => BOND_FILTER_OPTIONS.map(g => g.id), []);

    const filteredWheels = useMemo(() =>
        abrasives.filter(wheel => {
            if (!matchesSearchModel(wheel, searchModel)) return false;
            if (selectedTypes.length > 0 && !selectedTypes.includes(wheel.type || '')) return false;
            if (selectedMaterials.length > 0 && !selectedMaterials.includes(wheel.material || '')) return false;
            if (selectedGrits.length > 0 && !selectedGrits.includes(Number(wheel.gritSize))) return false;
            if (selectedBonds.length > 0 && !selectedBonds.includes(getBondGroupId(wheel.bond || ''))) return false;
            return matchesNumericDimensions(wheel);
        }),
        [abrasives, searchModel, selectedTypes, selectedGrits, selectedMaterials, selectedBonds, matchesSearchModel, matchesNumericDimensions]);

    // Liczniki fasetowe (Facet Counts)
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

            const matchesSizes = matchesNumericDimensions(w);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(wType);
            const matchesGrit = selectedGrits.length === 0 || selectedGrits.includes(wGrit);
            const matchesMat = selectedMaterials.length === 0 || selectedMaterials.includes(wMat);
            const matchesBond = selectedBonds.length === 0 || selectedBonds.includes(wBondId);

            if (matchesGrit && matchesMat && matchesBond && matchesSizes && wType) Type[wType] = (Type[wType] || 0) + 1;
            if (matchesType && matchesMat && matchesBond && matchesSizes && wGrit) Grit[wGrit] = (Grit[wGrit] || 0) + 1;
            if (matchesType && matchesGrit && matchesBond && matchesSizes && wMat) Material[wMat] = (Material[wMat] || 0) + 1;
            if (matchesType && matchesGrit && matchesMat && matchesSizes && wBondId) Bond[wBondId] = (Bond[wBondId] || 0) + 1;
        }

        return { Type, Grit, Material, Bond };
    }, [abrasives, searchModel, selectedTypes, selectedGrits, selectedMaterials, selectedBonds, matchesSearchModel, matchesNumericDimensions]);

    const handlers = {
        handleClearFilters: () => {
            setSelectedTypes([]);
            setSelectedGrits([]);
            setSelectedMaterials([]);
            setSelectedBonds([]);
            setNumFilters({ outerDiameter: null, thickness: null, boreSize: null });
        },
        setSelectedTypes,
        setSelectedGrits,
        setSearchModel,
        setSelectedMaterials,
        setSelectedBonds,
        setDimensionRange: (field: NumericDimension, indices: [number, number], steps: number[]) => {
            setNumFilters(prev => ({ ...prev, [field]: [steps[indices[0]], steps[indices[1]]] }));
        },
        removeDimensionFilter: (field: NumericDimension) => {
            setNumFilters(prev => ({ ...prev, [field]: null }));
        },
        removeSelectedType: (type: string) => setSelectedTypes(prev => prev.filter(t => t !== type)),
        removeSelectedGrit: (grit: number) => setSelectedGrits(prev => prev.filter(g => g !== grit)),
        removeSelectedMaterial: (material: string) => setSelectedMaterials(prev => prev.filter(m => m !== material)),
        removeSelectedBond: (bondId: string) => setSelectedBonds(prev => prev.filter(b => b !== bondId)),
        removeSearchItem: (id: string) => {
            setSearchModel(prev => {
                const items = prev.items.filter(item => String(item.id) !== id);
                return { ...prev, items };
            });
        },
    };

    return {
        state: { selectedTypes, selectedGrits, selectedMaterials, selectedBonds, searchModel, dimensions: dimensionsConfig },
        results: { filteredWheels, wheelTypes, abrasiveMaterials, gritOptions, facetCounts, bondOptions },
        handlers,
    };
}