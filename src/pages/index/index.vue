<script lang="ts" setup>
import { useIndex } from './index'

const { rotation, isSpinning, selectedDate, resultPopup, spinWheel, closeModal, isMuted, toggleMute, audioTop, type, continuousRotation } = useIndex()
</script>

<template>
  <view class="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
    <view class="fixed z-50 text-white rounded-full cursor-pointer" :style="{ top: `${audioTop}px`, [type === 'web' ? 'right' : 'left']: '16px' }" @click="toggleMute">
      <text class="text-[24px]">{{ isMuted ? '🔇' : '🔊' }}</text>
    </view>
    <text class="mb-[20px] text-[32px] font-bold text-purple-600 cartoon-font">情侣约会大转盘</text>
    <view class="relative w-[300px] h-[300px]">
      <view
        class="w-full h-full rounded-full border-[8px] border-pink-300 shadow-md overflow-hidden transition-transform duration-[5000ms] ease-out relative before:content-empty before:absolute before:-top-[8px] before:-left-[8px] before:-right-[8px] before:-bottom-[8px] before:rounded-full before:bg-gradient-conic before:from-red-500 before:via-yellow-500 before:to-blue-500 before:-z-10 before:opacity-50 before:transition-transform before:duration-[5000ms] before:ease-out bg-wheel-gradient"
        :class="{ 'before:animate-wheel-spin': isSpinning }"
        :style="{
          transform: `rotate(${isSpinning ? rotation : continuousRotation}deg)`
        }"
      >
      </view>
      <view class="absolute -top-[5px] left-1/2 w-0 h-0 border-x-[8px] border-x-transparent border-b-[16px] border-b-red-500" style="transform: translateX(-50%) rotate(180deg)"></view>
    </view>
    <button
      class="px-[20px] py-[10px] mt-[20px] font-bold text-[16px] text-white rounded-full shadow-md after:border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
      :class="[isSpinning ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-pink-500 active:bg-pink-600']"
      :disabled="isSpinning"
      @click="spinWheel"
    >
      {{ isSpinning ? '旋转中...' : '开始旋转' }}
    </button>
    <view class="flex items-center mt-[20px] text-purple-600">
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
  <canvas id="canvas" ref="canvas" type="2d" canvas-id="canvas" class="fixed top-0 left-0 w-full h-full pointer-events-none z-[999999]" />
</template>
