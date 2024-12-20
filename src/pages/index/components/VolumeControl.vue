<script lang="ts" setup>
defineProps<{
  isMuted: boolean
  audioTop: number
  type: 'web' | 'mp-weixin'
}>()

defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<template>
  <view class="fixed z-50 text-white rounded-full cursor-pointer" :style="{ top: `${audioTop}px`, [type === 'web' ? 'right' : 'left']: '16px' }" @click="$emit('toggle')">
    <text class="text-[24px]">{{ isMuted ? '🔇' : '🔊' }}</text>
  </view>
</template>
