"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

// --- Interfaces ---
interface ContentItem {
  id: string;
  title: string;
  posterUrl: string;
  type: 'movie' | 'tv';
}
interface Episode {
  episode: number;
  downloadUrl: string;
}
interface Season {
  season: number;
  episodes: Episode[];
}
type TabType = 'movie' | 'series' | 'anime' | 'dorama';

// --- Componentes ---

function ErrorDisplay() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
  
    useEffect(() => {
        if(error) {
            alert(error);
            window.history.replaceState(null, '', window.location.pathname);
        }
    }, [error]);

    return null;
}


function SeriesModal({ content, onClose }: { content: ContentItem; onClose: () => void; }) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSeason, setActiveSeason] = useState<number | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(`/api/episodes?tmdbId=${content.id}&title=${encodeURIComponent(content.title)}`);
        if (!response.ok) throw new Error('Falha ao carregar episódios.');
        const data = await response.json();
        setSeasons(data);
        if (data.length > 0) setActiveSeason(data[0].season);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEpisodes();
  }, [content]);

  const handleDownloadEpisode = (seasonNumber: number, episodeNumber: number) => {
    const fileName = `${content.title.replace(/[^a-z0-9]/gi, '_')}_S${String(seasonNumber).padStart(2, '0')}E${String(episodeNumber).padStart(2, '0')}`;
    window.location.href = `/download/tv/${content.id}/${seasonNumber}/${episodeNumber}?title=${encodeURIComponent(fileName)}`;
  };

  const currentSeasonData = seasons.find(s => s.season === activeSeason);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{content.title}</h3>
        {isLoading && <p>Carregando episódios...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && seasons.length > 0 && (
          <>
            <div className="season-tabs">
              {seasons.map(s => <button key={s.season} onClick={() => setActiveSeason(s.season)} className={activeSeason === s.season ? 'active' : ''}>Temp {s.season}</button>)}
            </div>
            {currentSeasonData && (
              <div className="episode-list">
                {currentSeasonData.episodes.map(ep => (
                  <div key={ep.episode} className="episode-item">
                    <span>Episódio {ep.episode}</span>
                    <button onClick={() => handleDownloadEpisode(currentSeasonData.season, ep.episode)} className="download-episode-button">Baixar</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        <div className="modal-actions"><button onClick={onClose}>Fechar</button></div>
      </div>
    </div>
  );
}

function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('movie');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let url = `/api/content?type=${activeTab}`;
    if (debouncedSearchTerm) url += `&query=${encodeURIComponent(debouncedSearchTerm)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao carregar.');
      }
      setContent(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, debouncedSearchTerm]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleDownloadMovie = (item: ContentItem) => {
    window.location.href = `/download/movie/${item.id}?title=${encodeURIComponent(item.title)}`;
  };
  
  const handleViewEpisodes = (item: ContentItem) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };
  
  return (
    <div className="super-container">
      <Suspense fallback={null}><ErrorDisplay /></Suspense>
      {isModalOpen && selectedContent && <SeriesModal content={selectedContent} onClose={() => setIsModalOpen(false)} />}
      <header className="app-header">
        <div className="title-container">
            {/* --- LOGO ADICIONADA AQUI --- */}
            <Image src="https://i.ibb.co/TBJL3XfW/Baixe-Down-Mp4-Ico.png" alt="BaixeDownMp4 Logo" width={50} height={50} />
            <h1>BaixeDownMp4</h1>
        </div>
        <p>Baixar Filmes e Séries Animes e Doramas Online Grátis</p>
        <div className="search-container">
          <input type="text" placeholder="Pesquisar por título..." className="search-bar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <nav className="tabs">
          <button onClick={() => { setSearchTerm(''); setActiveTab('movie'); }} className={activeTab === 'movie' ? 'active' : ''}>Filmes</button>
          <button onClick={() => { setSearchTerm(''); setActiveTab('series'); }} className={activeTab === 'series' ? 'active' : ''}>Séries</button>
          <button onClick={() => { setSearchTerm(''); setActiveTab('anime'); }} className={activeTab === 'anime' ? 'active' : ''}>Animes</button>
          <button onClick={() => { setSearchTerm(''); setActiveTab('dorama'); }} className={activeTab === 'dorama' ? 'active' : ''}>Doramas</button>
        </nav>
      </header>
      <main className="content-grid">
        {isLoading && <p>Carregando conteúdo...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && content.map(item => (
          <div key={`${item.type}-${item.id}`} className="content-card">
            <Image 
                src={item.posterUrl} 
                alt={item.title} 
                width={500} 
                height={750} 
                className="poster" 
                style={{ height: 'auto' }}
            />
            <div className="card-body">
              <h3 className="content-title">{item.title}</h3>
              {item.type === 'movie' ? 
                <button onClick={() => handleDownloadMovie(item)} className="download-button-card">Baixar Filme</button> :
                <button onClick={() => handleViewEpisodes(item)} className="download-button-card">Ver Episódios</button>
              }
            </div>
          </div>
        ))}
        {!isLoading && !error && content.length === 0 && <p>Nenhum conteúdo encontrado.</p>}
      </main>
    </div>
  );
}

export default function Page() {
    return (
      <Suspense fallback={<div>Carregando...</div>}>
        <HomePage />
      </Suspense>
    );
}