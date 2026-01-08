import { NextRequest, NextResponse } from 'next/server';

// This is a server-side API route for generating Power BI embed tokens
// In production, you would use environment variables for credentials

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, clientSecret, tenantId, workspaceId, reportId } = body;

    // Validate required fields
    if (!clientId || !clientSecret || !tenantId || !workspaceId || !reportId) {
      return NextResponse.json(
        { error: 'Missing required configuration' },
        { status: 400 }
      );
    }

    // Step 1: Get Azure AD access token
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://analysis.windows.net/powerbi/api/.default',
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token acquisition failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to acquire access token' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Generate embed token for the report
    const embedUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`;
    
    const embedResponse = await fetch(embedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        accessLevel: 'View',
        allowSaveAs: false,
      }),
    });

    if (!embedResponse.ok) {
      const errorText = await embedResponse.text();
      console.error('Embed token generation failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate embed token' },
        { status: embedResponse.status }
      );
    }

    const embedData = await embedResponse.json();

    return NextResponse.json({
      embedToken: embedData.token,
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`,
      reportId: reportId,
      expiresAt: embedData.expiration,
    });

  } catch (error) {
    console.error('Power BI embed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
