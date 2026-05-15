import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/LocalPhone";


export default function ContactData() {
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <EmailIcon sx={{ fontSize: 20 }} />
                <Link href="mailto:handel@darmet.com.pl" sx={{ color: "inherit", textDecoration: "none", fontWeight: "bold" }}>
                    handel@darmet.com.pl
                </Link>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 20 }} />
                <Link href="tel:+48123456789" sx={{ color: "inherit", textDecoration: "none", fontWeight: "bold" }}>
                    85 653 86 70
                </Link>
            </Box>
        </>
    );
}