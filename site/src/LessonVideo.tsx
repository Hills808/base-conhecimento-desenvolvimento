import { useState } from 'react';
import { guidedVideos } from './data/guidedVideos';

function clock(seconds: number) {
  return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}

export default function LessonVideo({ lessonId }: { lessonId: string }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const video = guidedVideos[lessonId];
  if (!video) return null;

  const watch = new URLSearchParams({ v: video.id });
  const player = new URLSearchParams({ hl: 'pt-BR' });
  if (video.start !== undefined) {
    watch.set('t', String(video.start) + 's');
    player.set('start', String(video.start));
  }
  if (video.end !== undefined) player.set('end', String(video.end));

  const length = video.end !== undefined && video.start !== undefined ? video.end - video.start : video.duration;
  return (
    <details className="course-disclosure course-video" onToggle={event => setShowPlayer(event.currentTarget.open)}>
      <summary>Videoaula · {video.title} <span className="course-meta">({clock(length)})</span></summary>
      <div className="course-video-body">
        <p className="course-meta">
          {video.channel} · Áudio em português{video.start !== undefined && video.end !== undefined && ' · Trecho de ' + clock(video.start) + ' a ' + clock(video.end)}
        </p>
        <p><strong>Enquanto assiste</strong><br />{video.observe}</p>
        {video.note && <p className="course-meta">{video.note}</p>}
        {showPlayer && <iframe
            className="course-video-player"
            title={'Videoaula em português · ' + video.title}
            src={'https://www.youtube-nocookie.com/embed/' + video.id + '?' + player.toString()}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
        />}
        <div className="course-video-actions">
          <a href={'https://www.youtube.com/watch?' + watch.toString()} target="_blank" rel="noopener noreferrer">
            Assistir no YouTube (nova aba)
          </a>
        </div>
        <p><strong>Depois do vídeo</strong><br />{video.practice}</p>
      </div>
    </details>
  );
}
