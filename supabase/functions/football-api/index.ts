
// Follow Deno APIs here: https://deno.land/api@v1.31.0

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FOOTBALL_API_BASE_URL = "https://v3.football.api-sports.io";
const BASKETBALL_API_BASE_URL = "https://v1.basketball.api-sports.io";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("API_FOOTBALL_KEY");
    if (!apiKey) {
      throw new Error("API_FOOTBALL_KEY is not set");
    }

    const url = new URL(req.url);
    const sport = url.searchParams.get("sport") || "football";
    const endpoint = url.searchParams.get("endpoint") || "fixtures";
    
    // Get other parameters
    const params = new URLSearchParams();
    for (const [key, value] of url.searchParams.entries()) {
      if (key !== "sport" && key !== "endpoint") {
        params.append(key, value);
      }
    }
    
    // Select the correct base URL based on the sport
    const baseUrl = sport === "basketball" 
      ? BASKETBALL_API_BASE_URL 
      : FOOTBALL_API_BASE_URL;
      
    // Construct the full API URL
    const apiUrl = `${baseUrl}/${endpoint}?${params.toString()}`;
    
    console.log(`Fetching from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        "x-apisports-key": apiKey,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API returned error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the API response with CORS headers
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
