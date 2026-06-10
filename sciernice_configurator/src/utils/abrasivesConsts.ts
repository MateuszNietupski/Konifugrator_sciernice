export const materialDescriptions: Record<string, string> = {
    'elektrokorund szlachetny': '99A Najczystszy elektrokorund, o jednolitej strukturze ziaren. Charakteryzuje się wysoką trwałością i kruchością. Stosowany do szlifowania precyzyjnego np: szlifowanie płaszczyzn, szlifowanie cylidnryczne, ostrzenie narzędzie skrawających.',
    'elektrokorund zwykły': '95A Jest najbardziej wytrzymałym elektrokorundem charakteryzującym się wysoką ciągliwością. Stosowany do przecinania i zgrubnego szlifowania niskostopowych stali, stali niedzewnych, żeliwa, szczególnie przy dużych naddatkach zbieranego materiału.',
    'elektrokorund chromowy': '98A Charakteryzuje się dużą twardością i wytrzymałością, większą od elektrokorundu szlachetnego. Stosowany do precyzyjnego szlifowania stali wysokostopowych i do ostrzenia narzędzi skrawających.',
    'elektorkorund cyrkonowy': 'ZrA Charakteryzuje się najwyższą wśród elektrokorundów ciągliwością i wytrzymałością mechaniczną. Stosowany do wysokowydajnego szlifowania żeliwa, do szlifowania półfabrykatów stalowych z dużymi naciskami.',
    'węglik krzemu czarny': '98C Stosowany podobnie jak 99C do szlifowania węglików spiekanych, materiałów ceramicznych, betomnu, kamienia, do zgrubnego szlifowania odlewów z twardego i kruchego żeliwa białego oraz do przecinania betonu, kamienia, żeliwa białego.',
    'węglik krzemu zielony': '99C Stosowany do szlifowania węglików spiekanych, ceramiki, kamini, do ostrzenia narzędzi skrawających z ostrzami z węglików spiekanych.',
    'ziarna diamentowe': 'Najtwardszy materiał ścierniczy. Charakteryzujący się wyjątkową odpornością na zużycie oraz wytrzymałością termiczną. Stosowany do szlifowania szkła, ceramiki, kamienia, tworzyw sztucznych, grafitu, żeliwa. Ze względu na reaktywność diamentu z żelazem, nie zaleca się do obróki narzędzi wykonanych ze stali.',
    'borazon (CBN)': 'CBN ma mniejszą w porównaniu z diamentem twardość, drugi ale znacznie lepszą odporność cieplną do 1200°C oraz nie reaguje chemicznie z żelazem. Stosuje się go szlifowania wszelkiego rodzaju stali głównie powyżej 50 HRC.'
};

export const materialColors: Record<string, { bg: string; border: string; text: string }> = {
    'elektrokorund chromowy': { bg: '#FFF0F6', border: '#FFADD2', text: '#C41D7F' },
    'elektrokorund szlachetny': { bg: '#FFF0F6', border: '#d4c7bf', text: '#8093aa' },
    'elektrokorund zwykły': { bg: '#cfbeaf', border: '#5e3d27', text: '#434343' },
    'elektorkorund cyrkonowy': {
        bg: '#E3F2FD',      
        border: '#2196F3',  
        text: '#0D47A1'     
    },
    'węglik krzemu czarny': { bg: '#babfca', border: '#475467', text: '#101828' },
    'węglik krzemu zielony': { bg: '#E6F4EA', border: '#A3E2B7', text: '#137333' },
    'ziarna diamentowe': { bg: '#F0F0F0', border: '#756adf', text: '#333333' },
    'borazon (CBN)': { bg: '#F0F0F0', border: '#282541', text: '#333333' },
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
    // --- ŚCIERNICE KONWENCJONALNE PŁASKIE I NARZĘDZIOWE (ISO 525) ---
    '1': {
        name: 'Płaska prostokątna (Typ 1)',
        desc: 'Klasyczna ściernica konwencjonalna o prostokątnym przekroju. Służy do szlifowania obwodowego wałków, płaszczyzn oraz uniwersalnego ostrzenia.'
    },
    '5': {
        name: 'Jednostronne wybranie (Typ 5)',
        desc: 'Tarcza płaska z jednostronnym wgłębieniem walcowym. Pozwala na schowanie flanszy mocującej, stosowana często przy szlifowaniu płaszczyzn.'
    },
    '36': {
        name: 'Gwintowana wkładka (Typ 36)',
        desc: 'Ściernica tarczowa z zatopionymi od czoła nakrętkami montażowymi. Przeznaczona do szlifowania doczołowego na szlifierkach specjalistycznych.'
    },

    // --- ŚCIERNICE SUPERTWARDE (DIAMENT/CBN - ISO 6168 / FEPA) ---
    '1A1': {
        name: 'Płaska obwodowa (1A1)',
        desc: 'Ściernica supertwarda (diament/CBN) o prostokątnym przekróju korpusu. Służy do precyzyjnego szlifowania płaskiego, wałków i nacinania rowków.'
    },
    '14A1': {
        name: 'Profilowa z odciążeniem (14A1)',
        desc: 'Ściernica supertwarda (diament/CBN) z przewężeniem korpusu i fabrycznie nadaną geometrią roboczą. Głównie do precyzyjnego ostrzenia pił taśmowych.'
    },

    // --- ŚCIERNICE KONWENCJONALNE PROFILOWE (ISO 525) ---
    '1C': {
        name: 'Jednostronnie ścięta stożkowo (Typ 1C)',
        desc: 'Ściernica konwencjonalna, której profil boczny schodzi się stożkowo z jednej strony w kierunku obwodu. Stosowana do ostrzenia piór i ostrzy.'
    },
    '1YC': {
        name: 'Dwustronnie ścięta z promieniem (Typ 1YC)',
        desc: 'Ściernica konwencjonalna o symetrycznym zbieżnym profilu z zaokrąglonym czołem roboczym. Typowa do szlifowania zarysów gwintów i wrębów pił.'
    },

    // --- ŚCIERNICE DO SZLIFIEREK KĄTOWYCH (ISO 603-14) ---
    '27': {
        name: 'Wypukła z obniżonym środkiem (Typ 27)',
        desc: 'Dla tarcz zgrubnych: obniżony środek do ciężkiego szlifowania. Dla tarcz lamelkowych: płaskie ułożenie listków do obróbki płaszczyzn.'
    },
    '29': {
        name: 'Stożkowa lamelkowa (Typ 29)',
        desc: 'Tarcza lamelkowa ze skośnym ułożeniem płatków. Przeznaczona do agresywnego szlifowania krawędzi i ciężkich spoin.'
    },

    // === ŚCIERNICE GARNKOWE I KUBKOWE ===
    '6': { name: 'Garnkowa walcowa (Typ 6)', desc: 'Ściernica garnkowa cylindryczna do szlifowania czołowego płaszczyzn.' },
    '6A2': { name: 'Garnkowa obwodowo-czołowa (6A2)', desc: 'Garnek supertwardy (diament/CBN) do precyzyjnego szlifowania doczołowego i ostrzenia narzędzi.' }, // Usunięte "diamentowa"
    '6001': { name: 'Garnkowa walcowa z gwintem (Typ 6001)', desc: 'Ściernica garnkowa z wkładką gwintową M14 szybkiego montażu.' },
    '6002': { name: 'Garnkowa walcowa z gwintem (Typ 6002)', desc: 'Ściernica garnkowa ze zintegrowaną od tyłu wkładką mocującą.' },
    '6003': { name: 'Garnkowa walcowa z gwintem (Typ 6003)', desc: 'Ściernica garnkowa z wkładką gwintową do szlifierek czołowo-płaszczyznowych.' },
    '6004': { name: 'Garnkowa walcowa z gwintem (Typ 6004)', desc: 'Ściernica garnkowa o grubym profilu ścianki z wkładką gwintową.' },
    '6005': { name: 'Garnkowa walcowa z gwintem (Typ 6005)', desc: 'Wysoka ściernica garnkowa walcowa z mocowaniem gwintowym do głębokich założeń.' },
    '11': { name: 'Garnkowa stożkowa (Typ 11)', desc: 'Ściernica garnkowa o skośnych ściankach, stosowana w ostrzałkach narzędziowych.' },
    '11A2': { name: 'Doniczkowa stożkowa (11A2)', desc: 'Ściernica doniczkowa supertwarda (diament/CBN), doskonała do ostrzenia narzędzi skrawających.' }, // Usunięte "diamentowa"
    '1112': { name: 'Garnkowa stożkowa z gwintem (1112)', desc: 'Ściernica stożkowa ze zintegrowaną wkładką gwintową.' },
    '1113': { name: 'Garnkowa stożkowa z gwintem (1113)', desc: 'Ściernica stożkowa z mocowaniem gwintowym do pracy doczołowej.' },
    '1114': { name: 'Garnkowa stożkowa z gwintem (1114)', desc: 'Wzmocniona ściernica garnkowa stożkowa z wkładką gwintową.' },
    '12': { name: 'Talerzowa (Typ 12)', desc: 'Płaski talerzyk o skośnej krawędzi przeznaczony głównie do ostrzenia frezów i noży.' },
    '12A2': { name: 'Talerzowa skośna (12A2)', desc: 'Ściernica talerzowa supertwarda (diament/CBN) do precyzyjnego ostrzenia pod kątem.' }, // Usunięte "diamentowa"
    '4A2': { name: 'Talerzykowa płaska (4A2)', desc: 'Talerzyk supertwardy (diament/CBN) z wąską warstwą tnącą na czołowej krawędzi.' }, // Usunięte "diamentowa"

    // === SEGMENTY ŚCIERNE ===
    '3101': { name: 'Segment prostokątny (Typ 3101)', desc: 'Wymienny segment ścierny o przekroju prostokątnym do głowic szlifierskich.' },
    '3103': { name: 'Segment trapezowo-pierścieniowy (3103)', desc: 'Segment w kształcie trapezu z promieniem, do montażu w kołach segmentowych.' },
    '3109': { name: 'Segment trapezowy (Typ 3109)', desc: 'Wymienny element ścierny o zbieżnym kształcie trapezowym.' },
    '3110': { name: 'Segment profilowy (Typ 3110)', desc: 'Dedykowany segment ścierny do precyzyjnego szlifowania płaszczyzn.' },
    '3113': { name: 'Segment łukowy profilowany (3113)', desc: 'Segment szlifierski w kształcie wycinka pierścienia z profilem roboczym.' },
    '3121': { name: 'Segment prostokątny z gwintami (3121)', desc: 'Segment prostokątny wyposażony w dwie wkładki gwintowe do mocowania.' },

    // === ŚCIERNICE TRZPIENIOWE ===
    '5210': { name: 'Ściernica trzpieniowa walcowa (5210)', desc: 'Mała ściernica walcowa na stalowym trzpieniu do mikroszlifowania i czyszczenia.' },
    '5211': { name: 'Ściernica trzpieniowa walcowo-stożkowa (5211)', desc: 'Ściernica trzpieniowa ze ścięciem, łącząca profil walca i stożka.' },
    '5220': { name: 'Ściernica trzpieniowa stożkowa (5220)', desc: 'Ściernica na trzpieniu o profilu stożkowym z zaokrąglonym wierzchołkiem.' },
    '5230': { name: 'Ściernica trzpieniowa kulista (5230)', desc: 'Ściernica trzpieniowa o kształcie kuli do obróbki otworów i gniazd.' },

    // === OSEŁKI ===
    '9010': { name: 'Osełka prostokątna (Typ 9010)', desc: 'Tradycyjny kamień szlifierski do ręcznego ostrzenia i gładzenia krawędzi.' },
    '9010Y': { name: 'Osełka prostokątna warstwowa (9010Y)', desc: 'Specjalistyczna osełka dwuwarstwowa o różnych granulacjach.' },
    '9011': { name: 'Osełka trójkątna (Typ 9011)', desc: 'Kamień o przekroju trójkątnym do czyszczenia kątów i rowków.' },
    '9020': { name: 'Osełka wielowarstwowa (9020)', desc: 'Precyzyjna osełka o drobnej strukturze do superwykończenia i gładzenia.' }, // Usunięte "Schichtschleifstein"
    '9050': { name: 'Osełka owalna (Typ 9050)', desc: 'Kamień szlifierski o przekroju owalnym, idealny do ostrzy krzywoliniowych.' }
};

export const getWheelTypeName = (typ: string | undefined): string => {
    if (!typ) return '—';
    return wheelTypesData[typ]?.name ?? `Typ ${typ}`;
};


