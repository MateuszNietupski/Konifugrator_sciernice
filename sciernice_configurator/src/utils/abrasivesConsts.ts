export const materialDescriptions: Record<string, string> = {
    'elektrokorund szlachetny': '99A Najczystszy elektrokorund, o jednolitej strukturze ziaren. Charakteryzuje się wysoką trwałością i kruchością. Stosowany do szlifowania precyzyjnego np: szlifowanie płaszczyzn, szlifowanie cylidnryczne, ostrzenie narzędzie skrawających.',
    'elektrokorund zwykły': '97A Jest najbardziej wytrzymałym elektrokorundem charakteryzującym się wysoką ciągliwością. Stosowany do przecinania i zgrubnego szlifowania niskostopowych stali, stali niedzewnych, żeliwa, szczególnie przy dużych naddatkach zbieranego materiału.',
    'elektrokorund chromowy': '98A Charakteryzuje się dużą twardością i wytrzymałością, większą od elektrokorundu szlachetnego. Stosowany do precyzyjnego szlifowania stali wysokostopowych i do ostrzenia narzędzi skrawających.',
    'węglik krzemu czarny': '98C Stosowany podobnie jak 99C do szlifowania węglików spiekanych, materiałów ceramicznych, betomnu, kamienia, do zgrubnego szlifowania odlewów z twardego i kruchego żeliwa białego oraz do przecinania betonu, kamienia, żeliwa białego.',
    'węglik krzemu zielony': '99C Stosowany do szlifowania węglików spiekanych, ceramiki, kamini, do ostrzenia narzędzi skrawających z ostrzami z węglików spiekanych.',
    'ziarna diamentowe': 'Najtwardszy materiał ścierniczy. Charakteryzujący się wyjątkową odpornością na zużycie oraz wytrzymałością termiczną. Stosowany do szlifowania szkła, ceramiki, kamienia, tworzyw sztucznych, grafitu, żeliwa. Ze względu na reaktywność diamentu z żelazem, nie zaleca się do obróki narzędzi wykonanych ze stali.',
    'borazon': 'CBN ma mniejszą w porównaniu z diamentem twardość, drugi ale znacznie lepszą odporność cieplną do 1200°C oraz nie reaguje chemicznie z żelazem. Stosuje się go szlifowania wszelkiego rodzaju stali głównie powyżej 50 HRC.'
};

export const materialColors: Record<string, { bg: string; border: string; text: string }> = {
    'elektrokorund chromowy': { bg: '#FFF0F6', border: '#FFADD2', text: '#C41D7F' },
    'elektrokorund szlachetny': { bg: '#FFF0F6', border: '#d4c7bf', text: '#8093aa' },
    'elektrokorund zwykły': { bg: '#cfbeaf', border: '#5e3d27', text: '#434343' },
    'węglik krzemu czarny': { bg: '#E4E7EC', border: '#475467', text: '#101828' },
    'węglik krzemu zielony': { bg: '#E6F4EA', border: '#A3E2B7', text: '#137333' },
    'ziarna diamentowe': { bg: '#F0F0F0', border: '#756adf', text: '#333333' },
    'borazon': { bg: '#F0F0F0', border: '#282541', text: '#333333' },
};

export const gritData: Record<string, { type: string; range: string }> = {
    '24': { type: 'Zgrubna', range: 'Duże naddatki, szybkie zbieranie materiału' },
    '36': { type: 'Zgrubna', range: 'Wstępne oczyszczanie i usuwanie naddatków' },
    '46': { type: 'Średnia', range: 'Uniwersalne szlifowanie półwykańczające' },
    '60': { type: 'Średnia', range: 'Standardowe ostrzenie i wykańczanie powierzchni' },
    '80': { type: 'Wykańczająca', range: 'Precyzyjne wykańczanie i ostrzenie narzędzi' },
    '100': { type: 'Wykańczająca', range: 'Bardzo dokładne wygładzanie krawędzi' },
    '120': { type: 'Bardzo drobna', range: 'Superwykończenie i polerowanie końcowe' },
};

export const getGritHint = (gritValue: string | number, isMobile = false) => {
    const stringGrit = String(gritValue);
    const data = gritData[stringGrit];
    if (!data) return '';

    if (isMobile) return `${data.type}: ${data.range}`;

    return `Obróbka ${data.type.toLowerCase()}. Przeznaczenie: ${data.range}`;
};

export const wheelTypesData: Record<string, { name: string; desc: string }> = {
    '1': { name: 'Płaska (Typ 1)', desc: 'Klasyczna tarcza do szlifowania obwodowego.' },
    '3': { name: 'Stożkowa (Typ 3)', desc: 'Ściernica jednostronnie zbieżna, m.in. do gwintów i uzębień.' },
    '5': { name: 'Z wybraniem (Typ 5)', desc: 'Tarcza płaska z jednostronnym wgłębieniem pod flanszę mocującą.' },
    '6': { name: 'Garnkowa (Typ 6)', desc: 'Ściernica garnkowa cylindryczna do szlifowania czołowego płaszczyzn.' },
    '12': { name: 'Talerzykowa (Typ 12)', desc: 'Płaski talerzyk przeznaczony głównie do ostrzenia frezów i narzędzi.' },
    '27': { name: 'Wypukła (Typ 27)', desc: 'Tarcza z obniżonym środkiem do szlifowania szlifierką kątową.' },
    '41': { name: 'Do cięcia (Typ 41)', desc: 'Cienka tarcza przeznaczona wyłącznie do przecinania materiałów.' },
    '42': { name: 'Do cięcia wypukła (Typ 42)', desc: 'Tarcza do cięcia z obniżonym środkiem do szlifierek kątowych.' },
    '1A1': { name: 'Diamentowa płaska (1A1)', desc: 'Ściernica supertwarda z nasypem diamentowym/CBN na obwodzie.' },
    '1C': { name: 'Diamentowa profilowa (1C)', desc: 'Ściernica z promieniowym profilem nasypu, np. do ostrzenia pił.' },
    '4A2': { name: 'Diamentowa talerzykowa (4A2)', desc: 'Talerzyk diamentowy z warstwą tnącą na czołowej krawędzi.' },
    '6A2': { name: 'Diamentowa garnkowa (6A2)', desc: 'Garnek diamentowy/CBN do precyzyjnego szlifowania doczołowego.' },
    '11A2': { name: 'Diamentowa doniczkowa (11A2)', desc: 'Ściernica doniczkowa, doskonała do ostrzenia narzędzi skrawających.' },
    '5210': { name: 'Segment trapezowy (5210)', desc: 'Wymienny segment szlifierski montowany w głowicach doczołowych.' },
    '3113': { name: 'Segment łukowy (3113)', desc: 'Segment szlifierski w kształcie wycinka pierścienia.' },
};

export const getWheelTypeName = (typ: string | undefined): string => {
    if (!typ) return '—';
    return wheelTypesData[typ]?.name ?? `Typ ${typ}`;
};