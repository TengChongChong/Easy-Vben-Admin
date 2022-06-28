<template>
  <div :class="prefixCls" :style="{ width: containerWidth }">
    <textarea
      :id="tinymceId"
      ref="elRef"
      :style="{ visibility: 'hidden' }"
      v-if="!initOptions.inline"
    >
    </textarea>
    <slot v-else></slot>

    <insert-image-modal
      @register="registerInsertImageModal"
      @uploading="handleUploading"
      @done="handleDone"
    />
  </div>
</template>

<script lang="ts">
  // tinymce 插件列表 http://tinymce.ax-z.cn/plugins/advlist.php
  import type { Editor, RawEditorSettings } from 'tinymce';
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/silver';
  import 'tinymce/icons/default/icons';
  // 高级列表
  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/lists';
  // 自动链接
  import 'tinymce/plugins/autolink';
  import 'tinymce/plugins/fullscreen';
  import 'tinymce/plugins/hr';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/paste';
  // 查找替换
  import 'tinymce/plugins/searchreplace';
  // tab切入切出
  import 'tinymce/plugins/tabfocus';
  import 'tinymce/plugins/table';
  // 快速排版
  import 'tinymce/plugins/textpattern';
  import 'tinymce/plugins/wordcount';

  import {
    defineComponent,
    computed,
    nextTick,
    ref,
    unref,
    watch,
    onDeactivated,
    onBeforeUnmount,
  } from 'vue';
  import InsertImageModal from './InsertImageModal.vue';
  import { toolbar, plugins } from './tinymce';
  import { buildShortUUID } from '/@/utils/uuid';
  import { bindHandlers } from './helper';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isNumber } from '/@/utils/is';
  import { useLocale } from '/@/locales/useLocale';
  import { useAppStore } from '/@/store/modules/app';
  import { useModal } from '/@/components/Modal';

  const tinymceProps = {
    options: {
      type: Object as PropType<Partial<RawEditorSettings>>,
      default: {},
    },
    value: {
      type: String,
    },

    toolbar: {
      type: Array as PropType<string[]>,
      default: toolbar,
    },
    plugins: {
      type: Array as PropType<string[]>,
      default: plugins,
    },
    modelValue: {
      type: String,
    },
    height: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 400,
    },
    width: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 'auto',
    },
    showImageUpload: {
      type: Boolean,
      default: false,
    },
  };

  export default defineComponent({
    name: 'Tinymce',
    components: { InsertImageModal },
    inheritAttrs: false,
    props: tinymceProps,
    emits: ['change', 'update:modelValue', 'inited', 'init-error'],
    setup(props, { emit, attrs }) {
      const editorRef = ref<Nullable<Editor>>(null);
      const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
      const elRef = ref<Nullable<HTMLElement>>(null);

      const { prefixCls } = useDesign('tinymce-container');

      const appStore = useAppStore();

      const tinymceContent = computed(() => props.modelValue);

      const containerWidth = computed(() => {
        const width = props.width;
        if (isNumber(width)) {
          return `${width}px`;
        }
        return width;
      });

      const skinName = computed(() => {
        return appStore.getDarkMode === 'light' ? 'oxide' : 'oxide-dark';
      });

      const langName = computed(() => {
        const lang = useLocale().getLocale.value;
        return ['zh_CN', 'en'].includes(lang) ? lang : 'zh_CN';
      });

      const initOptions = computed((): RawEditorSettings => {
        const { height, options, toolbar, plugins } = props;
        const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';
        return {
          selector: `#${unref(tinymceId)}`,
          height,
          toolbar,
          // 工具栏 'file edit insert view format table',
          menubar: '',
          plugins,
          language_url: publicPath + 'resource/tinymce/langs/' + langName.value + '.js',
          language: langName.value,
          branding: false,
          default_link_target: '_blank',
          link_title: false,
          object_resizing: false,
          auto_focus: true,
          skin: skinName.value,
          skin_url: publicPath + 'resource/tinymce/skins/ui/' + skinName.value,
          content_css:
            publicPath + 'resource/tinymce/skins/ui/' + skinName.value + '/content.min.css',
          ...options,
          setup: (editor: Editor) => {
            editorRef.value = editor;
            editor.on('init', (e) => initSetup(e));
          },
        };
      });

      tinymce.PluginManager.add('insertImage', function (editor) {
        // 注册一个工具栏按钮名称
        editor.ui.registry.addButton('insertImage', {
          icon: 'image',
          tooltip: '添加图片',
          onAction: function () {
            openInsertImageModal(true);
          },
        });
      });
      const [registerInsertImageModal, { openModal: openInsertImageModal }] = useModal();

      watch(
        () => attrs.disabled,
        () => {
          const editor = unref(editorRef);
          if (!editor) {
            return;
          }
          editor.setMode(attrs.disabled ? 'readonly' : 'design');
        },
      );

      onMountedOrActivated(() => {
        if (!initOptions.value.inline) {
          tinymceId.value = buildShortUUID('tiny-vue');
        }
        nextTick(() => {
          setTimeout(() => {
            initEditor();
          }, 30);
        });
      });

      onBeforeUnmount(() => {
        destory();
      });

      onDeactivated(() => {
        destory();
      });

      function destory() {
        if (tinymce !== null) {
          tinymce?.remove?.(unref(initOptions).selector!);
        }
      }

      function initEditor() {
        const el = unref(elRef);
        if (el) {
          el.style.visibility = '';
        }
        tinymce
          .init(unref(initOptions))
          .then((editor) => {
            emit('inited', editor);
          })
          .catch((err) => {
            emit('init-error', err);
          });
      }

      function initSetup(e) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const value = props.modelValue || '';

        editor.setContent(value);
        bindModelHandlers(editor);
        bindHandlers(e, attrs, unref(editorRef));
      }

      function setValue(editor: Recordable, val: string, prevVal?: string) {
        if (
          editor &&
          typeof val === 'string' &&
          val !== prevVal &&
          val !== editor.getContent({ format: attrs.outputFormat })
        ) {
          editor.setContent(val);
        }
      }

      function bindModelHandlers(editor: any) {
        const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
        const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

        watch(
          () => props.modelValue,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          },
        );

        watch(
          () => props.value,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          },
          {
            immediate: true,
          },
        );

        editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
          const content = editor.getContent({ format: attrs.outputFormat });
          emit('update:modelValue', content);
          emit('change', content);
        });
      }

      function handleUploading(name: string) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        editor.execCommand('mceInsertContent', false, getUploadingName(name));
        const content = editor?.getContent() ?? '';
        setValue(editor, content);
      }

      function handleDone(name: string, html: string) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const content = editor?.getContent() ?? '';
        const val = content?.replace(getUploadingName(name), html) ?? '';
        setValue(editor, val);
      }

      function getUploadingName(name: string) {
        return `[uploading:${name}]`;
      }

      return {
        prefixCls,
        containerWidth,
        initOptions,
        tinymceContent,
        elRef,
        tinymceId,
        handleUploading,
        handleDone,
        editorRef,
        registerInsertImageModal,
      };
    },
  });
</script>

<style lang="less" scoped></style>

<style lang="less">
  @prefix-cls: ~'@{namespace}-tinymce-container';

  .@{prefix-cls} {
    position: relative;
    line-height: normal;

    textarea {
      z-index: -1;
      visibility: hidden;
    }
  }
</style>
