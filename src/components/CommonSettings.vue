<script setup lang="ts">
import { ref } from 'vue';

const assignmentNotification = ref(false);
const statusNotification = ref(false);
const commentNotification = ref(false);
</script>

<template>
  <div class="flex-stack w-1/2">
    <section class="flex gap-8 items-center">
      <div class="relative">
        <img src="../assets/logo.png" class="border w-36 h-36 rounded-full bg-pink-300" />
        <button class="absolute bottom-1 right-2 w-7 h-7 bg-gray-2 rounded-full flex-center text-xl hover:bg-gray-1">
          +
        </button>
      </div>
      <div class="flex flex-col gap-5">
        <p class="font-semibold text-2xl">stone.vue</p>
        <p class="text-2xl text-gray-1">stone@gmail.com</p>
      </div>
    </section>

    <form class="flex-stack gap-10 mt-14">
      <div class="flex-stack gap-0.5">
        <label class="text-gray-0">현재 비밀번호</label>
        <input
          class="w-full bg-gray-2 bg-opacity-80 rounded-lg py-2 px-3.5 focus:outline-none"
          type="password"
          placeholder="현재 비밀번호를 입력해주세요"
        />
      </div>

      <div class="flex-stack gap-0.5">
        <label class="text-gray-0">새 비밀번호</label>
        <input
          class="w-full bg-gray-2 bg-opacity-80 rounded-lg py-2 px-3.5 focus:outline-none"
          type="password"
          placeholder="새 비밀번호를 입력해주세요"
        />
      </div>

      <div class="flex-stack gap-0.5">
        <label class="text-gray-0">새 비밀번호 확인</label>
        <input
          class="w-full bg-gray-2 bg-opacity-80 rounded-lg py-2 px-3.5 focus:outline-none"
          type="password"
          placeholder="새 비밀번호를 확인해주세요"
        />
      </div>

      <!-- 알림 조건부 렌더링 -->
      <div class="flex-stack gap-5">
        <div class="flex items-center justify-between w-1/3">
          <p class="font-bold">담당자 배정 알림</p>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
            :class="assignmentNotification ? 'bg-blue-1' : 'bg-gray-1'"
            @click="assignmentNotification = !assignmentNotification"
          >
            <div
              class="inline-block h-4 w-4 transform rounded-full bg-white-0 transition"
              :class="assignmentNotification ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <div class="flex items-center justify-between w-1/3">
          <p class="font-bold">진행상태 변경 알림</p>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
            :class="statusNotification ? 'bg-blue-1' : 'bg-gray-1'"
            @click="statusNotification = !statusNotification"
          >
            <div
              class="inline-block h-4 w-4 transform rounded-full bg-white-0 transition"
              :class="statusNotification ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <div class="flex items-center justify-between w-1/3">
          <p class="font-bold">티켓 댓글 알림</p>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
            :class="commentNotification ? 'bg-blue-1' : 'bg-gray-1'"
            @click="commentNotification = !commentNotification"
          >
            <div
              class="inline-block h-4 w-4 transform rounded-full bg-white-0 transition"
              :class="commentNotification ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>

      <button class="btn-main max-w-fit self-end">저장</button>
    </form>
  </div>
</template>
