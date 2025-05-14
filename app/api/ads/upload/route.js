// app/api/ads/upload.js
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // to support form-data

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ⚠️ Replace this with actual upload logic
    // For now, pretend the file is uploaded and return a fake image URL
    const fakeUrl = `https://via.placeholder.com/300?text=Ad+Image`;

    return NextResponse.json({ url: fakeUrl }, { status: 200 });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
