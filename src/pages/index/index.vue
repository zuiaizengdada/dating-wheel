<script lang="ts" setup>
import { useIndex } from './index'
import FloatingDots from './components/FloatingDots.vue'

const { rotation, isSpinning, selectedDate, resultPopup, spinWheel, closeModal, isMuted, toggleMute, audioTop, type, continuousRotation } = useIndex()
</script>

<template>
  <view class="flex overflow-hidden relative flex-col justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
    <FloatingDots v-if="!isSpinning" />

    <view class="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-pink-200 filter blur-3xl opacity-30"></view>
    <view class="absolute bottom-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-purple-200 filter blur-3xl opacity-30"></view>

    <view class="flex relative z-10 flex-col gap-4 items-center">
      <view class="fixed z-50 text-white rounded-full cursor-pointer" :style="{ top: `${audioTop}px`, [type === 'web' ? 'right' : 'left']: '16px' }" @click="toggleMute">
        <text class="text-[24px]">{{ isMuted ? '🔇' : '🔊' }}</text>
      </view>
      <text class="mb-[20px] text-[32px] font-bold text-pink-500 cartoon-font">情侣约会大转盘</text>
      <view class="relative w-[300px] h-[300px]">
        <view
          class="w-full h-full rounded-full border-[8px] border-pink-300 shadow-md overflow-hidden transition-transform duration-[5000ms] ease-out relative wheel-gradient"
          :style="{
            transform: `rotate(${isSpinning ? rotation : continuousRotation}deg)`
          }"
        >
          <view class="absolute -top-[8px] -left-[8px] -right-[8px] -bottom-[8px] rounded-full conic-gradient opacity-50 -z-10"></view>
        </view>
        <view
          class="absolute -top-[5px] left-1/2 w-0 h-0 border-x-[10px] rounded-[6px] border-x-transparent border-b-[16px] border-b-pink-500"
          style="transform: translateX(-50%) rotate(180deg)"
        ></view>
      </view>
      <button
        class="px-[20px] py-[10px] mt-[20px] font-bold text-[16px] text-white rounded-full shadow-md after:border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
        :class="[isSpinning ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-pink-500 active:bg-pink-600']"
        :disabled="isSpinning"
        @click="spinWheel"
      >
        {{ isSpinning ? '旋转中...' : '开始旋转' }}
      </button>
      <view class="flex items-center mt-[20px] text-pink-500">
        <text class="mr-[8px] text-[16px]">💗</text>
        <text class="text-[16px]">期待我们的完美约会！</text>
        <text class="text-[16px]">💗</text>
      </view>
      <uni-popup ref="resultPopup" type="center">
        <view class="w-[300px] bg-white p-[32px] rounded-lg flex flex-col items-center">
          <text class="text-[25px] font-bold mb-[10px] cartoon-font">你们的约会计划是</text>
          <text class="text-[25px] text-pink-500 font-bold mb-[20px] cartoon-font">{{ selectedDate }}</text>
          <button class="px-[16px] py-[8px] text-[16px] text-white bg-purple-500 rounded" @click="closeModal">关闭</button>
        </view>
      </uni-popup>
    </view>
  </view>
  <canvas id="canvas" ref="canvas" type="2d" canvas-id="canvas" class="fixed top-0 left-0 w-full h-full pointer-events-none z-[999999]" />
</template>

<style lang="scss" scoped>
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
    map-get($wheel-colors, pink) 0deg 45deg,
    map-get($wheel-colors, yellow) 45deg 90deg,
    map-get($wheel-colors, purple) 90deg 135deg,
    map-get($wheel-colors, blue) 135deg 180deg,
    map-get($wheel-colors, pink) 180deg 225deg,
    map-get($wheel-colors, yellow) 225deg 270deg,
    map-get($wheel-colors, purple) 270deg 315deg,
    map-get($wheel-colors, blue) 315deg 360deg
  );
}

.conic-gradient {
  background: conic-gradient(
    from 0deg,
    map-get($conic-colors, red),
    map-get($conic-colors, orange),
    map-get($conic-colors, yellow),
    map-get($conic-colors, green),
    map-get($conic-colors, cyan),
    map-get($conic-colors, blue),
    map-get($conic-colors, magenta),
    map-get($conic-colors, red)
  );
}
</style>
