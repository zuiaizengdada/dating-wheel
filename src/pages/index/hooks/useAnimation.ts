import { Confetti } from 'confetti-ts-canvas'
import { useCanvas } from './useCanvas'
import { useAudio } from './useAudio'
import { dateOptions } from '../config'

export function useAnimation() {
  const { getCanvasSize, getPainter } = useCanvas()
  const { playSpinningSound, playConfettiSound } = useAudio()

  const rotation = ref<number>(0)
  const isSpinning = ref<boolean>(false)
  const selectedDate = ref<string>('')
  const resultPopup = ref<any>(null)

  async function showConfetti() {
    const painter = await getPainter()
    const rect = await getCanvasSize()

    new Confetti({
      paint: painter,
      canvasWidth: rect.width,
      canvasHeight: rect.height,
      displayFps: true
    }).run({})
  }

  async function spinWheel(): Promise<void> {
    if (isSpinning.value) return
    isSpinning.value = true
    const newRotation = rotation.value + 1440 + Math.random() * 360
    rotation.value = newRotation

    playSpinningSound()

    setTimeout(() => {
      isSpinning.value = false
      const selectedIndex = Math.floor(((newRotation % 360) / 360) * dateOptions.length)
      selectedDate.value = dateOptions[selectedIndex]
      resultPopup.value.open()
      playConfettiSound()
      showConfetti()
    }, 5000)
  }

  function closeModal(): void {
    resultPopup.value.close()
  }

  return {
    showConfetti,
    spinWheel,
    rotation,
    isSpinning,
    selectedDate,
    resultPopup,
    closeModal
  }
}
