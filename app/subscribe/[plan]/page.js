
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function SubscribePage() {

  const user      = useUser();           
  const router    = useRouter();
  const pathname  = usePathname();       
  const plan      = pathname.split("/").pop() || "plus";

  const [status,   setStatus]   = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

 
  useEffect(() => {
   
    if (user === undefined) return;

   
    if (user === null) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
      return;
    }

  
    const subscribe = async () => {
      try {
        const res = await fetch(`/api/subscribe/${plan}`, {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          setStatus("success");
          setTimeout(() => router.push("/dashboard"), 2000);
          return;
        }

        if (res.status === 400 && data?.error?.includes("active")) {
          setStatus("already");
          setTimeout(() => router.push("/dashboard"), 2000);
          return;
        }

        setErrorMsg(data?.detail || data?.error || "Unknown error");
        setStatus("error");
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
        setStatus("error");
      }
    };

    subscribe();
  }, [user, router, plan, pathname]);

  
  const prettyPlan =
    plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      {status === "loading" && <CircularProgress />}

      {status === "success" && (
        <Typography variant="h6" color="success.main">
          You’re now subscribed to {prettyPlan}! Redirecting…
        </Typography>
      )}

      {status === "already" && (
        <Typography variant="h6" color="text.secondary">
          You already have an active {prettyPlan} subscription. Redirecting…
        </Typography>
      )}

      {status === "error" && (
        <Typography color="error.main">
          Something went wrong: {errorMsg || "please try again later."}
        </Typography>
      )}
    </Box>
  );
}
