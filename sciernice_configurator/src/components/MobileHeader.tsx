import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

type MobileHeaderProps = {
    filteredCount: number;
    totalCount: number;
    viewMode: string;
};

const MobileHeader = ({ filteredCount, totalCount, viewMode }: MobileHeaderProps) => {
    return (
        <Box
            sx={{
                px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider',
                bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 1.5,
            }}
        >
            <Link href="https://www.e-darmet.pl" target="_blank" rel="noopener" sx={{ display: 'flex', textDecoration: 'none' }}>
                <Box
                    sx={{
                        width: 120, height: 40, bgcolor: 'primary.main', borderRadius: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 10, letterSpacing: 1,
                    }}
                >
                    <img
                        src="https://www.e-darmet.pl/darmet_logo_1.webp"
                        alt="Darmet - Strona główna"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Box>
            </Link>
            <Typography variant="subtitle1" fontWeight={700} color="primary.main" sx={{ flex: 1 }}>
                {'Konfigurator Ściernic'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {filteredCount}/{totalCount}
            </Typography>
        </Box>
    );
}

export default MobileHeader;