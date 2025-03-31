
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

    // Parse the request body
    let requestData = {};
    if (req.method === "POST") {
      try {
        requestData = await req.json();
      } catch (error) {
        console.error("Error parsing request body:", error);
        throw new Error("Invalid request body");
      }
    }

    const { sport = "football", endpoint = "fixtures", ...params } = requestData;
    
    // Select the correct base URL based on the sport
    const baseUrl = sport === "basketball" 
      ? BASKETBALL_API_BASE_URL 
      : FOOTBALL_API_BASE_URL;
    
    // Build the query parameters
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    }
    
    // Construct the full API URL
    const apiUrl = `${baseUrl}/${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    console.log(`Fetching from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        "x-apisports-key": apiKey,
      },
    });
    
    const data = await response.json();
    
    // Log API response for debugging
    console.log(`API Response status: ${response.status}`);
    console.log(`API Response data:`, JSON.stringify(data).substring(0, 200) + "...");
    
    // Handle API rate limit or other errors
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error("API Error:", data.errors);
      
      // Return the error response with appropriate status code
      return new Response(JSON.stringify({
        success: false,
        errors: data.errors,
        message: "API Error occurred"
      }), {
        status: 429, // Rate limit or other API error
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }
    
    // Return the API response with CORS headers
    return new Response(JSON.stringify({
      success: true,
      data: data
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error.message);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      message: "Server error occurred"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
