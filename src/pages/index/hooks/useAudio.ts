type AudioType = 'bgm' | 'spinning' | 'confetti'
type AudioStates = Record<AudioType, Ref<boolean>>

const createAudioManager = (() => {
  let instance: ReturnType<typeof initAudioManager> | null = null

  // 创建音频实例的工厂函数
  const createAudio = (type: AudioType): UniApp.InnerAudioContext => {
    const audio = uni.createInnerAudioContext()
    const config = {
      bgm: {
        src: '/static/audio/bgm.mp3',
        loop: true,
        autoplay: true
      },
      spinning: {
        src: '/static/audio/spinning.mp3',
        loop: false,
        autoplay: false
      },
      confetti: {
        src: '/static/audio/confetti.mp3',
        loop: false,
        autoplay: false
      }
    }

    audio.src = config[type].src
    audio.loop = config[type].loop
    audio.volume = 0
    audio.autoplay = config[type].autoplay

    return audio
  }

  // 设置音频事件监听
  const setupAudioListeners = (audio: UniApp.InnerAudioContext, type: AudioType, audioStates: AudioStates) => {
    const handlers = {
      onPlay: () => {
        audioStates[type].value = true
        console.log(`${type} audio started playing`)
      },
      onPause: () => {
        audioStates[type].value = false
        console.log(`${type} audio paused`)
      },
      onStop: () => {
        audioStates[type].value = false
        console.log(`${type} audio stopped`)
      },
      onError: (res: any) => {
        console.error(`${type} audio error:`, res)
        audioStates[type].value = false
      }
    }

    audio.onPlay(handlers.onPlay)
    audio.onPause(handlers.onPause)
    audio.onStop(handlers.onStop)
    audio.onError(handlers.onError)
  }

  function initAudioManager() {
    const isMuted = ref<boolean>(true)
    const isSpinning = ref<boolean>(false)

    // 初始化所有音频的播放状态
    const audioStates: AudioStates = {
      bgm: ref(false),
      spinning: ref(false),
      confetti: ref(false)
    }

    // 初始化音频实例
    const bgmAudio = createAudio('bgm')
    const spinningAudio = createAudio('spinning')
    const confettiAudio = createAudio('confetti')

    // 设置所有音频的监听器
    setupAudioListeners(bgmAudio, 'bgm', audioStates)
    setupAudioListeners(spinningAudio, 'spinning', audioStates)
    setupAudioListeners(confettiAudio, 'confetti', audioStates)

    const toggleMute = () => {
      isMuted.value = !isMuted.value
      const volume = isMuted.value ? 0 : 1

      if (isMuted.value) {
        // 静音时暂停所有音频
        bgmAudio.pause()
        spinningAudio.pause()
        confettiAudio.pause()
      } else {
        // 取消静音时，优先考虑正在进行的动作音效
        if (isSpinning.value) {
          // 如果转盘正在转，只播放转盘音效
          spinningAudio.volume = volume
          spinningAudio.seek(0)
          spinningAudio.play()
        } else if (audioStates.confetti.value) {
          confettiAudio.volume = volume
          confettiAudio.play()
          if (!isSpinning.value) {
            bgmAudio.volume = volume
            bgmAudio.play()
          }
        } else {
          if (!isSpinning.value) {
            bgmAudio.volume = volume
            bgmAudio.play()
          }
        }
      }
    }

    // BGM控制
    const playBgmSound = () => {
      const volume = isMuted.value ? 0 : 1
      bgmAudio.volume = volume
      bgmAudio.play()
    }

    const pauseBgmSound = () => {
      bgmAudio.pause()
    }

    // 音效控制
    const playSpinningSound = () => {
      isSpinning.value = true
      const volume = isMuted.value ? 0 : 1
      bgmAudio.pause()
      confettiAudio.pause()
      spinningAudio.volume = volume
      spinningAudio.seek(0)
      spinningAudio.play()
    }

    const playConfettiSound = () => {
      isSpinning.value = false
      const volume = isMuted.value ? 0 : 1
      spinningAudio.pause()
      confettiAudio.volume = volume
      confettiAudio.seek(0)
      confettiAudio.play()
    }

    // 资源清理
    const destroy = () => {
      ;[bgmAudio, spinningAudio, confettiAudio].forEach((audio) => audio.destroy())
      instance = null
    }

    return {
      isMuted,
      audioStates,
      isSpinning,
      toggleMute,
      playSpinningSound,
      playConfettiSound,
      playBgmSound,
      pauseBgmSound,
      destroy
    }
  }

  return () => {
    if (!instance) {
      instance = initAudioManager()
    }
    return instance
  }
})()

export function useAudio() {
  const audioManager = createAudioManager()

  onUnmounted(() => {
    audioManager.destroy()
  })

  return {
    isMuted: audioManager.isMuted,
    audioStates: audioManager.audioStates,
    isSpinning: audioManager.isSpinning,
    toggleMute: audioManager.toggleMute,
    playSpinningSound: audioManager.playSpinningSound,
    playConfettiSound: audioManager.playConfettiSound,
    playBgmSound: audioManager.playBgmSound,
    pauseBgmSound: audioManager.pauseBgmSound
  }
}
