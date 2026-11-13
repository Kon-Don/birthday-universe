import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3, Music } from 'lucide-react';
import config from '../../data/config';
import './MusicPlayer.css';

export default function MusicPlayer() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const tracks = config.musicTracks;
  const currentTrack = tracks[currentTrackIdx] || {
    title: 'Birthday Melody',
    artist: 'Birthday Universe',
    src: '/music/track1.mp3',
  };

  // Setup audio element handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => handleNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrackIdx, isMuted, volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay restrictions or file loading error
        setIsPlaying(false);
      });
    }
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIdx + 1) % tracks.length;
    setCurrentTrackIdx(nextIdx);
    setCurrentTime(0);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current.play().catch(() => {});
      }, 100);
    }
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
    setCurrentTrackIdx(prevIdx);
    setCurrentTime(0);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current.play().catch(() => {});
      }, 100);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player-card glass-card">
      <audio ref={audioRef} src={currentTrack.src} preload="metadata" />

      <div className="player-top-header">
        <Music size={18} className="player-icon" />
        <span className="player-section-title">RETRO VINYL PLAYER</span>
      </div>

      <div className="player-body">
        {/* Animated Spinning Vinyl */}
        <div className="vinyl-assembly">
          <div className="turntable-base" />
          <motion.div
            className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={isPlaying ? { duration: 3.5, repeat: Infinity, ease: 'linear' } : {}}
          >
            {/* Grooves */}
            <div className="vinyl-groove groove-1" />
            <div className="vinyl-groove groove-2" />
            {/* Center Label */}
            <div className="vinyl-center-label">
              <span className="vinyl-label-text">B-DAY</span>
              <div className="vinyl-hole" />
            </div>
          </motion.div>
        </div>

        {/* Track Details */}
        <div className="track-info-group">
          <h4 className="track-title">{currentTrack.title}</h4>
          <p className="track-artist">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="playback-scrubber-group">
          <div className="time-indicators">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || 12)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 12}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="player-slider seek-slider"
          />
        </div>

        {/* Controls: Prev / Play-Pause / Next */}
        <div className="playback-controls">
          <button className="control-btn" onClick={handlePrev} title="Previous Track">
            <SkipBack size={20} />
          </button>

          <button
            className={`play-pause-btn ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: 3 }} />}
          </button>

          <button className="control-btn" onClick={handleNext} title="Next Track">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Volume & Mute */}
        <div className="volume-control-group">
          <button className="mute-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="player-slider volume-slider"
          />
        </div>
      </div>
    </div>
  );
}

