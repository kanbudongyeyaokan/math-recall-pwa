import { AudioLines, Minus, Plus, Volume2 } from 'lucide-react'
import type { AudioPreferences } from '../utils/sound'

interface AudioSettingsControlsProps {
  preferences: AudioPreferences
  voiceSupported: boolean
  onChange: (patch: Partial<AudioPreferences>) => void
  onPreviewSound: () => void
  onPreviewVoice: () => void
  idPrefix: string
  compact?: boolean
}

const AUDIO_PRESETS = [
  { id: 'quiet', label: '静音', soundVolume: 0, voiceVolume: 0 },
  { id: 'comfortable', label: '舒适', soundVolume: 0.55, voiceVolume: 0.65 },
  { id: 'strong', label: '强劲', soundVolume: 0.9, voiceVolume: 0.95 }
] as const

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function AudioSettingsControls({ preferences, voiceSupported, onChange, onPreviewSound, onPreviewVoice, idPrefix, compact = false }: AudioSettingsControlsProps) {
  const selectedPreset = AUDIO_PRESETS.find((preset) => preset.soundVolume === preferences.soundVolume && preset.voiceVolume === preferences.voiceVolume)?.id

  function updateVolume(key: 'soundVolume' | 'voiceVolume', value: number) {
    onChange({ [key]: clamp(Math.round(value), 0, 100) / 100 })
  }

  function choosePreset(preset: (typeof AUDIO_PRESETS)[number]) {
    onChange({ soundVolume: preset.soundVolume, voiceVolume: preset.voiceVolume })
    if (preset.soundVolume > 0 && preferences.soundEnabled) window.setTimeout(onPreviewSound, 30)
  }

  return (
    <div className={`audio-controls ${compact ? 'compact' : ''}`}>
      <div className="audio-preset-row" aria-label="音量预设">
        {AUDIO_PRESETS.map((preset) => (
          <button type="button" className={selectedPreset === preset.id ? 'active' : ''} aria-pressed={selectedPreset === preset.id} onClick={() => choosePreset(preset)} key={preset.id}>{preset.label}</button>
        ))}
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
        <button type="button" onClick={onPreviewSound} disabled={!preferences.soundEnabled || preferences.soundVolume <= 0}><Volume2 size={16} />试听音效</button>
        <button type="button" onClick={onPreviewVoice} disabled={!preferences.voiceEnabled || !voiceSupported || preferences.voiceVolume <= 0}><AudioLines size={16} />试听语音</button>
      </div>
    </div>
  )
}
