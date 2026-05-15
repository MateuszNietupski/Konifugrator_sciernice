import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import ContactData from "./ContactData";

interface CustomNoRowsOverlayProps { }

export default function CustomNoRowsOverlay({ }: CustomNoRowsOverlayProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            px: isMobile ? 2 : 5,
            gap: 2,
        }}>
            <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                color="primary.main"
                sx={{ fontWeight: 800 }}
            >
                Brak wyników wyszukiwania
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    maxWidth: isMobile ? '100%' : 600,
                    color: 'text.secondary',
                    whiteSpace: isMobile ? 'normal' : 'balance'
                }}
            >
                Obecnie nie posiadamy w standardowej ofercie ściernic o wybranych parametrach.
                Spróbuj zmienić lub zresetować filtry wyszukiwania, aby zobaczyć zbliżone modele.
                <br /><br />
                Potrzebujesz produktu o niestandardowych wymiarach lub specyfikacji?
                Realizujemy zamówienia indywidualne – skontaktuj się z nami!
            </Typography>

            <ContactData />
        </Box>
    );
}