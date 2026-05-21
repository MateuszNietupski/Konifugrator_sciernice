// src/config/filterGroups.ts

export interface Subtype {
  label: string;
  values: string[];
}

export interface FilterGroup {
  id: string;
  label: string;
  subtypes: Subtype[];
}

export const ABRASIVE_FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'flat_wheels',
    label: 'Ściernice płaskie i tarczowe',
    subtypes: [
      { label: 'Płaskie i profilowe (Typ 1, 1A1, 1C, 1YC)', values: ['1', '1A1', '1C', '1YC'] },
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
      { label: 'Garnkowe walcowe z gwintem (Seria 6000)', values: ['6001', '6002', '6003', '6004', '6005'] },
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