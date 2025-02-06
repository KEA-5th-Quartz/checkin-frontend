<script setup lang="ts">
import { useCustomMutation } from '@/composables/useCustomMutation';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { AttachedFile, CommentMember } from '@/types/tickets';
import { formatShortDateTime } from '@/utils/dateFormat';
import { useQueryClient } from '@tanstack/vue-query';
import { nextTick, ref, watch } from 'vue';
import SvgIcon from '../common/SvgIcon.vue';
import { ClipIcon, DownloadIcon, LikeIcon, SendIcon } from '@/assets/icons/path';
import { useTicketStore } from '@/stores/userTicketStore';

const props = defineProps<{
  ticketId: number;
}>();

const memberStore = useMemberStore();
const ticketStore = useTicketStore();
const queryClient = useQueryClient();

const chatContainer = ref<HTMLElement | null>(null);
// 댓글 작성자 정보를 저장할 Map
const commentUserMap = ref(new Map<number, CommentMember>());
const commentContent = ref('');
// 댓글 좋아요 정보를 저장할 Map
const commentLikesMap = ref(
  new Map<
    number,
    {
      totalLikes: number;
      likes: Array<{ memberId: number; username: string }>;
    }
  >(),
);
const selectedCommentId = ref<number | null>(null);
const selectedCommentLikes = ref<{
  totalLikes: number;
  likes: Array<{ memberId: number; username: string }>;
} | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
// 첨부된 파일 정보를 저장할 ref
const attachedFiles = ref<AttachedFile[]>([]);
const previewUrl = ref<string | null>(null);
const showPreview = ref(false);

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    // 확실히 하기 위해 약간의 지연 후 다시 시도
    setTimeout(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    }, 50);
  }
};

// 댓글 작성자 정보를 가져오는 함수
const fetchCommentUserInfo = async (memberId: number) => {
  try {
    const response = await userApi.getMemberId(memberId);
    const userData = response.data.data;
    commentUserMap.value.set(memberId, {
      memberId: userData.memberId,
      username: userData.username,
      profilePic: userData.profilePic,
    });
  } catch (err) {
    console.error('회원 정보 조회 실패:', err);
  }
};

// 댓글의 좋아요 정보를 가져오는 함수
const fetchCommentLikes = async (ticketId: number, commentId: number) => {
  try {
    const response = await ticketApi.getCommentsLikes(ticketId, commentId);
    const likesData = response.data.data;
    commentLikesMap.value.set(commentId, {
      totalLikes: likesData.totalLikes,
      likes: likesData.likes,
    });
  } catch (err) {
    console.error('댓글 좋아요 정보 조회 실패:', err);
  }
};

// 댓글 데이터 페치
const { data: commentData } = useCustomQuery(['ticket-comments', props.ticketId], async () => {
  try {
    const response = await ticketApi.getTicketComments(props.ticketId);
    return response.data.data;
  } catch (err) {
    console.error('티켓 댓글 조회 실패:', err);
    throw err;
  }
});

// 댓글 작성자 정보와 좋아요 정보
watch(
  () => commentData.value?.activities,
  async (activities) => {
    if (activities) {
      // 멤버 정보 수집 및 좋아요 정보 가져오기
      const memberIds = new Set(
        activities
          .filter((item: { type: string }) => item.type !== 'LOG')
          .map((item: { memberId: number }) => item.memberId),
      );
      // 멤버 정보 가져오기
      for (const memberId of memberIds) {
        if (!commentUserMap.value.has(memberId as number)) {
          await fetchCommentUserInfo(memberId as number);
        }
      }
      // 각 댓글의 좋아요 정보 가져오기
      for (const item of activities) {
        if (item.type !== 'LOG') {
          await fetchCommentLikes(props.ticketId, item.commentId);
        }
      }
    }
  },
  { immediate: true },
);

// 좋아요 토글 뮤테이션
const likeMutation = useCustomMutation(
  async ({ ticketId, commentId }: { ticketId: number; commentId: number }) => {
    const response = await ticketApi.putCommentsLikes(ticketId, commentId);
    return response.data;
  },
  {
    onSuccess: async (_, variables) => {
      // 좋아요 토글 후 해당 댓글의 좋아요 정보 새로고침
      await fetchCommentLikes(variables.ticketId, variables.commentId);
    },
  },
);

// 댓글 작성 뮤테이션
const commentsMutation = useCustomMutation(
  async ({ ticketId, content }: { ticketId: number; content: string }) => {
    const response = await ticketApi.postTicketComments(ticketId, { content });
    return response.data;
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-comments', props.ticketId] });
    },
  },
);

// 파일 첨부 뮤테이션
const attachmentMutation = useCustomMutation(
  async ({ ticketId, formData }: { ticketId: number; formData: any }) => {
    const response = await ticketApi.postTicketAttachment(ticketId, formData);

    return response.data;
  },
  {
    onSuccess: (response) => {
      const newFile = response.data;
      attachedFiles.value.push({
        commentId: newFile.commentId,
        attachmentUrl: newFile.attachmentUrl,
        isImage: newFile.isImage,
      });

      queryClient.invalidateQueries({ queryKey: ['ticket-comments', props.ticketId] });
    },
  },
);

// 좋아요 토글 핸들러
const handleLikeToggle = async (commentId: number) => {
  try {
    await likeMutation.mutateAsync({
      ticketId: props.ticketId,
      commentId: commentId,
    });
  } catch (err) {
    console.error('좋아요 토글 실패:', err);
  }
};

// 댓글 작성 함수
const handleAddComments = async () => {
  if (!commentContent.value.trim()) return; // 빈 댓글 방지
  try {
    await commentsMutation.mutateAsync({
      ticketId: props.ticketId,
      content: commentContent.value,
    });
    // 성공적으로 댓글이 작성되면 textarea 비우기
    commentContent.value = '';
    scrollToBottom();
  } catch (err) {
    console.error('댓글 작성 실패:', err);
  }
};

// 파일 선택 트리거 함수
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 파일 변경 핸들러
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  const file = target.files[0];

  // 파일 크기 검사 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('파일 크기는 10MB를 초과할 수 없습니다.');
    target.value = '';
    return;
  }

  const formData = new FormData();
  const requestData = {
    ticketId: props.ticketId,
  };

  formData.append('file', file);
  formData.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));

  try {
    await attachmentMutation.mutateAsync({
      ticketId: props.ticketId,
      formData: formData,
    });

    if (fileInput.value) {
      fileInput.value.value = '';
    }
    scrollToBottom();
  } catch (err) {
    if (err instanceof Error) {
      console.error('파일 첨부 실패:', err.message);
    }
    alert('파일 첨부에 실패했습니다.');
  }
};

// 파일 다운로드
const handleFileDownload = (file: AttachedFile) => {
  try {
    window.open(file.attachmentUrl, '_blank'); // 새 창에서 파일 URL 열기
  } catch (err) {
    console.error('파일 다운로드 실패:', err);
    alert('파일 다운로드에 실패했습니다.');
  }
};

// 이미지 미리보기
const handlePreview = (file: AttachedFile) => {
  if (file.isImage) {
    previewUrl.value = file.attachmentUrl;
    showPreview.value = true;
  }
};

// 좋아요 목록 모달 표시 함수
const handleShowLikes = (commentId: number) => {
  const likes = commentLikesMap.value.get(commentId);
  if (likes) {
    if (selectedCommentId.value === commentId) {
      // 같은 댓글을 다시 클릭하면 모달 닫기
      selectedCommentId.value = null;
      selectedCommentLikes.value = null;
    } else {
      // 다른 댓글을 클릭하면 해당 댓글의 좋아요 정보 표시
      selectedCommentId.value = commentId;
      selectedCommentLikes.value = likes;
    }
  }
};

// 현재 사용자가 좋아요를 눌렀는지 확인하는 함수
const hasLiked = (commentId: number) => {
  const likes = commentLikesMap.value.get(commentId)?.likes || [];
  return likes.some((like) => like.memberId === memberStore.memberId);
};

const isLastComment = (index: number) => {
  if (!commentData.value?.activities) return false;

  const nextCommentIndex = commentData.value.activities
    .slice(index + 1)
    .findIndex((item: { type: string }) => item.type !== 'LOG');

  return nextCommentIndex === -1;
};
</script>

<template>
  <!-- 댓글 입력창 -->
  <div ref="chatContainer" class="ticket-comment-container">
    <!-- 로그 -->
    <div v-if="commentData">
      <div v-for="(item, index) in commentData.activities" :key="item.type === 'LOG' ? item.log_id : item.commentId">
        <!-- 로그 표시 -->
        <div v-if="item.type === 'LOG'" class="ticket-comment-log">
          <div class="flex-stack items-center">
            <p class="text-xs text-gray-1">
              {{ new Date(item.createdAt).toLocaleString() }}
            </p>
            <p class="ticket-log-p-content">
              {{ item.logContent }}
            </p>
          </div>
        </div>

        <!-- 댓글 표시 -->
        <div v-else class="ticket-comment-comment">
          <div class="relative flex-stack">
            <p class="ticket-comment-username">
              {{ commentUserMap.get(item.memberId)?.username }}
            </p>
            <img
              v-if="commentUserMap.get(item.memberId)?.profilePic"
              :src="commentUserMap.get(item.memberId)?.profilePic"
              class="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <!-- 첨부 파일이 있는 경우 표시 -->
          <div v-if="item.attachmentUrl">
            <!-- 이미지인 경우 -->
            <div
              @click="
                handleFileDownload({
                  commentId: item.commentId,
                  attachmentUrl: item.attachmentUrl,
                  isImage: item.isImage,
                })
              "
              v-if="item.isImage"
              class="relative"
            >
              <img
                :src="item.attachmentUrl"
                class="max-h-32 rounded cursor-pointer"
                @click="
                  handlePreview({
                    commentId: item.commentId,
                    attachmentUrl: item.attachmentUrl,
                    isImage: item.isImage,
                  })
                "
              />
            </div>
            <!-- 이미지가 아닌 경우 -->
            <div
              v-else
              @click="
                handleFileDownload({
                  commentId: item.commentId,
                  attachmentUrl: item.attachmentUrl,
                  isImage: item.isImage,
                })
              "
              class="self-center flex mt-2 cursor-pointer"
            >
              <SvgIcon :icon="DownloadIcon" class="w-5 h-5 text-gray-500" />
              <span class="text-sm text-gray-1">첨부파일</span>
            </div>
          </div>

          <div v-else class="ticket-comment-bubble">
            <p class="text-sm">{{ item.commentContent }}</p>
          </div>
          <div class="flex-stack self-end">
            <div class="flex gap-1 relative">
              <SvgIcon
                :icon="LikeIcon"
                class="cursor-pointer"
                :iconOptions="{ fill: hasLiked(item.commentId) ? '#48c5ff' : '#8A8A8A' }"
                @click="handleLikeToggle(item.commentId)"
              />
              <span
                class="ticket-like-count-span"
                :class="{
                  'bg-primary-4 text-white-0': selectedCommentId === item.commentId,
                }"
                @click="handleShowLikes(item.commentId)"
              >
                {{ commentLikesMap.get(item.commentId)?.totalLikes || 0 }}
              </span>

              <section
                v-if="selectedCommentId === item.commentId && selectedCommentLikes"
                :class="['ticket-like-modal-section', isLastComment(index) ? 'bottom-full mb-1' : 'top-7 mt-2']"
              >
                <div class="ticket-like-modal-div" @click.stop>
                  <div class="ticket-like-modal-header">좋아요</div>
                  <div class="space-y-1">
                    <div v-for="like in selectedCommentLikes.likes" :key="like.memberId" class="ticket-like-modal-item">
                      <span class="text-xs">{{ like.username }}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <p class="text-[9px] text-gray-1">
              {{ formatShortDateTime(item.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 댓글 인풋 -->
  <div v-if="!ticketStore.isEditMode" class="ticket-comment-input-area">
    <textarea
      v-model="commentContent"
      maxlength="128"
      placeholder="댓글을 작성하세요"
      class="ticket-comment-textarea"
    />
    <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
    <div class="flex gap-2 w-full justify-end pb-1.5">
      <SvgIcon :icon="ClipIcon" class="cursor-pointer" @click="triggerFileInput" />
      <SvgIcon :icon="SendIcon" class="cursor-pointer" @click="handleAddComments" />
    </div>
  </div>
</template>
