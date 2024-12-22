import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAudio } from '../useAudio'

const mockAudio = {
  src: '',
  loop: false,
  volume: 1,
  autoplay: false,
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  destroy: vi.fn(),
  seek: vi.fn(),
  onPlay: vi.fn(),
  onPause: vi.fn(),
  onStop: vi.fn(),
  onEnded: vi.fn(),
  onError: vi.fn()
}

// Mock uni API
const mockUni = {
  createInnerAudioContext: vi.fn()
}
globalThis.uni = mockUni as any

describe('useAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mockUni.createInnerAudioContext.mockReturnValue(mockAudio)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('应该正确初始化音频状态', () => {
    const { isMuted, audioStates } = useAudio()
    expect(isMuted.value).toBe(true)
    expect(audioStates.bgm.value).toBe(false)
    expect(audioStates.spinning.value).toBe(false)
    expect(audioStates.confetti.value).toBe(false)
  })

  it('toggleMute 应该切换静音状态', () => {
    const { isMuted, toggleMute } = useAudio()
    expect(isMuted.value).toBe(true)
    toggleMute()
    expect(isMuted.value).toBe(false)
    toggleMute()
    expect(isMuted.value).toBe(true)
  })

  it('playBgmSound 应该正确播放背景音乐', () => {
    const { playBgmSound } = useAudio()
    playBgmSound()
    expect(mockAudio.play).toHaveBeenCalled()
    expect(mockAudio.volume).toBe(0) // 因为默认是静音状态
  })

  it('playSpinningSound 应该暂停其他音频并播放旋转音效', () => {
    const { playSpinningSound } = useAudio()
    playSpinningSound()
    expect(mockAudio.pause).toHaveBeenCalled()
    expect(mockAudio.stop).toHaveBeenCalled()
    // 等待 setTimeout 执行完成
    vi.advanceTimersByTime(100)
    expect(mockAudio.seek).toHaveBeenCalledWith(0)
    expect(mockAudio.play).toHaveBeenCalled()
  })
})
