"use client";

import { Container, Typography,Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Button} from "@mui/material";

export default function CompareTable() {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Compare Plans
        </Typography>
  
        <TableContainer component={Paper}>
          <Table aria-label="compare plans table">
            <TableHead>
              {/* First header row: plan names */}
              <TableRow>
                <TableCell />
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Free
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Plus
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Business
                </TableCell>
              </TableRow>
  
              {/* Second header row: action buttons */}
              <TableRow>
                <TableCell />
                <TableCell align="center">
                  <Button variant="outlined">Sign Up for Free</Button>
                </TableCell>
                <TableCell align="center">
                  <Button variant="outlined">Upgrade to Plus</Button>
                </TableCell>
                <TableCell align="center">
                  <Button variant="outlined">Contact Sales</Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Miles Radius</TableCell>
                <TableCell align="center">1 mile</TableCell>
                <TableCell align="center">10 miles</TableCell>
                <TableCell align="center">NYC-wide</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pictures per Month</TableCell>
                <TableCell align="center">15</TableCell>
                <TableCell align="center">30</TableCell>
                <TableCell align="center">Unlimited</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ratings / Comments</TableCell>
                <TableCell align="center">12/mo</TableCell>
                <TableCell align="center">30/mo</TableCell>
                <TableCell align="center">Unlimited</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Certified Symbol</TableCell>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Yes</TableCell>
                <TableCell align="center">Yes (Owner)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Deli Recommendation Priority</TableCell>
                <TableCell align="center">Regular Listing</TableCell>
                <TableCell align="center">Regular Listing</TableCell>
                <TableCell align="center">Top Recommended</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ads</TableCell>
                <TableCell align="center">Limited Ads</TableCell>
                <TableCell align="center">No Ads</TableCell>
                <TableCell align="center">No Ads</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Listing Control</TableCell>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Yes (Upon Approval)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Customer Support</TableCell>
                <TableCell align="center">Basic</TableCell>
                <TableCell align="center">Priority</TableCell>
                <TableCell align="center">24/7 Support</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }
  