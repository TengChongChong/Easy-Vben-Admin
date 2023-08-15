<template>
  <div class="mx-auto mt-12 release-progress-wrapper" style="max-width: 520px">
    <template v-if="isStart">
      <a-typography-text type="secondary" v-if="cmsRelease">
        正在发布{{ cmsRelease.pageIds.split(',').length }}个页面，
        {{ cmsRelease.columnIds.split(',').length }}个栏目
        {{ cmsRelease.releaseArticle === '1' ? '及栏目下文章，' : '，' }}
        发布资源数量越多耗时越长，请耐心等待。
      </a-typography-text>

      <a-progress
        :percent="(((releaseDone + releaseFail) / cmsRelease?.total) * 100).toFixed(1)"
        :success="{ percent: ((releaseDone / cmsRelease?.total) * 100).toFixed(1) }"
        strokeColor="#ff4d4f"
      />

      <a-descriptions :column="1" class="mt-8" bordered>
        <a-descriptions-item label="总任务">
          {{ cmsRelease?.total }}
        </a-descriptions-item>
        <a-descriptions-item label="成功">
          <a-typography-text type="success">{{ releaseDone }}</a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item label="失败">
          <a-typography-text type="danger">{{ releaseFail }}</a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item label="剩余时间">
          <template v-if="remainderTime"> 预计 {{ remainderTimeStr }} 后完成</template>
          <template v-else> 计算中... </template>
        </a-descriptions-item>
      </a-descriptions>

      <div class="text-center mt-4">
        <a-popconfirm
          :title="`确定要停止发布吗?`"
          ok-text="是"
          cancel-text="否"
          @confirm="handleCancelRelease"
        >
          <a-button type="danger">
            <template #icon>
              <Icon icon="material-symbols:stop-rounded" />
            </template>
            停止发布
          </a-button>
        </a-popconfirm>

        <p class="mt-2">
          <a-typography-text type="secondary">
            停止发布将会取消尚未发布的任务，已成功发布的资源不受影响。
          </a-typography-text>
        </p>
      </div>
    </template>
    <template v-if="isEnd">
      <a-result :status="releaseFail ? 'warning' : 'success'" title="发布结束">
        <template #subTitle>
          <a-typography-text type="secondary" v-if="releaseFail">
            共发布{{ cmsRelease.pageIds.split(',').length }}个页面，
            {{ cmsRelease.columnIds.split(',').length }}个栏目
            {{ cmsRelease.releaseArticle === '1' ? '及栏目下文章' : '' }}
            {{ releaseFail ? '，部分页面发布失败，请在"发布历史"详情中检查失败原因。' : '。' }}
          </a-typography-text>
          <a-descriptions :column="1" class="mt-8" bordered>
            <a-descriptions-item label="总任务">
              {{ cmsRelease?.total }}
            </a-descriptions-item>
            <a-descriptions-item label="成功">
              <a-typography-text type="success">{{ releaseDone }}</a-typography-text>
            </a-descriptions-item>
            <a-descriptions-item label="失败">
              <a-typography-text type="danger">{{ releaseFail }}</a-typography-text>
            </a-descriptions-item>
          </a-descriptions>
        </template>
        <template #extra>
          <a-button v-if="isEnd" @click="handleBack">
            <template #icon>
              <Icon icon="ant-design:arrow-left-outlined" />
            </template>
            返回
          </a-button>
        </template>
      </a-result>
    </template>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { message, Progress } from 'ant-design-vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { CmsRelease, ReleaseProgressVO } from '/@/api/cms/model/cmsReleaseModel';
  import dayjs from 'dayjs';
  import { cancelRelease, getReleaseProgress } from '/@/api/cms/cmsRelease';

  export default defineComponent({
    components: {
      Icon,
      [Progress.name]: Progress,
    },
    props: {
      cmsRelease: {
        type: Object as PropType<CmsRelease>,
      },
    },
    emits: ['back', 'end'],
    setup(props, { emit }) {
      const releaseDone = ref(0);
      const releaseFail = ref(0);

      const isEnd = ref(false);
      const isStart = ref(false);
      let progressTimerId: ReturnType<typeof setInterval> | null;
      let countdownTimerId: ReturnType<typeof setInterval> | null;
      // 任务预估剩余时间，单位秒
      const remainderTime = ref(0);
      const remainderTimeStr = ref('');

      function handleStart() {
        // debugger;
        if (unref(isStart) || !!progressTimerId || !!countdownTimerId) {
          return;
        }
        isStart.value = true;
        isEnd.value = false;
        releaseDone.value = (props.cmsRelease?.done as number) || 0;
        releaseFail.value = (props.cmsRelease?.fail as number) || 0;

        progressTimerId = setInterval(() => {
          loadProgress();
        }, 5000);

        countdownTimerId = setInterval(() => {
          countdownRemainderTime();
        }, 1000);
      }

      async function loadProgress() {
        if (props.cmsRelease == null) {
          return;
        }
        const progress = await getReleaseProgress(props.cmsRelease?.id as string);
        releaseDone.value = progress.done;
        releaseFail.value = progress.fail;
        if (progress.end) {
          handleEnd();
        } else {
          calcRemainderTime(progress);
        }
      }
      function handleEnd() {
        stop();
        // 跳转到完成step
        emit('end');
      }

      function handleBack() {
        emit('back');
      }

      /**
       * 计算剩余时间
       */
      function calcRemainderTime(progress: ReleaseProgressVO) {
        if (props.cmsRelease == null) {
          return;
        }
        // 总总务数
        const total = props.cmsRelease?.total as number;
        // 已执行任务
        const executed = progress.done + progress.fail;
        if (executed === 0) {
          // 样本数较少，无法预估时间
          remainderTime.value = 0;
          return;
        }
        // 已执行时长，单位秒
        const duration = (props.cmsRelease.releaseDate! - progress.timeStamp) / 1000;

        // 预计还需 x 秒
        remainderTime.value = ((total - executed) / executed) * duration;
      }

      /**
       * 倒计时剩余时间
       */
      function countdownRemainderTime() {
        if (remainderTime.value <= 0) {
          return;
        }
        remainderTime.value--;
        let ignoreCheck = false;
        let timeStr = '';
        let day = parseInt(remainderTime.value / 60 / 60 / 24),
          hours = parseInt((remainderTime.value / 60 / 60) % 24),
          minutes = parseInt((remainderTime.value / 60) % 60),
          seconds = parseInt(remainderTime.value % 60);
        if (day > 0) {
          ignoreCheck = true;
          timeStr += `${supplementZero(day)}天 `;
        }
        if (hours > 0 || ignoreCheck) {
          ignoreCheck = true;
          timeStr += `${supplementZero(hours)}:`;
        }
        if (minutes > 0 || ignoreCheck) {
          ignoreCheck = true;
          timeStr += `${supplementZero(minutes)}:`;
        }
        if (seconds > 0 || ignoreCheck) {
          timeStr += `${supplementZero(seconds)}`;
        }
        remainderTimeStr.value = timeStr;
      }

      /**
       * 数字 < 10 补 0
       * @param num
       */
      function supplementZero(num): string {
        return num < 10 ? `0${num}` : `${num}`;
      }

      /**
       * 停止定时器
       */
      function stop() {
        isEnd.value = true;
        isStart.value = false;
        clear();
        progressTimerId = null;
        countdownTimerId = null;
      }

      function clear() {
        progressTimerId && window.clearInterval(progressTimerId);
        countdownTimerId && window.clearInterval(countdownTimerId);
      }

      async function handleCancelRelease() {
        const res = await cancelRelease(props.cmsRelease?.id as string);
        if (res) {
          message.success('已停止发布');
          handleBack();
        }
      }

      return {
        isStart,
        isEnd,
        dayjs,
        releaseDone,
        releaseFail,
        handleCancelRelease,
        handleStart,
        handleBack,
        remainderTime,
        remainderTimeStr,
      };
    },
  });
</script>
<style lang="less" scoped>
  .release-progress-wrapper {
    :deep(.ant-descriptions-item-label) {
      width: 160px;
    }
  }
</style>
