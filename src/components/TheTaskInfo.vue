<template>
  <div class="app__collapse_content">
    <section>
      <h3>
        Лабораторная работа №{{ task.number }} &mdash;
        <b>{{ task.name }}</b>
      </h3>
      <p class="mt-3">
        <wysiwyg-editor :editable="false" :content="task.description" />
      </p>
      <b>Награда</b>
      <p>{{ form(task.score, wordForms) }}</p>
      <template v-if="task.files && task.files.length">
        <b>Прикрепленные файлы</b>
        <b-card-group columns class="mt-2">
          <b-card
            v-for="(file, j) in task.files"
            @click="downloadFile(file.link)"
            :key="j"
            class="app__file"
          >
            <span
              :class="getClass(file.name)"
              class="app__file_icon mr-3"
            ></span>
            <span>{{ file.name }}</span>
          </b-card>
        </b-card-group>
      </template>
    </section>
    <footer
      v-if="isTeacher"
      class="d-flex justify-content-end align-items-center"
    >
      <b-form-checkbox
        class="mr-3"
        switch
        v-model="task.visible"
        @change="toggleTaskVisibility(task.id, $event)"
      >
        <span :class="{ 'text-danger': !task.visible }">
          {{ task.visible ? 'Открыта' : 'Закрыта' }}
        </span>
      </b-form-checkbox>
      <b-btn variant="outline-dark" @click="openModal(i)">
        Редактировать
      </b-btn>
    </footer>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
