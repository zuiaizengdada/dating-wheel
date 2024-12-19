import { dateOptions } from './config'
import { useAudio, useAnimation } from './hooks'

export function useIndex() {
  const type = uni.getSystemInfoSync().uniPlatform
  const audioTop = ref<number>(0)

  if (type === 'mp-weixin') {
    const { top } = uni.getMenuButtonBoundingClientRect()
    audioTop.value = top
  } else {
    audioTop.value = 48
  }

  const { isMuted, toggleMute } = useAudio()
  const { spinWheel, rotation, isSpinning, selectedDate, resultPopup, closeModal } = useAnimation()

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
    type
  }
}
