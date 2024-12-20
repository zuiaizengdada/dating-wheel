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
        autoplay: false
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
      onEnded: () => {
        // 添加音频播放结束事件处理
        audioStates[type].value = false
        console.log(`${type} audio ended`)
        if (type === 'spinning') {
          audio.seek(0) // 重置到开始位置
        }
      },
      onError: (res: any) => {
        console.error(`${type} audio error:`, res)
        audioStates[type].value = false
      }
    }

    audio.onPlay(handlers.onPlay)
    audio.onPause(handlers.onPause)
    audio.onStop(handlers.onStop)
    audio.onEnded(handlers.onEnded) // 添加结束事件监听
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
        // 静音时不仅要设置音量为0，还要暂停所有音频
        bgmAudio.volume = 0
        spinningAudio.volume = 0
        confettiAudio.volume = 0

        bgmAudio.pause()
        spinningAudio.pause()
        confettiAudio.pause()
      } else {
        // 取消静音时，根据当前状态播放对应的音频
        if (isSpinning.value) {
          spinningAudio.volume = volume
          spinningAudio.play()
        } else if (audioStates.confetti.value) {
          confettiAudio.volume = volume
          confettiAudio.play()
          if (!isSpinning.value) {
            bgmAudio.volume = volume
            bgmAudio.play()
          }
        } else {
          // 没有其他音效时播放背景音乐
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

      // 确保完全停止并重置
      spinningAudio.stop()
      setTimeout(() => {
        spinningAudio.seek(0)
        spinningAudio.volume = volume
        spinningAudio.play()
      }, 100) // 添加小延迟确保重置完成
    }

    const playConfettiSound = () => {
      isSpinning.value = false
      const volume = isMuted.value ? 0 : 1
      spinningAudio.pause()
      confettiAudio.volume = volume
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
