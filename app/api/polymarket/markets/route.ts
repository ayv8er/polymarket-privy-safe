import { NextRequest, NextResponse } from "next/server";

const GAMMA_API = "https://gamma-api.polymarket.com";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit") || "10";

  try {
    // Fetch markets sorted by 24 hour volume
    const response = await fetch(
      `${GAMMA_API}/markets?limit=${limit}&offset=0&active=true&closed=false&order=volume24hr&ascending=false`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.error("Gamma API error:", response.status);
      throw new Error(`Gamma API error: ${response.status}`);
    }

    const markets = await response.json();

    if (!Array.isArray(markets)) {
      console.error("Invalid response structure:", markets);
      return NextResponse.json(
        { error: "Invalid API response" },
        { status: 500 }
      );
    }

    const validMarkets = markets.filter((market: any) => {
      if (market.events && market.events.length > 0) {
        const hasEndedEvent = market.events.some((event: any) => 
          event.ended === true || 
          event.live === false || 
          event.finishedTimestamp
        );
        if (hasEndedEvent) return false;
      }

      if (market.acceptingOrders === false) return false;

      if (!market.clobTokenIds) return false;

      return true;
    });

    const limitedMarkets = validMarkets.slice(0, parseInt(limit));

    return NextResponse.json(limitedMarkets);
  } catch (error) {
    console.error("Error fetching markets:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch markets",
      },
      { status: 500 }
    );
  }
}
