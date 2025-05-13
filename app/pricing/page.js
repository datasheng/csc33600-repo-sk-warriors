"use client";

import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Grid,
  Paper,
  Avatar,
  Stack,
} from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StarIcon from '@mui/icons-material/Star';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import Link from "next/link";

// PricingCard component definition
function PricingCard({ tier }) {
  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        height: "100%",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
        ...(tier.title === "Plus" && {
          borderTop: "4px solid",
          borderColor: "primary.main",
          boxShadow: 3,
        }),
      }}
    >
      <CardContent>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          {tier.icon}
        </Box>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography component="h3" variant="h6">
            {tier.title}
          </Typography>
          {tier.subheader && (
            <Chip 
              icon={<AutoAwesomeIcon />} 
              label={tier.subheader} 
              color="primary"
              sx={{ fontWeight: "bold" }}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <Typography component="h3" variant="h2">
            ${tier.price}
          </Typography>
          <Typography component="h3" variant="h6">
            &nbsp; per month
          </Typography>
        </Box>
        <Divider
          sx={{ my: 2, opacity: 0.8, borderColor: "divider" }}
        />
        {tier.description.map((line, index) => (
          <Box
            key={index}
            sx={{
              py: 1,
              display: "flex",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <CheckCircleRoundedIcon
              sx={{
                width: 20,
                color: tier.title === "Plus" ? "primary.main" : "primary.main",
              }}
            />
            <Typography
              variant="subtitle2"
              component="span"
            >
              {line}
            </Typography>
          </Box>
        ))}
      </CardContent>
      <CardActions sx={{ mt: "auto" }}>
        <Button
          fullWidth
          variant={tier.buttonVariant}
          color={tier.buttonColor}
          component="a"
          href={tier.link}
          sx={{ 
            py: 1.2,
            fontWeight: "bold",
            borderRadius: 2
          }}
        >
          {tier.buttonText}
        </Button>
      </CardActions>
    </Card>
  );
}

export default function Pricing() {
  // Tiers data with icons added
  const tiers = [
    {
      title: "Free",
      price: "0",
      description: [
        "Free Account Setup",
        "1 mile radius from users location",
        "Upload 15 pictures a month",
        "12 ratings a month",
        "Limited Ads",
      ],
      buttonText: "Sign up for free",
      buttonVariant: "outlined",
      buttonColor: "primary",
      link: "/sign-up",
      icon: <PersonIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Plus",
      subheader: "Recommended",
      price: "4",
      description: [
        "10 mile radius view of from users location",
        "Upload 30 pictures a month",
        "30 ratings a month",
        "Promotions from Deli's",
        "No Ads",
      ],
      buttonText: "Start now",
      buttonVariant: "contained",
      buttonColor: "secondary",
      link: "/sign-up",
      icon: <StarIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Business",
      price: "8",
      description: [
        "Entire view of NYC",
        "Promotions from Deli's",
        "Add and remove deli listing upon approval",
        "Priotized comments and ratings",
        "No Ads",
      ],
      buttonText: "Contact us",
      buttonVariant: "outlined",
      buttonColor: "primary",
      link: "/contact",
      icon: <StorefrontIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Alex R.",
      role: "Food Enthusiast",
      comment: "Found the best pastrami sandwich through this app! The Plus membership is totally worth it.",
      avatar: "A",
    },
    {
      name: "Maria S.",
      role: "Deli Owner",
      comment: "The Business plan helped me connect with more customers. My deli's popularity has grown significantly!",
      avatar: "M",
    },
    {
      name: "David T.",
      role: "NYC Local",
      comment: "Even the free version is amazing for discovering local gems I never knew existed.",
      avatar: "D",
    },
  ];

  // FAQ Data
  const faqs = [
    {
      question: "Can I change plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
    },
    {
      question: "Is there a trial period?",
      answer: "As of now no. However, our plans are very affordable and even the free plan comes with a lot of benefits."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel anytime from your account settings. You'll continue to have access until the end of your current billing period."
    },
  ];

  return (
    <AppTheme>
      <AppAppBar />
      <Container
        id="pricing"
        sx={{
          pt: { xs: 17, sm: 25 },
          pb: { xs: 8, sm: 16 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        {/* Section Heading */}
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: "center",
          }}
        >
          <Typography
            component="h2"
            variant="h4"
            gutterBottom
            sx={{ 
              color: "text.primary",
            }}
          >
            Pricing
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Come join our fast and friendly community, We have options for every
            need. <br />
            Choose from our 3 member options and enjoy!
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Grid
          container
          spacing={3}
          sx={{ alignItems: "stretch", justifyContent: "center", width: "100%" }}
        >
          {tiers.map((tier) => (
            <Grid item xs={12} sm={6} md={4} key={tier.title}>
              <PricingCard tier={tier} />
            </Grid>
          ))}
        </Grid>

        {/* Testimonials Section */}
        <Box sx={{ width: "100%", mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}>
            What Our Users Say
          </Typography>
          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>{testimonial.avatar}</Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                      "{testimonial.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* FAQ Section */}
        <Box sx={{ width: "100%", mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}>
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={2}>
            {faqs.map((faq, index) => (
              <Grid item xs={12} key={index}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                    {faq.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* CTA Section */}
        <Box sx={{ mt: 8, p: 4, bgcolor: "secondary", borderRadius: 2, width: "100%", textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2, color: "primary.contrastText" }}>
            Ready to discover the best delis in town?
          </Typography>
          <Button variant="contained" color="secondary" size="large" href="/sign-up">
            Get Started Now
          </Button>
        </Box>
      </Container>
      <Footer />
    </AppTheme>
  );
}