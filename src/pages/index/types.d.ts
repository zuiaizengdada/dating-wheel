export interface CanvasRect {
  width: number
  height: number
}

export interface NodeInfo {
  node?: {
    width: number
    height: number
    getContext: (type: string) => CanvasRenderingContext2D
  }
  width?: number
  height?: number
}
