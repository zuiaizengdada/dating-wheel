export function useAudio() {
  const isMuted = ref<boolean>(true)
  const isPlaying = ref<boolean>(false)
  const bgmAudio = ref<UniApp.InnerAudioContext | null>(null)
  const spinningAudio = ref<UniApp.InnerAudioContext | null>(null)
  const confettiAudio = ref<UniApp.InnerAudioContext | null>(null)

  onMounted(() => {
    bgmAudio.value = uni.createInnerAudioContext()
    spinningAudio.value = uni.createInnerAudioContext()
    confettiAudio.value = uni.createInnerAudioContext()

    if (bgmAudio.value) {
      bgmAudio.value.src = '/static/audio/bgm.mp3'
      bgmAudio.value.loop = true
      bgmAudio.value.volume = 0
      bgmAudio.value.autoplay = true

      bgmAudio.value.onPlay(() => {
        isPlaying.value = true
        console.log('Audio started playing')
      })

      bgmAudio.value.onPause(() => {
        isPlaying.value = false
        console.log('Audio paused')
      })

      bgmAudio.value.onStop(() => {
        isPlaying.value = false
        console.log('Audio stopped')
      })

      bgmAudio.value.onError((res) => {
        console.error('Audio error:', res)
        isPlaying.value = false
      })
    }

    if (spinningAudio.value) {
      spinningAudio.value.src = '/static/audio/spinning.mp3'
      spinningAudio.value.volume = 0
    }

    if (confettiAudio.value) {
      confettiAudio.value.src = '/static/audio/confetti.mp3'
      confettiAudio.value.volume = 0
    }
  })

  onUnmounted(() => {
    if (bgmAudio.value) {
      bgmAudio.value.destroy()
    }
    if (spinningAudio.value) {
      spinningAudio.value.destroy()
    }
    if (confettiAudio.value) {
      confettiAudio.value.destroy()
    }
  })

  const toggleMute = () => {
    if (!bgmAudio.value) return
    isMuted.value = !isMuted.value
    const volume = isMuted.value ? 0 : 1

    if (bgmAudio.value) {
      bgmAudio.value.volume = volume
      if (!isMuted.value && !isPlaying.value) {
        bgmAudio.value.play()
      }
    }
    if (spinningAudio.value) spinningAudio.value.volume = volume
    if (confettiAudio.value) confettiAudio.value.volume = volume
  }

  const playSpinningSound = () => {
    const volume = isMuted.value ? 0 : 1
    if (bgmAudio.value) {
      bgmAudio.value.pause()
    }
    if (spinningAudio.value) {
      spinningAudio.value.volume = volume
      spinningAudio.value.seek(0)
      spinningAudio.value.play()
    }
  }

  const playConfettiSound = () => {
    const volume = isMuted.value ? 0 : 1
    if (spinningAudio.value) {
      spinningAudio.value.pause()
    }
    if (confettiAudio.value) {
      confettiAudio.value.volume = volume
      confettiAudio.value.seek(0)
      confettiAudio.value.play()
    }
    if (bgmAudio.value) {
      bgmAudio.value.volume = volume
      bgmAudio.value.play()
    }
  }

  return {
    isMuted,
    toggleMute,
    playSpinningSound,
    playConfettiSound
  }
}
