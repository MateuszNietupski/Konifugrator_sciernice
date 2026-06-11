import { wheelTypesData, getWheelTypeName } from "./abrasivesConsts";

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
    label: 'Ściernice płaskie',
    subtypes: [
      { label: 'Płaskie (Typ 1, 1A1)', values: ['1', '1A1'] },
      { label: 'Profilowe (Typ 1C, 1YC)', values: ['1C', '1YC'] },
      { label: 'Wybranie walcowe (Typ 5)', values: ['5'] },
      { label: 'Tarczowe z wkładkami gwintowymi (Typ 36)', values: ['36'] },
    ]
  },
  {
  id: 'disc_wheels',
  label: 'Tarcze do szlifierek kątowych',
  subtypes: [
    { label: 'Do przecinania (Typ 41 i 42)', values: ['41', '42'] },
    { label: 'Szlifierskie (Typ 27 i 29)', values: ['27', '29'] }
  ]
},
  {
    id: 'cup_wheels',
    label: 'Ściernice garnkowe i kubkowe',
    subtypes: [
      { label: 'Garnkowe walcowe (Typ 6, 6A2)', values: ['6', '6A2'] },
      //  { label: 'Garnkowe walcowe z gwintem (Seria 6000)', values: ['6001', '6002', '6003', '6004', '6005'] },
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
    label: 'Osełki',
    subtypes: [
      { label: 'Prostokątne (Standardowe i warstwowe)', values: ['9010', '9010Y'] },
      { label: 'Trójkątne ', values: ['9011', '9020'] },
      { label: 'Owalne', values: ['9050'] }
    ]
  }
];

export function buildTypeFilterGroups() {
  return ABRASIVE_FILTER_GROUPS.map(group => ({
    key: group.id,
    label: group.label,
    children: group.subtypes.map((sub, i) => ({
      key: `${group.id}_${i}`,
      label: sub.label,
      children: sub.values.map(value => ({
        value,
        label: getWheelTypeName(value),
      })),
    })),
  }));
}


export const BOND_FILTER_OPTIONS: BondFilterGroup[] = [
  {
    id: 'ceramic',
    label: 'Ceramiczne',
    description: 'Sztywne i stabilne. Idealne do szlifowania precyzyjnego, ostrzenia narzędzi i pracy na mokro. Doskonale zachowują profil i wymiar.',
    values: ['V', 'C', 'TC'], // C i TC to gumowe, ale to ceramiki które skrypt tak przydzielił przez kod wewnętrzny ANDRE
    colorConfig: {
      bg: '#E3F2FD',
      text: '#0D47A1',
      border: '#90CAF9'
    }
  },
  {
    id: 'galvanic',
    label: 'Galwaniczne',
    description: 'Ekstremalnie twarde spoiwo niklowe dla ziaren diament/CBN. Ziarno wystaje bardzo mocno, co daje niesamowitą agresywność i trwałość profilu bez obciągania.',
    values: ['G'],
    colorConfig: {
      bg: '#37474F',
      text: '#FFFFFF',
      border: '#263238'
    }
  },
  {
    id: 'resin',
    label: 'Żywiczne',
    //label: 'Żywiczne (B, BF, TE, HE)',
    description: 'Elastyczne, odporne na drgania, uderzenia boczne oraz wysokie obciążenia mechaniczne Idealne do pracy ręcznej, szlifowania spawów i cięcia metalu.',
    values: ['B'],
    colorConfig: { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' }
  },
  {
    id: 'resin_bf',
    label: 'Żywiczne zbrojone',
    description: 'Spoiwo żywiczne wzmocnione siatką z włókna szklanego. Umożliwia produkcję cienkich tarcz tnących i szlifierskich odpornych na rozerwanie przy pracy kątowej.',
    values: ['BF', 'TE', 'HE'],
    colorConfig: { bg: '#FBE9E7', text: '#BF360C', border: '#FFAB91' }
  },
  {
    id: 'resin_elastic',
    label: 'Żywiczne elastyczne',
    description: 'Spoiwo żywiczne połączone z elastycznym podkładem (płótno/nylon). Zapewnia doskonałe tłumienie drgań, dopasowanie do kształtu detalu i chłodną obróbkę wykańczającą (satynowanie, szlifowanie bez przypaleń). Stosowane w ściernicach lamelkowych i włókninowych.',
    values: ['R', 'RE'],
    colorConfig: { 
      bg: '#FFFDE7',   
      text: '#F57F17',  
      border: '#FFF59D' 
    }
  },
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