// app/api/episodes/route.ts

import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface SeasonData {
  season_number: number;
  episode_count: number;
}

interface SeriesDetails {
  seasons: SeasonData[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get('tmdbId');
  const title = searchParams.get('title');

  if (!tmdbId || !title) {
    return NextResponse.json({ error: 'ID do TMDb e Título são obrigatórios' }, { status: 400 });
  }
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'Chave da API do TMDb não configurada.' }, { status: 500 });
  }

  try {
    const tmdbUrl = `${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const tmdbResponse = await fetch(tmdbUrl);
    const tmdbData: SeriesDetails = await tmdbResponse.json();

    const seasons = tmdbData.seasons
      .filter(s => s.season_number > 0)
      .map(s => {
        const episodes = [];
        for (let i = 1; i <= s.episode_count; i++) {
          episodes.push({
            episode: i,
            downloadUrl: `https://roxanoplay.bb-bet.top/pages/proxys.php?id=${tmdbId}/${s.season_number}/${i}`
          });
        }
        return {
          season: s.season_number,
          episodes: episodes,
        };
      });
      
    return NextResponse.json(seasons);

  } catch (error) {
    console.error('Erro ao buscar episódios:', error);
    return NextResponse.json({ error: 'Falha ao buscar detalhes da série.' }, { status: 500 });
  }
}