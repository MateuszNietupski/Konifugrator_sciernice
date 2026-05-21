export const materialDescriptions: Record<string, string> = {
    'elektrokorund szlachetny': '99A Najczystszy elektrokorund, o jednolitej strukturze ziaren. Charakteryzuje się wysoką trwałością i kruchością. Stosowany do szlifowania precyzyjnego np: szlifowanie płaszczyzn, szlifowanie cylidnryczne, ostrzenie narzędzie skrawających.',
    'elektrokorund zwykły': '97A Jest najbardziej wytrzymałym elektrokorundem charakteryzującym się wysoką ciągliwością. Stosowany do przecinania i zgrubnego szlifowania niskostopowych stali, stali niedzewnych, żeliwa, szczególnie przy dużych naddatkach zbieranego materiału.',
    'elektrokorund chromowy': '98A Charakteryzuje się dużą twardością i wytrzymałością, większą od elektrokorundu szlachetnego. Stosowany do precyzyjnego szlifowania stali wysokostopowych i do ostrzenia narzędzi skrawających.',
    'węglik krzemu czarny': '98C Stosowany podobnie jak 99C do szlifowania węglików spiekanych, materiałów ceramicznych, betomnu, kamienia, do zgrubnego szlifowania odlewów z twardego i kruchego żeliwa białego oraz do przecinania betonu, kamienia, żeliwa białego.',
    'węglik krzemu zielony': '99C Stosowany do szlifowania węglików spiekanych, ceramiki, kamini, do ostrzenia narzędzi skrawających z ostrzami z węglików spiekanych.',
    'ziarna diamentowe': 'Najtwardszy materiał ścierniczy. Charakteryzujący się wyjątkową odpornością na zużycie oraz wytrzymałością termiczną. Stosowany do szlifowania szkła, ceramiki, kamienia, tworzyw sztucznych, grafitu, żeliwa. Ze względu na reaktywność diamentu z żelazem, nie zaleca się do obróki narzędzi wykonanych ze stali.',
    'borazon (CBN)': 'CBN ma mniejszą w porównaniu z diamentem twardość, drugi ale znacznie lepszą odporność cieplną do 1200°C oraz nie reaguje chemicznie z żelazem. Stosuje się go szlifowania wszelkiego rodzaju stali głównie powyżej 50 HRC.'
};

export const materialColors: Record<string, { bg: string; border: string; text: string }> = {
    'elektrokorund chromowy': { bg: '#FFF0F6', border: '#FFADD2', text: '#C41D7F' },
    'elektrokorund szlachetny': { bg: '#FFF0F6', border: '#d4c7bf', text: '#8093aa' },
    'elektrokorund zwykły': { bg: '#cfbeaf', border: '#5e3d27', text: '#434343' },
    'węglik krzemu czarny': { bg: '#E4E7EC', border: '#475467', text: '#101828' },
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
    // === ŚCIERNICE PŁASKIE I TARCZOWE ===
    '1': { name: 'Ściernica płaska (Typ 1)', desc: 'Klasyczna tarcza do szlifowania obwodowego wałków, płaszczyzn i ostrzenia.' },
    '1A1': { name: 'Diamentowa płaska (1A1)', desc: 'Ściernica supertwarda z nasypem diamentowym/CBN na obwodzie.' },
    '1C': { name: 'Diamentowa profilowa (1C)', desc: 'Ściernica z promieniowym profilem nasypu, np. do ostrzenia pił.' },
    '1YC': { name: 'Diamentowa profilowa wąska (1YC)', desc: 'Specjalistyczna ściernica profilowa o jednostronnym ścięciu nasypu.' },
    '5': { name: 'Z wybraniem walcowym (Typ 5)', desc: 'Tarcza płaska z jednostronnym wgłębieniem pod flanszę mocującą.' },
    '27': { name: 'Wypukła do szlifowania (Typ 27)', desc: 'Tarcza z obniżonym środkiem do szlifowania zgrubnego szlifierką kątową.' },
    '36': { name: 'Tarczowa z gwintami (Typ 36)', desc: 'Ściernica tarczowa z zatopionymi wkładkami gwintowymi do mocowania.' },

    // === ŚCIERNICE GARNKOWE I KUBKOWE ===
    '6': { name: 'Garnkowa walcowa (Typ 6)', desc: 'Ściernica garnkowa cylindryczna do szlifowania czołowego płaszczyzn.' },
    '6A2': { name: 'Diamentowa garnkowa (6A2)', desc: 'Garnek diamentowy/CBN do precyzyjnego szlifowania doczołowego i ostrzenia.' },
    '6001': { name: 'Garnkowa z gwintem (Typ 6001)', desc: 'Ściernica garnkowa walcowa z wkładką gwintową szybkiego montażu.' },
    '6002': { name: 'Garnkowa z gwintem (Typ 6002)', desc: 'Ściernica garnkowa walcowa ze zintegrowaną wkładką mocującą.' },
    '6003': { name: 'Garnkowa z gwintem (Typ 6003)', desc: 'Ściernica garnkowa z wkładką gwintową do szlifierek czołowych.' },
    '6004': { name: 'Garnkowa z gwintem (Typ 6004)', desc: 'Ściernica garnkowa walcowa o podwyższonej wytrzymałości z gwintem.' },
    '6005': { name: 'Garnkowa z gwintem (Typ 6005)', desc: 'Wysoka ściernica garnkowa walcowa z mocowaniem gwintowym.' },
    '11': { name: 'Garnkowa stożkowa (Typ 11)', desc: 'Ściernica garnkowa o skośnych ściankach, stosowana w ostrzałkach narzędziowych.' },
    '11A2': { name: 'Diamentowa doniczkowa (11A2)', desc: 'Ściernica doniczkowa stożkowa, doskonała do ostrzenia narzędzi skrawających.' },
    '1112': { name: 'Garnkowa stożkowa z gwintem (1112)', desc: 'Ściernica stożkowa ze zintegrowaną wkładką gwintową.' },
    '1113': { name: 'Garnkowa stożkowa z gwintem (1113)', desc: 'Ściernica stożkowa z mocowaniem gwintowym do pracy doczołowej.' },
    '1114': { name: 'Garnkowa stożkowa z gwintem (1114)', desc: 'Wzmocniona ściernica garnkowa stożkowa z wkładką gwintową.' },
    '12': { name: 'Talerzowa (Typ 12)', desc: 'Płaski talerzyk o skośnej krawędzi przeznaczony głównie do ostrzenia frezów.' },
    '12A2': { name: 'Diamentowa talerzowa (12A2)', desc: 'Ściernica talerzowa diamentowa/CBN do precyzyjnego ostrzenia pod kątem.' },
    '4A2': { name: 'Diamentowa talerzykowa płaska (4A2)', desc: 'Talerzyk diamentowy z wąską warstwą tnącą na czołowej krawędzi.' },

    // === SEGMENTY ŚCIERNE (SERIA 3100) ===
    '3101': { name: 'Segment prostokątny (Typ 3101)', desc: 'Wymienny segment ścierny o przekroju prostokątnym do głowic szlifierskich.' },
    '3103': { name: 'Segment trapezowo-pierścieniowy (3103)', desc: 'Segment w kształcie trapezu z promieniem, do montażu w kołach segmentowych.' },
    '3109': { name: 'Segment trapezowy (Typ 3109)', desc: 'Wymienny element ścierny o zbieżnym kształcie trapezowym.' },
    '3110': { name: 'Segment profilowy (Typ 3110)', desc: 'Dedykowany segment ścierny do precyzyjnego szlifowania płaszczyzn.' },
    '3113': { name: 'Segment łukowy profilowany (3113)', desc: 'Segment szlifierski w kształcie wycinka pierścienia z profilem roboczym.' },
    '3121': { name: 'Segment prostokątny z gwintami (3121)', desc: 'Segment prostokątny wyposażony w dwie wkładki gwintowe do mocowania.' },

    // === ŚCIERNICE TRZPIENIOWE (SERIA 5200) ===
    '5210': { name: 'Ściernica trzpieniowa walcowa (5210)', desc: 'Mała ściernica walcowa na stalowym trzpieniu do mikroszlifowania i czyszczenia.' },
    '5211': { name: 'Ściernica trzpieniowa walcowo-stożkowa (5211)', desc: 'Ściernica trzpieniowa ze ścięciem, łącząca profil walca i stożka.' },
    '5220': { name: 'Ściernica trzpieniowa stożkowa (5220)', desc: 'Ściernica na trzpieniu o profilu stożkowym z zaokrąglonym wierzchołkiem.' },
    '5230': { name: 'Ściernica trzpieniowa kulista (5230)', desc: 'Ściernica trzpieniowa o kształcie kuli do obróbki otworów i gniazd.' },

    // === OSEŁKI (SERIA 9000) ===
    '9010': { name: 'Osełka prostokątna (Typ 9010)', desc: 'Tradycyjny kamień szlifierski do ręcznego ostrzenia i gładzenia krawędzi.' },
    '9010Y': { name: 'Osełka prostokątna warstwowa (9010Y)', desc: 'Specjalistyczna osełka dwuwarstwowa o różnych granulacjach.' },
    '9011': { name: 'Osełka trójkątna (Typ 9011)', desc: 'Kamień o przekroju trójkątnym do czyszczenia kątów i rowków.' },
    '9020': { name: 'Osełka Schichtschleifstein (9020)', desc: 'Warstwowy kamień szlifierski o drobnej strukturze do superwykończenia.' },
    '9050': { name: 'Osełka owalna (Typ 9050)', desc: 'Kamień szlifierski o przekroju owalnym, idealny do ostrzy krzywoliniowych.' }
};

export const getWheelTypeName = (typ: string | undefined): string => {
    if (!typ) return '—';
    return wheelTypesData[typ]?.name ?? `Typ ${typ}`;
};


