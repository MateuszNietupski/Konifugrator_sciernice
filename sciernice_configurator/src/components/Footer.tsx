import { Box, Typography, Link } from "@mui/material";
import ContactData from "./ContactData";

export default function Footer() {
    return (
        <Box
            sx={(theme) => ({
                mt: 4,
                py: 3,
                px: 2,
                textAlign: "center",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.default,
            })}
        >
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                Nie znalazłeś odpowiedniej piły taśmowej?
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
                Skontaktuj się z nami — dostarczamy piły zgrzewane pod wymiar na indywidualne zapytanie – skontaktuj się z nami!
            </Typography>

            <ContactData/>
        </Box>
    );
}