import rawAbrasives from '../data/sciernice.json';

const abrasives = rawAbrasives.map((m) => {
    const getAttributeValue = (attrName: string) => {
        const attribute = m.attributes?.find(attr => attr.name === attrName);
        return attribute ? attribute.value : null;
    };

    const parseDimension = (value: string | null) => {
        if (!value) return 0;
        const parsed = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
        return isNaN(parsed) ? 0 : parsed;
    };

    return {
        id: m.sku,
        sku: m.sku,
        name: m.title,
        imageUrl: m.image,
        productLink: m.link,
        description: m.description,
        outerDiameter: m.srednica_dlugosc? parseDimension(m.srednica_dlugosc) : parseDimension(getAttributeValue("Średnica zewnętrzna")),
        boreSize: m.boreSize? parseDimension(m.boreSize) : parseDimension(getAttributeValue("Średnica otworu")),
        thickness: parseDimension(m.grubosc_szerokosc),
        gritSize: m.gritSize? parseDimension(m.gritSize) : parseDimension(getAttributeValue("Ziarnistość")),
        material: m.material? m.material : "",
        type: m.typ ? m.typ : "",
        bond: m.bond ? m.bond : ""
    };
});

export default function useAbrasives() {
    return { abrasives };
}