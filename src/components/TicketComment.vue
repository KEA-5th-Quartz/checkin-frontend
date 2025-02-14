<script setup lang="ts">
import { useCustomMutation } from '@/composables/useCustomMutation';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { AttachedFile, CommentMember } from '@/types/tickets';
import { formatShortDateTime } from '@/utils/dateFormat';
import { useQueryClient } from '@tanstack/vue-query';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { ClipIcon, DownloadIcon, LikeIcon, SendIcon } from '@/assets/icons/path';
import { useTicketStore } from '@/stores/userTicketStore';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { handleError } from '@/utils/handleError';
import { ALLOWED_FILE_TYPES } from '@/constants/fileConstants';
import SvgIcon from './common/SvgIcon.vue';
import CommonTextarea from './common/commonTextarea.vue';
import CommonDialog from './common/CommonDialog.vue';

const props = defineProps<{
  ticketId: number;
}>();

const memberStore = useMemberStore();
const ticketStore = useTicketStore();
const queryClient = useQueryClient();
const dialogState = ref<DialogProps>({ ...initialDialog });

const chatContainer = ref<HTMLElement | null>(null);
const commentUserMap = ref(new Map<number, CommentMember>());
const commentContent = ref('');

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

const attachedFiles = ref<AttachedFile[]>([]);
const previewUrl = ref<string | null>(null);
const showPreview = ref(false);
const isLikeMenu = ref(false);

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;

    setTimeout(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    }, 50);
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.ticket-like-modal-section')) {
    isLikeMenu.value = false;
    selectedCommentId.value = null;
    selectedCommentLikes.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

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
    handleError(dialogState, '회원 정보 조회 실패');
  }
};

const fetchCommentLikes = async (ticketId: number, commentId: number) => {
  try {
    const response = await ticketApi.getCommentsLikes(ticketId, commentId);
    const likesData = response.data.data;
    commentLikesMap.value.set(commentId, {
      totalLikes: likesData.totalLikes,
      likes: likesData.likes,
    });
  } catch (err) {
    handleError(dialogState, '댓글 좋아요 정보 조회 실패');
  }
};

const { data: commentData } = useCustomQuery(
  ['ticket-comments', props.ticketId],
  async () => {
    try {
      const response = await ticketApi.getTicketComments(props.ticketId);
      return response.data.data;
    } catch (err) {
      handleError(dialogState, '티켓 댓글 조회 실패');
      throw err;
    }
  },
  {
    refetchOnWindowFocus: true,
  },
);

watch(
  () => commentData.value?.activities,
  async (activities) => {
    if (activities) {
      const memberIds = new Set(
        activities
          .filter((item: { type: string }) => item.type !== 'LOG')
          .map((item: { memberId: number }) => item.memberId),
      );

      for (const memberId of memberIds) {
        if (!commentUserMap.value.has(memberId as number)) {
          await fetchCommentUserInfo(memberId as number);
        }
      }

      for (const item of activities) {
        if (item.type !== 'LOG') {
          await fetchCommentLikes(props.ticketId, item.commentId);
        }
      }
    }
  },
  { immediate: true },
);

const likeMutation = useCustomMutation(
  async ({ ticketId, commentId }: { ticketId: number; commentId: number }) => {
    const response = await ticketApi.putCommentsLikes(ticketId, commentId);
    return response.data;
  },
  {
    onSuccess: async (_, variables) => {
      await fetchCommentLikes(variables.ticketId, variables.commentId);
    },
  },
);

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

const handleLikeToggle = async (commentId: number) => {
  await likeMutation.mutateAsync({
    ticketId: props.ticketId,
    commentId: commentId,
  });
  queryClient.invalidateQueries({ queryKey: ['ticket-comments', props.ticketId] });
};

const handleAddComments = async () => {
  if (!commentContent.value.trim()) return;
  try {
    await commentsMutation.mutateAsync({
      ticketId: props.ticketId,
      content: commentContent.value,
    });

    commentContent.value = '';
    scrollToBottom();
  } catch (err) {
    handleError(dialogState, '댓글 작성 실패');
  }
};

const handleKeyDown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      return;
    } else {
      event.preventDefault();
      await handleAddComments();
    }
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const validateFileSignature = async (file: File, expectedSignature: number[]): Promise<boolean> => {
  const buffer = await file.arrayBuffer();
  const header = new Uint8Array(buffer.slice(0, expectedSignature.length));
  return expectedSignature.every((byte, i) => header[i] === byte);
};

const sanitizeFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop();
  const baseName = fileName.split('.').slice(0, -1).join('.');
  const sanitizedBase = baseName.replace(/[^\w\s-]/g, '');
  return `${sanitizedBase}.${extension}`;
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  const file = target.files[0];
  const fileType = file.type;

  try {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }

    if (!Object.keys(ALLOWED_FILE_TYPES).includes(fileType)) {
      throw new Error('지원하지 않는 파일 형식입니다.');
    }

    const isValidSignature = await validateFileSignature(
      file,
      ALLOWED_FILE_TYPES[fileType as keyof typeof ALLOWED_FILE_TYPES],
    );

    if (!isValidSignature) {
      throw new Error('파일 형식이 올바르지 않습니다.');
    }

    const sanitizedFileName = sanitizeFileName(file.name);

    const formData = new FormData();
    const requestData = {
      ticketId: props.ticketId,
    };

    formData.append('file', file, sanitizedFileName);
    formData.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));

    await attachmentMutation.mutateAsync({
      ticketId: props.ticketId,
      formData: formData,
    });

    if (fileInput.value) {
      fileInput.value.value = '';
    }
    scrollToBottom();
  } catch (err) {
    if (fileInput.value) {
      fileInput.value.value = '';
    }

    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: err instanceof Error ? err.message : '파일 첨부에 실패했습니다.',
      mainText: '확인',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
      },
    };
  }
};

const handleFileDownload = (file: AttachedFile) => {
  try {
    const fileUrl = file.attachmentUrl;
    const fileName = fileUrl.split('/').pop() || 'download';

    if (file.isImage) {
      window.open(fileUrl, '_blank');
      return;
    }

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    handleError(dialogState, '파일 다운로드 실패');
  }
};

const handlePreview = (file: AttachedFile) => {
  if (file.isImage) {
    previewUrl.value = file.attachmentUrl;
    showPreview.value = true;
  }
};

const handleShowLikes = (commentId: number, event: Event) => {
  event.stopPropagation();
  const likes = commentLikesMap.value.get(commentId);
  if (likes) {
    if (selectedCommentId.value === commentId) {
      selectedCommentId.value = null;
      selectedCommentLikes.value = null;
      isLikeMenu.value = false;
    } else {
      selectedCommentId.value = commentId;
      selectedCommentLikes.value = likes;
      isLikeMenu.value = true;
    }
  }
};

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
  <div ref="chatContainer" class="ticket-comment-container">
    <div v-if="commentData">
      <div v-for="(item, index) in commentData.activities" :key="item.type === 'LOG' ? item.log_id : item.commentId">
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

          <div v-if="item.attachmentUrl">
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
                @click.stop="
                  handlePreview({
                    commentId: item.commentId,
                    attachmentUrl: item.attachmentUrl,
                    isImage: item.isImage,
                  })
                "
              />
            </div>

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
                  'bg-primary-4 text-white-0 border-primary-4': selectedCommentId === item.commentId,
                }"
                @click="(event) => handleShowLikes(item.commentId, event)"
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

  <div v-if="!ticketStore.isEditMode" class="ticket-comment-input-area">
    <CommonTextarea
      v-model="commentContent"
      maxlength="128"
      placeholder="댓글을 작성하세요"
      class="ticket-comment-textarea"
      @keydown="handleKeyDown"
    />
    <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
    <div class="flex gap-2 w-full justify-end pb-1.5">
      <SvgIcon
        :icon="ClipIcon"
        class="cursor-pointer hover:bg-primary-5 h-6 w-6 rounded-md"
        @click="triggerFileInput"
      />
      <SvgIcon
        :icon="SendIcon"
        class="cursor-pointer hover:bg-primary-5 h-6 w-6 rounded-md"
        @click="handleAddComments"
      />
    </div>
  </div>

  <CommonDialog
    v-if="dialogState.open"
    :isOneBtn="dialogState.isOneBtn"
    :title="dialogState.title"
    :mainText="dialogState.mainText"
    :onCancelClick="dialogState.onMainClick"
    :onMainClick="dialogState.onMainClick"
  />
</template>
