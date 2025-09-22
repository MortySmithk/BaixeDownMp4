// app/api/content/route.ts

import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type?: 'movie' | 'tv';
}

const apiConfig = {
  movie: { path: '/discover/movie', searchPath: '/search/movie', type: 'movie' },
  series: { path: '/discover/tv', searchPath: '/search/tv', type: 'tv' },
  anime: { path: '/discover/tv', searchPath: '/search/tv', type: 'tv', params: '&with_keywords=210024' },
  dorama: { path: '/discover/tv', searchPath: '/search/tv', type: 'tv', params: '&with_keywords=18035' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'movie';
  const query = searchParams.get('query');
  const page = searchParams.get('page') || '1';

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'Chave da API do TMDb não configurada.' }, { status: 500 });
  }

  const config = apiConfig[type as keyof typeof apiConfig];
  if (!config) {
    return NextResponse.json({ error: 'Tipo de conteúdo inválido' }, { status: 400 });
  }

  let url = '';
  if (query) {
    // Se tem uma busca, usa o endpoint de pesquisa
    url = `${TMDB_BASE_URL}${config.searchPath}?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`;
  } else {
    // Senão, usa o endpoint de descoberta (populares)
    url = `${TMDB_BASE_URL}${config.path}?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}${config.params || ''}`;
  }

  try {
    const tmdbResponse = await fetch(url);
    if (!tmdbResponse.ok) throw new Error(`Erro na API do TMDb: ${tmdbResponse.statusText}`);

    const data = await tmdbResponse.json();

    const contentList = data.results
      .filter((item: TMDBResult) => item.poster_path) // Filtra itens sem poster
      .map((item: TMDBResult) => ({
        id: item.id.toString(),
        title: item.title || item.name || 'Título Desconhecido',
        posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        type: item.media_type || config.type,
      }));

    return NextResponse.json(contentList);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: 'Falha ao buscar dados do TMDb.', details: errorMessage }, { status: 500 });
  }
}