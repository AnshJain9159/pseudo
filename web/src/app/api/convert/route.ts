// app/api/convert/route.ts
import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Get SVG string from request body
    const body = await req.json();
    const { svg } = body;

    if (!svg) {
      return NextResponse.json(
        { error: 'SVG data is required' },
        { status: 400 }
      );
    }

    // Convert SVG string to Buffer
    const svgBuffer = Buffer.from(svg);

    // Convert SVG to PNG using sharp
    const pngBuffer = await sharp(svgBuffer, { density: 300 })
      .png()
      .toBuffer();

    // Create headers for PNG response
    const headers = new Headers();
    headers.set('Content-Type', 'image/png');
    headers.set('Content-Disposition', 'attachment; filename="converted-image.png"');

    // Return PNG as response
    return new NextResponse(pngBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    return NextResponse.json(
      { error: 'Failed to convert SVG to PNG' },
      { status: 500 }
    );
  }
}

// Optionally handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}