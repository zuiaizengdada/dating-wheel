<script lang="ts" setup>
const dots = ref<
  Array<{
    id: number
    top: string
    left: string
    size: string
    color: string
    delay: string
  }>
>([])

let timer: number | null = null
const colors = [
  'from-pink-300 to-purple-300',
  'from-purple-300 to-blue-300',
  'from-blue-300 to-teal-300',
  'from-teal-300 to-green-300',
  'from-indigo-300 to-purple-400',
  'from-pink-300 to-orange-300',
  'from-blue-300 to-indigo-400',
  'from-green-300 to-teal-400',
  'from-purple-300 to-pink-400',
  'from-yellow-300 to-orange-300'
]

// 更新单个点
const updateSingleDot = (index: number) => {
  if (!dots.value[index]) return

  const newDot = {
    id: Date.now() + index, // 改变 id 触发重新渲染
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${30 + Math.random() * 20}px`,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: '0s'
  }

  dots.value[index] = newDot
}

// 初始化点
const initDots = () => {
  const newDots = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${30 + Math.random() * 20}px`,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: `${i * 0.5}s`
  }))
  dots.value = newDots
}

onMounted(() => {
  initDots()
  // 每500ms更新一个点
  let currentIndex = 0
  timer = setInterval(() => {
    updateSingleDot(currentIndex)
    currentIndex = (currentIndex + 1) % 8
  }, 500)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <view class="absolute inset-0 opacity-50 pointer-events-none">
    <view
      v-for="dot in dots"
      :key="dot.id"
      class="absolute bg-gradient-to-r rounded-full"
      :class="[dot.color, 'animate-ripple']"
      :style="{
        top: dot.top,
        left: dot.left,
        width: dot.size,
        height: dot.size,
        animationDelay: dot.delay
      }"
    ></view>
  </view>
</template>

<style scoped>
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0;
    filter: brightness(1.2);
  }
  20% {
    transform: scale(1);
    opacity: 0.8;
    filter: brightness(1);
  }
  100% {
    transform: scale(2.8);
    opacity: 0;
    filter: brightness(0.8);
  }
}

.animate-ripple {
  animation: ripple 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform, opacity, filter;
  backdrop-filter: blur(1px);
}
</style>
