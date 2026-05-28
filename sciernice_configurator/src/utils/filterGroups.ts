import { wheelTypesData } from "./abrasivesConsts";

export interface Subtype {
  label: string;
  values: string[];
}

export interface FilterGroup {
  id: string;
  label: string;
  subtypes: Subtype[];
}

export interface BondFilterGroup {
  id: string;
  label: string;
  description: string;
  values: string[];
  colorConfig?: {
    bg: string;
    text: string;
    border: string;
  };
}


export const ABRASIVE_FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'flat_wheels',
    label: 'Ściernice płaskie i tarczowe',
    subtypes: [
      { label: 'Płaskie (Typ 1, 1A1)', values: ['1', '1A1'] },
      { label: 'Profilowe (Typ 1C, 1YC)', values: ['1C', '1YC'] },
      { label: 'Z wybraniem walcowym (Typ 5)', values: ['5'] },
      { label: 'Do szlifowania / obniżony środek (Typ 27)', values: ['27'] },
      { label: 'Tarczowe z wkładkami gwintowymi (Typ 36)', values: ['36'] }
    ]
  },
  {
    id: 'cup_wheels',
    label: 'Ściernice garnkowe i kubkowe',
    subtypes: [
      { label: 'Garnkowe walcowe (Typ 6, 6A2)', values: ['6', '6A2'] },
      { label: 'Garnkowe stożkowe (Typ 11, 11A2)', values: ['11', '11A2'] },
      { label: 'Garnkowe stożkowe z gwintem (Typ 1112, 1113, 1114)', values: ['1112', '1113', '1114'] },
      { label: 'Talerzowe i skośne (Typ 12, 12A2, 4A2)', values: ['12', '12A2', '4A2'] }
    ]
  },
  {
    id: 'segments',
    label: 'Segmenty ścierne',
    subtypes: [
      { label: 'Prostokątne i trapezowe', values: ['3101', '3109', '3121'] },
      { label: 'Trapezowo-pierścieniowe (w tym profilowane)', values: ['3103', '3110', '3113'] }
    ]
  },
  {
    id: 'mounted_points',
    label: 'Ściernice trzpieniowe',
    subtypes: [
      { label: 'Walcowe i walcowo-stożkowe', values: ['5210', '5211'] },
      { label: 'Stożkowe i kuliste', values: ['5220', '5230'] }
    ]
  },
  {
    id: 'hones',
    label: 'Osełki i kamienie szlifierskie',
    subtypes: [
      { label: 'Prostokątne (Standardowe i warstwowe)', values: ['9010', '9010Y'] },
      { label: 'Trójkątne i Schichtschleifstein', values: ['9011', '9020'] },
      { label: 'Owalne', values: ['9050'] }
    ]
  }
];


export const BOND_FILTER_OPTIONS: BondFilterGroup[] = [
  {
    id: 'ceramic',
    label: 'Ceramiczne',
    description: 'Sztywne, precyzyjne, do szlifierek stołowych',
    values: ['V', 'C', 'TC'], // C i TC to gumowe, ale to ceramiki które skrypt tak przydzielił przez kod wewnętrzny ANDRE
    colorConfig: {
      bg: '#E3F2FD',    
      text: '#1565C0', 
      border: '#BBDEFB' 
    }
  },/*
  {
    id: 'shellac',
    label: 'Szelakowe',
    //label: 'Szelakowe (E)',
    description: 'Wykończeniowe, polerskie, nadające połysk',
    values: ['E'],
    colorConfig: { bg: '#FFF3CD', text: '#946600', border: '#FFEBA5' }
  },
  */
  {
    id: 'resin',
    label: 'Żywiczne',
    //label: 'Żywiczne (B, BF, TE, HE)',
    description: 'Elastyczne, odporne na drgania i wysokie obroty',
    values: ['B', 'BF', 'TE', 'HE'],
    colorConfig: { bg: '#F5EBE6', text: '#D85A1B', border: '#D7CCC8' }
  },
  {
    id: 'other',
    label: 'Inne specjalistyczne',
    description: 'Magnezytowe, metalowe, silikatowe i rzadkie',
    values: ['M', 'K', 'F', 'N', 'L', 'J', 'EO', 'CO'],
    colorConfig: { bg: '#F0F1F2', text: '#616161', border: '#E0E0E0' }
  }
];

export const getBondGroupId = (rawBond: string): string => {
  const cleanBond = (rawBond || '').trim().toUpperCase();
  const found = BOND_FILTER_OPTIONS.find(g => g.values.includes(cleanBond));
  return found ? found.id : 'other';
};

export const getBondDescription = (bondId: string): string => {
  const found = BOND_FILTER_OPTIONS.find(g => g.id === bondId);
  return found ? found.description : bondId;
};

export const getBondLabel = (bondId: string): string => {
  const found = BOND_FILTER_OPTIONS.find(g => g.id === bondId);
  return found ? found.label : bondId;
};

export const getWheelTypeLabel = (type: string): string => {
  return wheelTypesData[type]?.name ?? `Typ ${type}`;
};

export const getWheelTypeDescription = (type: string): string => {
  return wheelTypesData[type]?.desc ?? '';
};