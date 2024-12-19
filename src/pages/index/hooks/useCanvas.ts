import type { CanvasRect, NodeInfo } from '../types'

export function useCanvas() {
  async function getCanvasSize(): Promise<CanvasRect> {
    return new Promise((resolve) => {
      uni
        .createSelectorQuery()
        .select('#canvas')
        .boundingClientRect((rect) => {
          resolve(rect as CanvasRect)
        })
        .exec()
    })
  }

  async function getPainter(): Promise<CanvasRenderingContext2D> {
    return new Promise((resolve) => {
      const query = uni.createSelectorQuery()
      query
        .select('#canvas')
        .fields(
          {
            node: true,
            size: true
          },
          (result: NodeInfo | NodeInfo[]) => {
            const res = Array.isArray(result) ? result : [result]
            if (!res?.[0]) {
              // 降级方案
              resolve(uni.createCanvasContext('canvas') as unknown as CanvasRenderingContext2D)
              return
            }

            const { node, width, height } = res[0]
            if (!node) {
              // 降级方案
              resolve(uni.createCanvasContext('canvas') as unknown as CanvasRenderingContext2D)
              return
            }

            // 设置 canvas 尺寸
            node.width = width || 300
            node.height = height || 150

            const ctx = node.getContext('2d')
            if (!ctx) {
              resolve(uni.createCanvasContext('canvas') as unknown as CanvasRenderingContext2D)
              return
            }

            resolve(ctx)
          }
        )
        .exec()
    })
  }

  return {
    getCanvasSize,
    getPainter
  }
}
