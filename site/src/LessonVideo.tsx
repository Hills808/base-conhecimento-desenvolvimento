import { useId, useState } from 'react';
import { guidedVideos } from './data/guidedVideos';

function clock(seconds: number) {
  return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}

export default function LessonVideo({ lessonId }: { lessonId: string }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const playerId = useId();
  const video = guidedVideos[lessonId];
  if (!video) return null;

  const watch = new URLSearchParams({ v: video.id });
  const player = new URLSearchParams({ hl: 'pt-BR' });
  if (video.start !== undefined) {
    watch.set('t', String(video.start) + 's');
    player.set('start', String(video.start));
  }
  if (video.end !== undefined) player.set('end', String(video.end));

  return (
    <details className="course-disclosure course-video" onToggle={event => {
      if (!event.currentTarget.open) setShowPlayer(false);
    }}>
      <summary>Vídeo de apoio em português</summary>
      <div className="course-video-body">
        <h2>{video.title}</h2>
        <p className="course-meta">
          {video.channel}{video.start !== undefined && video.end !== undefined && ' · Trecho de ' + clock(video.start) + ' a ' + clock(video.end)}
        </p>
        <p><strong>Depois de assistir:</strong> {video.practice}</p>
        {video.note && <p className="course-meta">{video.note}</p>}
        <div className="course-video-actions">
          <button type="button" aria-expanded={showPlayer} aria-controls={playerId} onClick={() => setShowPlayer(value => !value)}>
            {showPlayer ? 'Fechar player' : 'Abrir player do YouTube'}
          </button>
          <a href={'https://www.youtube.com/watch?' + watch.toString()} target="_blank" rel="noopener noreferrer">
            Abrir no YouTube (nova aba)
          </a>
        </div>
        <div id={playerId}>
          {showPlayer && <iframe
            className="course-video-player"
            title={'Vídeo de apoio: ' + video.title}
            src={'https://www.youtube-nocookie.com/embed/' + video.id + '?' + player.toString()}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />}
        </div>
      </div>
    </details>
  );
}
