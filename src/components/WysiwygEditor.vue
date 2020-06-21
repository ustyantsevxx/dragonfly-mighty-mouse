<template>
  <div class="editor">
    <editor-menu-bar
      v-if="editable"
      :editor="editor"
      v-slot="{ commands, isActive }"
    >
      <div class="app__menubar">
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

    <editor-content class="app__content border rounded" :editor="editor" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
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

@Component({
  components: { EditorContent, EditorMenuBar }
})
export default class extends Vue {
  @Prop({ default: true }) editable!: boolean
  @Prop() content!: any

  beforeDestroy() {
    this.editor.destroy()
  }

  json = ''
  editor = new Editor({
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
    ]
  })
  buttons = [
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

  onUpdate({ getJSON }: any) {
    this.$emit('input', getJSON())
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

.app__content {
  padding: 1rem 1rem 0;
}

.app__menubar {
  button {
    color: #212529;
    background-color: #e0e0e0;
    border-color: #e0e0e0;
  }
}
</style>
