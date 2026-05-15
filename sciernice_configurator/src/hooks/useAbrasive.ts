import rawAbrasives from '../data/sciernice.json';


const abrasives = rawAbrasives.map((m, index) => ({
    id: `row-${index}`,
    sku: m.sku,
    name: m.name,
    imageUrl: m.image,
    productLink: m.plik_x.link,
    description: m.plik_x.description,
    outerDiameter: 0,
    boreSize: 0,
    gritSize: 0,
}));

export default function useAbrasives() {
    return { abrasives };
}