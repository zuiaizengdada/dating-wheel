<script lang="ts" setup>
import { useIndex } from './index'

const { rotation, isSpinning, selectedDate, resultPopup, spinWheel, closeModal, isMuted, toggleMute, audioTop, type } = useIndex()
</script>

<template>
  <view class="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
    <view class="fixed right-4 z-50 text-white rounded-full cursor-pointer" :class="[type === 'web' ? 'right-4' : 'left-4']" :style="{ top: `${audioTop}px` }" @click="toggleMute">
      <text class="text-lg">{{ isMuted ? '🔇' : '🔊' }}</text>
    </view>
    <text class="mb-5 text-2xl font-bold text-purple-600 cartoon-font">情侣约会大转盘</text>
    <view class="relative w-[300px] h-[300px]">
      <view
        class="w-full h-full rounded-full border-8 border-pink-300 shadow-md overflow-hidden transition-transform duration-[5000ms] ease-out"
        :style="{
          transform: `rotate(${rotation}deg)`,
          backgroundImage: `conic-gradient(
              #f9a8d4 0deg 45deg,
              #fcd34d 45deg 90deg,
              #a78bfa 90deg 135deg,
              #93c5fd 135deg 180deg,
              #f9a8d4 180deg 225deg,
              #fcd34d 225deg 270deg,
              #a78bfa 270deg 315deg,
              #93c5fd 315deg 360deg
            )`
        }"
      >
      </view>
      <view class="absolute -top-[5px] left-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-[16px] border-b-red-500" style="transform: translateX(-50%) rotate(180deg)"></view>
    </view>
    <button
      class="px-5 py-2.5 mt-5 font-bold text-white rounded-full shadow-md after:border-none"
      :class="[isSpinning ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-pink-500 active:bg-pink-600']"
      :disabled="isSpinning"
      @click="spinWheel"
    >
      {{ isSpinning ? '旋转中...' : '开始旋转' }}
    </button>
    <view class="flex items-center mt-5 text-purple-600">
      <text class="mr-2">💗</text>
      <text>期待我们的完美约会！</text>
      <text>💗</text>
    </view>
    <uni-popup ref="resultPopup" type="center">
      <view class="w-[300px] bg-white p-8 rounded-lg flex flex-col items-center">
        <text class="text-[25px] font-bold mb-2.5 cartoon-font">你们的约会计划是</text>
        <text class="text-[25px] text-pink-500 font-bold mb-5 cartoon-font">{{ selectedDate }}</text>
        <button class="px-4 text-white bg-purple-500 rounded" @click="closeModal">关闭</button>
      </view>
    </uni-popup>
  </view>
  <canvas id="canvas" ref="canvas" type="2d" canvas-id="canvas" class="fixed top-0 left-0 w-full h-full pointer-events-none z-[999999]" />
</template>
