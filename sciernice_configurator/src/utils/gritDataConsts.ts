/**
 * Gradacje ściernic - konfiguracja do filtrów i tooltipów.
 *
 * Założenia:
 * - Hint gradacji opisuje WYŁĄCZNIE efekt obróbki wynikający z ziarnistości.
 * - Nie opisuje materiału ściernego, spoiwa ani typu ściernicy.
 * - Szczegóły dotyczące CBN, diamentu, włókniny, lamelek itd.
 *   powinny pochodzić z osobnych hintów cech produktu.
 */

export type GritGroupId =
  | "coarse"
  | "medium"
  | "fine"
  | "finish";

export interface GritGroup {
  id: GritGroupId;
  name: string;

  /**
   * Zakres orientacyjny wykorzystywany w UI.
   */
  range: [number, number];

  /**
   * Gradacje należące do grupy.
   */
  values: number[];

  /**
   * Tooltip grupy w filtrach.
   */
  hint: string;

  /**
   * Ocena 1-5
   * Im więcej tym szybciej usuwa materiał.
   */
  materialRemoval: 1 | 2 | 3 | 4 | 5;

  /**
   * Ocena 1-5
   * Im więcej tym lepsza jakość powierzchni.
   */
  surfaceFinish: 1 | 2 | 3 | 4 | 5;
}

export interface GritDefinition {
  value: number;
  group: GritGroupId;

  /**
   * Krótki tooltip wyświetlany przy konkretnej gradacji.
   */
  hint: string;
}

export const gritGroups: GritGroup[] = [
  {
    id: "coarse",
    name: "Zgrubne",
    range: [16, 36],
    values: [16, 20, 24, 30, 36],
    hint:
      "Największa agresywność szlifowania. Do szybkiego usuwania materiału, gratowania i obróbki wstępnej.",
    materialRemoval: 5,
    surfaceFinish: 1,
  },

  {
    id: "medium",
    name: "Uniwersalne",
    range: [40, 60],
    values: [40, 46, 54, 56, 60],
    hint:
      "Najczęściej stosowane gradacje. Łączą wysoką wydajność pracy z umiarkowaną jakością powierzchni.",
    materialRemoval: 4,
    surfaceFinish: 2,
  },

  {
    id: "fine",
    name: "Dokładne",
    range: [80, 120],
    values: [80, 100, 115, 120],
    hint:
      "Do wygładzania powierzchni oraz przygotowania elementów do dalszej obróbki i wykończenia.",
    materialRemoval: 2,
    surfaceFinish: 4,
  },

  {
    id: "finish",
    name: "Wykańczające",
    range: [125, 180],
    values: [125, 126, 151, 180],
    hint:
      "Do precyzyjnego wykończenia powierzchni i ograniczenia widocznych śladów szlifowania.",
    materialRemoval: 1,
    surfaceFinish: 5,
  },
];

export const gritDefinitions: Record<number, GritDefinition> = {
  16: {
    value: 16,
    group: "coarse",
    hint:
      "Bardzo agresywna gradacja do maksymalnie szybkiego usuwania materiału.",
  },

  20: {
    value: 20,
    group: "coarse",
    hint:
      "Do intensywnej obróbki zgrubnej i dużych naddatków materiału.",
  },

  24: {
    value: 24,
    group: "coarse",
    hint:
      "Popularna gradacja do cięższych prac szlifierskich i szybkiego zbierania materiału.",
  },

  30: {
    value: 30,
    group: "coarse",
    hint:
      "Do zgrubnego szlifowania z nieco lepszą kontrolą powierzchni niż gradacje 16–24.",
  },

  36: {
    value: 36,
    group: "coarse",
    hint:
      "Granica obróbki zgrubnej i uniwersalnej. Dobre połączenie wydajności i kontroli.",
  },

  40: {
    value: 40,
    group: "medium",
    hint:
      "Uniwersalna gradacja do obróbki ogólnej i usuwania nierówności.",
  },

  46: {
    value: 46,
    group: "medium",
    hint:
      "Dobry kompromis między szybkością szlifowania a jakością powierzchni.",
  },

  54: {
    value: 54,
    group: "medium",
    hint:
      "Do wyrównywania powierzchni i przygotowania do dalszych etapów obróbki.",
  },

  56: {
    value: 56,
    group: "medium",
    hint:
      "Uniwersalna gradacja do większości standardowych zastosowań szlifierskich.",
  },

  60: {
    value: 60,
    group: "medium",
    hint:
      "Jedna z najczęściej stosowanych gradacji. Zapewnia dobrą wydajność i równomierne wykończenie.",
  },

  80: {
    value: 80,
    group: "fine",
    hint:
      "Do wygładzania powierzchni po obróbce zgrubnej i redukcji głębszych rys.",
  },

  100: {
    value: 100,
    group: "fine",
    hint:
      "Zapewnia wyraźnie lepszą jakość powierzchni przy zachowaniu dobrej wydajności.",
  },

  115: {
    value: 115,
    group: "fine",
    hint:
      "Do dokładniejszego wygładzania i przygotowania powierzchni do wykończenia.",
  },

  120: {
    value: 120,
    group: "fine",
    hint:
      "Popularna gradacja wykańczająca stosowana przed malowaniem, lakierowaniem lub polerowaniem.",
  },

  125: {
    value: 125,
    group: "finish",
    hint:
      "Drobna gradacja do uzyskania gładkiej i estetycznej powierzchni.",
  },

  126: {
    value: 126,
    group: "finish",
    hint:
      "Do precyzyjnego wykańczania elementów wymagających ograniczenia śladów obróbki.",
  },

  151: {
    value: 151,
    group: "finish",
    hint:
      "Bardzo drobna gradacja stosowana do dokładnego wygładzania powierzchni.",
  },

  180: {
    value: 180,
    group: "finish",
    hint:
      "Gradacja wykańczająca do uzyskania wysokiej jakości powierzchni przed końcową obróbką.",
  },
};

/**
 * Pomocnicza mapa do szybkiego pobierania grupy po gradacji.
 */
export const gritToGroupMap: Record<number, GritGroupId> = {
  16: "coarse",
  20: "coarse",
  24: "coarse",
  30: "coarse",
  36: "coarse",

  40: "medium",
  46: "medium",
  54: "medium",
  56: "medium",
  60: "medium",

  80: "fine",
  100: "fine",
  115: "fine",
  120: "fine",

  125: "finish",
  126: "finish",
  151: "finish",
  180: "finish",
};

export const getGritHint = (gritValue: string | number): string => {
    const def = gritDefinitions[Number(gritValue)];
    return def?.hint ?? '';
};

export const getGritGroup = (grit: number) => {
    const groupId = gritToGroupMap[grit];
    return gritGroups.find(g => g.id === groupId);
};

export const groupSelectedGrits = (selected: number[]) => {
    const map = new Map<string, { group: typeof gritGroups[0]; values: number[] }>();

    for (const grit of selected) {
        const group = getGritGroup(grit);
        if (!group) continue;

        if (!map.has(group.id)) {
            map.set(group.id, { group, values: [] });
        }
        map.get(group.id)!.values.push(grit);
    }

    return gritGroups
        .map(g => map.get(g.id))
        .filter(Boolean) as Array<{ group: typeof gritGroups[0]; values: number[] }>;
};