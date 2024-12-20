import { dateOptions } from './config'
import { useAudio, useAnimation } from './hooks'
import { useSystemInfo } from '@/common/hooks'

export function useIndex() {
  const { uniPlatform, top = 0 } = useSystemInfo()
  const audioTop = uniPlatform === 'mp-weixin' ? top : 48

  const { isMuted, toggleMute } = useAudio()
  const { spinWheel, rotation, isSpinning, selectedDate, resultPopup, closeModal, continuousRotation } = useAnimation()

  return {
    // 音频
    isMuted,
    toggleMute,

    // 动画
    dateOptions,
    rotation,
    isSpinning,
    selectedDate,
    resultPopup,
    closeModal,
    spinWheel,

    // 安全区
    audioTop,

    // 平台
    uniPlatform,

    // 持续旋转
    continuousRotation
  }
}
