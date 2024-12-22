<script lang="ts" setup>
defineProps<{
  isSpinning: boolean
  rotation: number
  continuousRotation: number
}>()
</script>

<template>
  <view class="relative w-[300px] h-[300px]">
    <view
      class="w-full h-full rounded-full border-[8px] border-pink-300 shadow-md overflow-hidden transition-transform duration-[5000ms] ease-out relative wheel-gradient"
      :style="{
        transform: `rotate(${isSpinning ? rotation : continuousRotation}deg)`
      }"
    >
      <view class="absolute -top-[8px] -left-[8px] -right-[8px] -bottom-[8px] rounded-full conic-gradient opacity-50 -z-10"></view>
    </view>
    <view class="absolute -top-[5px] left-1/2 w-0 h-0 border-x-[10px] rounded-[6px] border-x-transparent border-b-[16px] border-b-pink-500" style="transform: translateX(-50%) rotate(180deg)"></view>
  </view>
</template>

<style lang="scss" scoped>
@use 'sass:map';

// 定义颜色变量
$wheel-colors: (
  pink: #f9a8d4,
  yellow: #fcd34d,
  purple: #a78bfa,
  blue: #93c5fd
);

$conic-colors: (
  red: #ff0000,
  orange: #ff8800,
  yellow: #ffff00,
  green: #00ff00,
  cyan: #00ffff,
  blue: #0000ff,
  magenta: #ff00ff
);

.wheel-gradient {
  background: conic-gradient(
    map.get($wheel-colors, pink) 0deg 45deg,
    map.get($wheel-colors, yellow) 45deg 90deg,
    map.get($wheel-colors, purple) 90deg 135deg,
    map.get($wheel-colors, blue) 135deg 180deg,
    map.get($wheel-colors, pink) 180deg 225deg,
    map.get($wheel-colors, yellow) 225deg 270deg,
    map.get($wheel-colors, purple) 270deg 315deg,
    map.get($wheel-colors, blue) 315deg 360deg
  );
}

.conic-gradient {
  background: conic-gradient(
    from 0deg,
    map.get($conic-colors, red),
    map.get($conic-colors, orange),
    map.get($conic-colors, yellow),
    map.get($conic-colors, green),
    map.get($conic-colors, cyan),
    map.get($conic-colors, blue),
    map.get($conic-colors, magenta),
    map.get($conic-colors, red)
  );
}
</style>
