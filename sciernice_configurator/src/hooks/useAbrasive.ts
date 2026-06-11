import rawAbrasives from '../data/sciernice.json';
import type { AbrasiveRow, ApplicationDetails } from '../types/types';

interface RawAbrasiveItem {
    sku: string;
    title: string;
    image: string;
    link: string;
    description: string;
    srednica_dlugosc?: string | null;
    boreSize?: string | null;
    grubosc_szerokosc?: string | null;
    gritSize?: string | number | null;
    material?: string | null;
    typ?: string | null;
    bond?: string | null;
    attributes?: Array<{ name: string; value: string }>;
    zastosowanie_detale?: any;
}

const abrasives: AbrasiveRow[] = (rawAbrasives as RawAbrasiveItem[]).map((m) => {
    const getAttributeValue = (attrName: string) => {
        const attribute = m.attributes?.find(attr => attr.name === attrName);
        return attribute ? attribute.value : null;
    };

    const parseDimension = (value: string | null | undefined) => {
        if (!value) return 0;
        const parsed = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
        return isNaN(parsed) ? 0 : parsed;
    };

    // Logika mapowania i zabezpieczania danych zastosowania
    let mappedApplications: ApplicationDetails | undefined = undefined;

    if (m.zastosowanie_detale) {
        mappedApplications = {
            grupa_glowna_id: m.zastosowanie_detale.grupa_glowna_id || 'INNE',
            grupa_glowna_nazwa: m.zastosowanie_detale.grupa_glowna_nazwa || 'Uniwersalne / Inne',
            tagi_zastosowania: Array.isArray(m.zastosowanie_detale.tagi_zastosowania)
                ? m.zastosowanie_detale.tagi_zastosowania
                : [],
            filtry_materialowe: Array.isArray(m.zastosowanie_detale.filtry_materialowe)
                ? m.zastosowanie_detale.filtry_materialowe
                : [],
            popup_tekst: {
                naglowek_marketingowy: m.zastosowanie_detale.popup_tekst?.naglowek_marketingowy || '',
                lista_zastosowan: Array.isArray(m.zastosowanie_detale.popup_tekst?.lista_zastosowan)
                    ? m.zastosowanie_detale.popup_tekst.lista_zastosowan
                    : [],
                ostrzezenie_krytyczne: m.zastosowanie_detale.popup_tekst?.ostrzezenie_krytyczne || undefined
            }
        };
    }

    return {
        id: m.sku,
        sku: m.sku,
        name: m.title || '',
        imageUrl: m.image || '',
        productLink: m.link || '',
        description: m.description || '',
        outerDiameter: m.srednica_dlugosc ? parseDimension(m.srednica_dlugosc) : parseDimension(getAttributeValue("Średnica zewnętrzna")),
        boreSize: m.boreSize ? parseDimension(m.boreSize) : parseDimension(getAttributeValue("Średnica otworu")),
        thickness: parseDimension(m.grubosc_szerokosc),
        gritSize: m.gritSize && !isNaN(Number(m.gritSize)) ? Number(m.gritSize) : 0,
        material: m.material ? m.material : "",
        type: m.typ ? m.typ : "",
        bond: m.bond ? m.bond : "",
        zastosowanie_detale: mappedApplications
    };
});

export default function useAbrasives() {
    return { abrasives };
}