import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCanvas } from '../useCanvas'
import type { CanvasRect } from '../../types'

// Mock uni API
const mockUni = {
  createSelectorQuery: vi.fn(),
  createCanvasContext: vi.fn()
}
globalThis.uni = mockUni as any

describe('useCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getCanvasSize 应该返回画布尺寸', async () => {
    const mockRect = { width: 300, height: 150 }
    const mockExec = vi.fn()
    const mockSelect = vi.fn().mockReturnValue({
      boundingClientRect: (callback: (rect: CanvasRect) => void) => {
        callback(mockRect)
        return { exec: mockExec }
      }
    })
    mockUni.createSelectorQuery.mockReturnValue({
      select: mockSelect
    })

    const { getCanvasSize } = useCanvas()
    const result = await getCanvasSize()

    expect(result).toEqual(mockRect)
    expect(mockSelect).toHaveBeenCalledWith('#canvas')
  })

  it('getPainter 应该返回画布上下文', async () => {
    const mockContext = {}
    const mockNode = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(mockContext)
    }
    const mockExec = vi.fn()
    const mockFields = vi.fn().mockImplementation((options, callback) => {
      callback({ node: mockNode, width: 300, height: 150 })
      return { exec: mockExec }
    })
    const mockSelect = vi.fn().mockReturnValue({ fields: mockFields })
    mockUni.createSelectorQuery.mockReturnValue({ select: mockSelect })

    const { getPainter } = useCanvas()
    const result = await getPainter()

    expect(result).toBe(mockContext)
    expect(mockNode.width).toBe(300)
    expect(mockNode.height).toBe(150)
  })
})
