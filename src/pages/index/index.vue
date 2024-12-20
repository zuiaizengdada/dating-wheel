<script lang="ts" setup>
import { useIndex } from './index'
import FloatingDots from './components/FloatingDots.vue'
import LuckyWheel from './components/LuckyWheel.vue'
import VolumeControl from './components/VolumeControl.vue'

const { rotation, isSpinning, selectedDate, resultPopup, spinWheel, closeModal, isMuted, toggleMute, audioTop, type, continuousRotation } = useIndex()
</script>

<template>
  <view class="flex overflow-hidden relative flex-col justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
    <!-- 背景 小圆点 -->
    <FloatingDots v-if="!isSpinning" />

    <view class="flex relative z-10 flex-col gap-4 items-center">
      <!-- 音量控制 -->
      <VolumeControl :is-muted="isMuted" :audio-top="audioTop" :type="type" @toggle="toggleMute" />

      <!-- 标题 -->
      <text class="mb-[20px] text-[32px] font-bold text-pink-500 cartoon-font">情侣约会大转盘</text>

      <!-- 转盘 -->
      <LuckyWheel :is-spinning="isSpinning" :rotation="rotation" :continuous-rotation="continuousRotation" />

      <!-- 开始旋转按钮 -->
      <button
        class="px-[20px] py-[10px] mt-[20px] font-bold text-[16px] text-white rounded-full shadow-md after:border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
        :class="[isSpinning ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-pink-500 active:bg-pink-600']"
        :disabled="isSpinning"
        @click="spinWheel"
      >
        {{ isSpinning ? '旋转中...' : '开始旋转' }}
      </button>

      <!-- 期待我们的完美约会 -->
      <view class="flex items-center mt-[20px] text-pink-500">
        <text class="mr-[8px] text-[16px]">💗</text>
        <text class="text-[16px]">期待我们的完美约会！</text>
        <text class="text-[16px]">💗</text>
      </view>

      <!-- 结果弹窗 -->
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
