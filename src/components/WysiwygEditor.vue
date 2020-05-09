<template>
  <div class="editor">
    <editor-menu-bar
      v-if="editable"
      :editor="editor"
      v-slot="{ commands, isActive }"
    >
      <div class="menubar">
        <b-btn-toolbar>
          <b-container fluid class="px-0">
            <b-row no-gutters>
              <b-col
                cols="auto"
                class="mr-2 mb-2"
                v-for="(group, i) in buttons"
                :key="i"
              >
                <b-btn-group size="sm">
                  <b-btn
                    v-for="(btn, j) in group"
                    :key="j"
                    v-b-tooltip.hover
                    :title="btn.title"
                    :class="{
                      active:
                        btn.command.toggle &&
                        isActive[btn.command.name](btn.command.attrs)
                    }"
                    @click="commands[btn.command.name](btn.command.attrs)"
                  >
                    <b-icon :icon="btn.icon" />
                  </b-btn>
                </b-btn-group>
              </b-col>
            </b-row>
          </b-container>
        </b-btn-toolbar>
      </div>
    </editor-menu-bar>

    <editor-content class="content border rounded" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  BulletList,
  CodeBlock,
  Heading,
  ListItem,
  OrderedList,
  Bold,
  Code,
  Italic,
  Underline,
  History
} from 'tiptap-extensions'

export default {
  components: { EditorContent, EditorMenuBar },

  props: {
    editable: {
      type: Boolean,
      default: true
    },
    content: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      json: '',
      editor: new Editor({
        editable: this.editable,
        content: this.content,
        extensions: [
          new BulletList(),
          new CodeBlock(),
          new Heading({ levels: [5, 6] }),
          new ListItem(),
          new OrderedList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Underline(),
          new History()
        ],
        onUpdate: ({ getJSON }) => {
          this.$emit('input', getJSON())
        }
      }),
      buttons: [
        [
          {
            title: 'Абзац',
            command: { name: 'paragraph', toggle: true },
            icon: 'dash'
          }
        ],
        [
          {
            title: 'Полужирный',
            command: { name: 'bold', toggle: true },
            icon: 'type-bold'
          },
          {
            title: 'Курсив',
            command: { name: 'italic', toggle: true },
            icon: 'type-italic'
          },
          {
            title: 'Подчеркнутый',
            command: { name: 'underline', toggle: true },
            icon: 'type-underline'
          }
        ],
        [
          {
            title: 'Код',
            command: { name: 'code', toggle: true },
            icon: 'code-slash'
          }
        ],
        [
          {
            title: 'Заголовок',
            command: {
              name: 'heading',
              attrs: { level: 4 },
              toggle: true
            },
            icon: 'type-h1'
          },
          {
            title: 'Подзаголовок',
            command: {
              name: 'heading',
              attrs: { level: 5 },
              toggle: true
            },
            icon: 'type-h2'
          }
        ],
        [
          {
            title: 'Маркированный список',
            command: { name: 'bullet_list', toggle: true },
            icon: 'list-ul'
          },
          {
            title: 'Нумерованный список',
            command: { name: 'ordered_list', toggle: true },
            icon: 'list-ol'
          }
        ],
        [
          {
            title: 'Отменить',
            command: { name: 'undo' },
            icon: 'arrow-counterclockwise'
          },
          {
            title: 'Повторить',
            command: { name: 'redo' },
            icon: 'arrow-clockwise'
          }
        ]
      ]
    }
  },

  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .ProseMirror {
    outline: none !important;
  }

  .ProseMirror-focused {
    outline: none !important;
  }
}

.content {
  padding: 1rem 1rem 0;
}

.menubar {
  button {
    color: #212529;
    background-color: #e0e0e0;
    border-color: #e0e0e0;
  }
}
</style>
