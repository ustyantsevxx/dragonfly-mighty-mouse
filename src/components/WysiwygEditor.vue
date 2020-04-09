<template>
  <div class="editor">
    <editor-menu-bar v-if="editable" :editor="editor" v-slot="{ commands, isActive }" class="mb-2">
      <div class="menubar">
        <b-btn-toolbar>
          <b-btn-group size="sm" class="mr-1">
            <b-btn :class="{ 'active': isActive.bold() }" @click="commands.bold">
              <b-icon icon="type-bold" />
            </b-btn>
            <b-btn :class="{ 'active': isActive.italic() }" @click="commands.italic">
              <b-icon icon="type-italic" />
            </b-btn>
            <b-btn :class="{ 'active': isActive.underline() }" @click="commands.underline">
              <b-icon icon="type-underline" />
            </b-btn>
          </b-btn-group>

          <b-btn-group size="sm" class="mx-1">
            <b-btn :class="{ 'active': isActive.code() }" @click="commands.code">
              <b-icon icon="code" />
            </b-btn>
          </b-btn-group>

          <b-btn-group size="sm" class="mx-1">
            <b-btn
              :class="{ 'active': isActive.heading({ level: 3 }) }"
              @click="commands.heading({ level: 3 })"
            >
              <b-icon icon="type-h1" />
            </b-btn>
            <b-btn
              :class="{ 'active': isActive.heading({ level: 4 }) }"
              @click="commands.heading({ level: 4 })"
            >
              <b-icon icon="type-h2" />
            </b-btn>
          </b-btn-group>

          <b-btn-group size="sm" class="mx-1">
            <b-btn :class="{ 'active': isActive.bullet_list() }" @click="commands.bullet_list">
              <b-icon icon="list-ul" />
            </b-btn>
            <b-btn :class="{ 'active': isActive.ordered_list() }" @click="commands.ordered_list">
              <b-icon icon="list-ol" />
            </b-btn>
          </b-btn-group>

          <b-btn-group size="sm" class="mx-1">
            <b-btn @click="commands.undo">
              <b-icon icon="arrow-counterclockwise" />
            </b-btn>

            <b-btn @click="commands.redo">
              <b-icon icon="arrow-clockwise" />
            </b-btn>
          </b-btn-group>
          <b-btn-group size="sm" class="mr-1">
            <b-btn :class="{ 'active': isActive.paragraph() }" @click="commands.paragraph">Сброс</b-btn>
          </b-btn-group>
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
      default: null,
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
          new Heading({ levels: [3, 4] }),
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
      })
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