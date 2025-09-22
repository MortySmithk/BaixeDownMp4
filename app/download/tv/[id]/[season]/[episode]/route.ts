// app/download/tv/[id]/[season]/[episode]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string; season: string; episode: string } }
) {
    const { id, season, episode } = params;
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || `serie_${id}_S${season}E${episode}`;
    const videoUrl = `https://roxanoplay.bb-bet.top/pages/proxys.php?id=${id}/${season}/${episode}`;

    try {
        const range = request.headers.get('range');
        const fetchHeaders = new Headers();
        if (range) {
            fetchHeaders.append('range', range);
        }

        const videoResponse = await fetch(videoUrl, { headers: fetchHeaders });

        if (!videoResponse.ok || !videoResponse.body) {
            const redirectUrl = new URL('/', request.url);
            redirectUrl.searchParams.set('error', 'Link do episódio indisponível.');
            return NextResponse.redirect(redirectUrl);
        }

        const responseHeaders = new Headers(videoResponse.headers);
        responseHeaders.set('Content-Disposition', `attachment; filename="${title}.mp4"`);
        responseHeaders.set('Accept-Ranges', 'bytes');
        responseHeaders.set('Content-Type', 'video/mp4');

        return new NextResponse(videoResponse.body, {
            status: videoResponse.status,
            statusText: videoResponse.statusText,
            headers: responseHeaders,
        });

    } catch (error) {
        console.error("Download Error (TV):", error);
        const redirectUrl = new URL('/', request.url);
        redirectUrl.searchParams.set('error', 'Erro ao processar o download do episódio.');
        return NextResponse.redirect(redirectUrl);
    }
}