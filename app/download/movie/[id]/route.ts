<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';

// Simplificando a tipagem do segundo argumento
export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || `filme_${id}`;
    const videoUrl = `https://roxanoplay.bb-bet.top/pages/hostmov.php?id=${id}`;

    try {
        const range = request.headers.get('range');
        const fetchHeaders = new Headers();
        if (range) {
            fetchHeaders.append('range', range);
        }

        const videoResponse = await fetch(videoUrl, { headers: fetchHeaders });

        if (!videoResponse.ok || !videoResponse.body) {
             const redirectUrl = new URL('/', request.url);
             redirectUrl.searchParams.set('error', 'Link do filme indisponível.');
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
        console.error("Download Error (Movie):", error);
        const redirectUrl = new URL('/', request.url);
        redirectUrl.searchParams.set('error', 'Erro ao processar o download do filme.');
        return NextResponse.redirect(redirectUrl);
    }
=======
import { NextRequest, NextResponse } from 'next/server';

// Simplificando a tipagem do segundo argumento
export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || `filme_${id}`;
    const videoUrl = `https://roxanoplay.bb-bet.top/pages/hostmov.php?id=${id}`;

    try {
        const range = request.headers.get('range');
        const fetchHeaders = new Headers();
        if (range) {
            fetchHeaders.append('range', range);
        }

        const videoResponse = await fetch(videoUrl, { headers: fetchHeaders });

        if (!videoResponse.ok || !videoResponse.body) {
             const redirectUrl = new URL('/', request.url);
             redirectUrl.searchParams.set('error', 'Link do filme indisponível.');
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
        console.error("Download Error (Movie):", error);
        const redirectUrl = new URL('/', request.url);
        redirectUrl.searchParams.set('error', 'Erro ao processar o download do filme.');
        return NextResponse.redirect(redirectUrl);
    }
>>>>>>> 4a62ad01a9abc2c55a29214b476f6347934a0596
}