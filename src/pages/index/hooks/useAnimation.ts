import { Confetti } from 'confetti-ts-canvas'
import { useCanvas } from './useCanvas'
import { useAudio } from './useAudio'
import { dateOptions } from '../config'

export function useAnimation() {
  const { getCanvasSize, getPainter } = useCanvas()
  const { playSpinningSound, playConfettiSound, playBgmSound } = useAudio()

  const rotation = ref<number>(0)
  const isSpinning = ref<boolean>(false)
  const selectedDate = ref<string>('')
  const resultPopup = ref<any>(null)
  const continuousRotation = ref<number>(0)
  let animationFrameId: number

  function animate() {
    continuousRotation.value += 0.2
    animationFrameId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    animate()
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
  })

  async function showConfetti() {
    const painter = await getPainter()
    const rect = await getCanvasSize()

    new Confetti({
      paint: painter,
      canvasWidth: rect.width,
      canvasHeight: rect.height
    }).run({})
  }

  async function spinWheel(): Promise<void> {
    if (isSpinning.value) return
    isSpinning.value = true
    const startRotation = continuousRotation.value
    const extraRotation = 1440 + Math.random() * 360
    const newRotation = startRotation + extraRotation
    rotation.value = newRotation

    playSpinningSound()

    setTimeout(() => {
      isSpinning.value = false
      const selectedIndex = Math.floor(((newRotation % 360) / 360) * dateOptions.length)
      selectedDate.value = dateOptions[selectedIndex]
      resultPopup.value.open()
      playConfettiSound()
      showConfetti()
      continuousRotation.value = newRotation
    }, 5000)
  }

  function closeModal(): void {
    resultPopup.value.close()
    playBgmSound()
  }

  return {
    showConfetti,
    spinWheel,
    rotation,
    isSpinning,
    selectedDate,
    resultPopup,
    closeModal,
    continuousRotation
  }
}
