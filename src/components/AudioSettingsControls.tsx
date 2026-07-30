import { AudioLines, Disc3, Minus, Music2, Plus, Volume2 } from 'lucide-react'
import { MUSIC_TRACK_OPTIONS, type AudioPreferences, type MusicSelection } from '../utils/sound'

interface AudioSettingsControlsProps {
  preferences: AudioPreferences
  voiceSupported: boolean
  onChange: (patch: Partial<AudioPreferences>) => void
  onPreviewSound: () => void
  onPreviewMusic: () => void
  onPreviewVoice: () => void
  idPrefix: string
  compact?: boolean
}

const AUDIO_PRESETS = [
  { id: 'quiet', label: '安静', soundVolume: 0, musicVolume: 0, voiceVolume: 0 },
  { id: 'comfortable', label: '舒适', soundVolume: 0.62, musicVolume: 0.42, voiceVolume: 0.7 },
  { id: 'strong', label: '沉浸', soundVolume: 0.86, musicVolume: 0.68, voiceVolume: 0.92 },
  { id: 'maximum', label: '全开', soundVolume: 1, musicVolume: 1, voiceVolume: 1 }
] as const

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function AudioSettingsControls({ preferences, voiceSupported, onChange, onPreviewSound, onPreviewMusic, onPreviewVoice, idPrefix, compact = false }: AudioSettingsControlsProps) {
  const selectedPreset = AUDIO_PRESETS.find((preset) => preset.soundVolume === preferences.soundVolume && preset.musicVolume === preferences.musicVolume && preset.voiceVolume === preferences.voiceVolume)?.id
  const selectedTrack = MUSIC_TRACK_OPTIONS.find((track) => track.id === preferences.musicTrackId)

  function updateVolume(key: 'soundVolume' | 'musicVolume' | 'voiceVolume', value: number, max = 100) {
    onChange({ [key]: clamp(Math.round(value), 0, max) / 100 })
  }

  function choosePreset(preset: (typeof AUDIO_PRESETS)[number]) {
    onChange({ soundVolume: preset.soundVolume, musicVolume: preset.musicVolume, voiceVolume: preset.voiceVolume })
    if (preset.soundVolume > 0 && preferences.soundEnabled) window.setTimeout(onPreviewSound, 30)
  }

  function chooseMusicTrack(value: MusicSelection) {
    onChange({ musicTrackId: value })
    if (preferences.musicEnabled && preferences.musicVolume > 0) window.setTimeout(onPreviewMusic, 220)
  }

  return (
    <div className={`audio-controls ${compact ? 'compact' : ''}`}>
      <div className="audio-preset-row" aria-label="音量预设">
        {AUDIO_PRESETS.map((preset) => (
          <button type="button" className={selectedPreset === preset.id ? 'active' : ''} aria-pressed={selectedPreset === preset.id} onClick={() => choosePreset(preset)} key={preset.id}>{preset.label}</button>
        ))}
      </div>

      <label className="audio-music-toggle">
        <span><Music2 size={17} /><span><strong>场景背景音乐</strong><small>两首原创纯音乐，挑战时自动切换紧张曲目</small></span></span>
        <input type="checkbox" role="switch" checked={preferences.musicEnabled} onChange={(event) => onChange({ musicEnabled: event.target.checked })} />
      </label>

      <div className="music-track-selector">
        <div className="audio-control-label"><Disc3 size={17} /><label htmlFor={`${idPrefix}-music-track`}>背景音乐曲目</label><output>{preferences.musicTrackId === 'auto' ? '自动' : '固定'}</output></div>
        <select id={`${idPrefix}-music-track`} value={preferences.musicTrackId} onChange={(event) => chooseMusicTrack(event.target.value as MusicSelection)} disabled={!preferences.musicEnabled} aria-describedby={`${idPrefix}-music-track-description`}>
          <option value="auto">自动随当前场景切换</option>
          {MUSIC_TRACK_OPTIONS.map((track) => <option value={track.id} key={track.id}>{track.title}</option>)}
        </select>
        <small id={`${idPrefix}-music-track-description`}>{selectedTrack?.description || '普通场景播放 Quietly Hopeful，挑战时自动切换 The Silent Watch。'}</small>
      </div>

      <div className="audio-control-row">
        <div className="audio-control-label"><Music2 size={17} /><label htmlFor={`${idPrefix}-music-volume`}>音乐音量</label><output>{Math.round(preferences.musicVolume * 100)}%</output></div>
        <div className="audio-stepper">
          <button type="button" onClick={() => updateVolume('musicVolume', preferences.musicVolume * 100 - 5)} disabled={!preferences.musicEnabled || preferences.musicVolume <= 0} aria-label="降低背景音乐音量"><Minus size={17} /></button>
          <input id={`${idPrefix}-music-volume`} type="range" min="0" max="100" step="1" value={Math.round(preferences.musicVolume * 100)} onChange={(event) => updateVolume('musicVolume', Number(event.target.value))} onPointerUp={onPreviewMusic} onKeyUp={onPreviewMusic} disabled={!preferences.musicEnabled} aria-label="背景音乐音量" />
          <button type="button" onClick={() => { updateVolume('musicVolume', preferences.musicVolume * 100 + 5); window.setTimeout(onPreviewMusic, 30) }} disabled={!preferences.musicEnabled || preferences.musicVolume >= 1} aria-label="提高背景音乐音量"><Plus size={17} /></button>
        </div>
      </div>

      <div className="audio-control-row">
        <div className="audio-control-label"><Volume2 size={17} /><label htmlFor={`${idPrefix}-sound-volume`}>音效音量</label><output>{Math.round(preferences.soundVolume * 100)}%</output></div>
        <div className="audio-stepper">
          <button type="button" onClick={() => updateVolume('soundVolume', preferences.soundVolume * 100 - 5)} disabled={!preferences.soundEnabled || preferences.soundVolume <= 0} aria-label="降低音效音量"><Minus size={17} /></button>
          <input id={`${idPrefix}-sound-volume`} type="range" min="0" max="100" step="1" value={Math.round(preferences.soundVolume * 100)} onChange={(event) => updateVolume('soundVolume', Number(event.target.value))} onPointerUp={onPreviewSound} onKeyUp={onPreviewSound} disabled={!preferences.soundEnabled} aria-label="音效音量" />
          <button type="button" onClick={() => { updateVolume('soundVolume', preferences.soundVolume * 100 + 5); window.setTimeout(onPreviewSound, 30) }} disabled={!preferences.soundEnabled || preferences.soundVolume >= 1} aria-label="提高音效音量"><Plus size={17} /></button>
        </div>
      </div>

      <div className="audio-control-row">
        <div className="audio-control-label"><AudioLines size={17} /><label htmlFor={`${idPrefix}-voice-volume`}>语音音量</label><output>{Math.round(preferences.voiceVolume * 100)}%</output></div>
        <div className="audio-stepper">
          <button type="button" onClick={() => updateVolume('voiceVolume', preferences.voiceVolume * 100 - 5)} disabled={!preferences.voiceEnabled || !voiceSupported || preferences.voiceVolume <= 0} aria-label="降低语音音量"><Minus size={17} /></button>
          <input id={`${idPrefix}-voice-volume`} type="range" min="0" max="100" step="1" value={Math.round(preferences.voiceVolume * 100)} onChange={(event) => updateVolume('voiceVolume', Number(event.target.value))} disabled={!preferences.voiceEnabled || !voiceSupported} aria-label="角色语音音量" />
          <button type="button" onClick={() => updateVolume('voiceVolume', preferences.voiceVolume * 100 + 5)} disabled={!preferences.voiceEnabled || !voiceSupported || preferences.voiceVolume >= 1} aria-label="提高语音音量"><Plus size={17} /></button>
        </div>
      </div>

      {!compact && (
        <div className="audio-control-row">
          <div className="audio-control-label"><AudioLines size={17} /><label htmlFor={`${idPrefix}-voice-rate`}>角色语速</label><output>{preferences.voiceRate.toFixed(2)}x</output></div>
          <div className="audio-stepper">
            <button type="button" onClick={() => onChange({ voiceRate: clamp(Number((preferences.voiceRate - 0.05).toFixed(2)), 0.8, 1.2) })} disabled={!preferences.voiceEnabled || !voiceSupported || preferences.voiceRate <= 0.8} aria-label="降低角色语速"><Minus size={17} /></button>
            <input id={`${idPrefix}-voice-rate`} type="range" min="80" max="120" step="5" value={Math.round(preferences.voiceRate * 100)} onChange={(event) => onChange({ voiceRate: Number(event.target.value) / 100 })} disabled={!preferences.voiceEnabled || !voiceSupported} aria-label="角色语速" />
            <button type="button" onClick={() => onChange({ voiceRate: clamp(Number((preferences.voiceRate + 0.05).toFixed(2)), 0.8, 1.2) })} disabled={!preferences.voiceEnabled || !voiceSupported || preferences.voiceRate >= 1.2} aria-label="提高角色语速"><Plus size={17} /></button>
          </div>
        </div>
      )}

      <div className="audio-preview-row">
        <button type="button" onClick={onPreviewMusic} disabled={!preferences.musicEnabled || preferences.musicVolume <= 0}><Music2 size={16} />试听当前</button>
        <button type="button" onClick={onPreviewSound} disabled={!preferences.soundEnabled || preferences.soundVolume <= 0}><Volume2 size={16} />试听音效</button>
        <button type="button" onClick={onPreviewVoice} disabled={!preferences.voiceEnabled || !voiceSupported || preferences.voiceVolume <= 0}><AudioLines size={16} />试听语音</button>
      </div>
    </div>
  )
}
