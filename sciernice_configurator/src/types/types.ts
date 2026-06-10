export interface ApplicationDetails {
  grupa_glowna_id: string;
  grupa_glowna_nazwa: string;
  tagi_zastosowania: string[];
  popup_tekst: {
    naglowek_marketingowy: string;
    lista_zastosowan: string[];
    ostrzezenie_krytyczne?: string;
  };
}

export interface AbrasiveRow {
    sku: string;
    name: string;
    imageUrl: string;
    productLink: string;
    description: string;
    outerDiameter: number;
    thickness: number;
    boreSize: number;
    gritSize: number;
    material: string;
    type: string;
    bond: string;
    zastosowanie_detale?: ApplicationDetails;
}