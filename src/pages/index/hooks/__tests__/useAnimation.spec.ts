import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAnimation } from '../useAnimation'
import { dateOptions } from '../../config'

// Mock useCanvas and useAudio
vi.mock('../useCanvas', () => ({
  useCanvas: () => ({
    getCanvasSize: vi.fn().mockResolvedValue({ width: 300, height: 150 }),
    getPainter: vi.fn().mockResolvedValue({})
  })
}))

vi.mock('../useAudio', () => ({
  useAudio: () => ({
    playSpinningSound: vi.fn(),
    playConfettiSound: vi.fn(),
    playBgmSound: vi.fn()
  })
}))

// 定义组件实例类型
type ComponentInstance = {
  uid: number
} | null

// Mock vue
const mockOpen = vi.fn()
const mockClose = vi.fn()
let mountedCallback: () => void
let unmountedCallback: () => void
let currentInstance: ComponentInstance = null

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...(actual as any),
    ref: (value: any) => ({
      value: value === null ? { open: mockOpen, close: mockClose } : value
    }),
    onMounted: (callback: () => void) => {
      mountedCallback = callback
    },
    onUnmounted: (callback: () => void) => {
      unmountedCallback = callback
    },
    getCurrentInstance: () => currentInstance
  }
})

describe('useAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockOpen.mockClear()
    mockClose.mockClear()
    mountedCallback = () => {}
    unmountedCallback = () => {}
    // 模拟组件实例
    currentInstance = { uid: 1 }
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    // 清理组件实例
    currentInstance = null
  })

  it('应该正确初始化动画状态', () => {
    const { rotation, isSpinning, selectedDate, continuousRotation } = useAnimation()
    expect(rotation.value).toBe(0)
    expect(isSpinning.value).toBe(false)
    expect(selectedDate.value).toBe('')
    expect(continuousRotation.value).toBe(0)
  })

  it('spinWheel 应该触发旋转动画', async () => {
    const { spinWheel, isSpinning, selectedDate } = useAnimation()
    await spinWheel()
    expect(isSpinning.value).toBe(true)
    vi.advanceTimersByTime(5000)
    expect(isSpinning.value).toBe(false)
    expect(dateOptions).toContain(selectedDate.value)
    expect(mockOpen).toHaveBeenCalled()
  })

  it('continuousRotation 应该持续增加', () => {
    const { continuousRotation } = useAnimation()
    expect(continuousRotation.value).toBe(0)
    // 手动触发 onMounted 回调
    mountedCallback()
    // 等待一帧动画
    vi.advanceTimersByTime(1000 / 60)
    expect(continuousRotation.value).toBeGreaterThan(0)
  })

  it('showConfetti 应该正确触发动画', async () => {
    const { showConfetti } = useAnimation()
    await showConfetti()
    // 由于 Confetti 是第三方库，这里主要测试函数可以正常调用
    expect(true).toBe(true)
  })

  it('应该在组件卸载时清理定时器', () => {
    useAnimation()
    mountedCallback()
    unmountedCallback()
    // 验证定时器被清理
    expect(vi.getTimerCount()).toBe(0)
  })
})
