import { NextRequest, NextResponse } from "next/server";
import {
  BuilderApiKeyCreds,
  buildHmacSignature,
} from "@polymarket/builder-signing-sdk";

const BUILDER_CREDENTIALS: BuilderApiKeyCreds = {
  key: process.env.POLYMARKET_BUILDER_API_KEY!,
  secret: process.env.POLYMARKET_BUILDER_SECRET!,
  passphrase: process.env.POLYMARKET_BUILDER_PASSPHRASE!,
};

// This route is used to sign messages for builder authentication (RelayClient) or order attribution (ClobClient)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, path, body: requestBody } = body;

    if (
      !BUILDER_CREDENTIALS.key ||
      !BUILDER_CREDENTIALS.secret ||
      !BUILDER_CREDENTIALS.passphrase
    ) {
      return NextResponse.json(
        { error: "Builder credentials not configured" },
        { status: 500 }
      );
    }

    if (!method || !path || !requestBody) {
      return NextResponse.json(
        { error: "Missing required parameters: method, path" },
        { status: 400 }
      );
    }

    const sigTimestamp = Date.now().toString();

    const signature = buildHmacSignature(
      BUILDER_CREDENTIALS.secret,
      parseInt(sigTimestamp),
      method,
      path,
      requestBody
    );

    return NextResponse.json({
      POLY_BUILDER_SIGNATURE: signature,
      POLY_BUILDER_TIMESTAMP: sigTimestamp,
      POLY_BUILDER_API_KEY: BUILDER_CREDENTIALS.key,
      POLY_BUILDER_PASSPHRASE: BUILDER_CREDENTIALS.passphrase,
    });
  } catch (error) {
    console.error("Signing error:", error);
    return NextResponse.json(
      { error: "Failed to sign message" },
      { status: 500 }
    );
  }
}
