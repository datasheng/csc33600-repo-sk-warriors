import { Box, Typography } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";


export default function AboutUs() {
    return (
        <>
        <AppAppBar></AppAppBar>

        <Box>
            <Typography>
                About us page in here
            </Typography>
        </Box>

        <Footer></Footer>
        </>
    )
}