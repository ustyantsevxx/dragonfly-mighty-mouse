<template>
  <b-container class="mt-3">
    <b-row>
      <b-col>
        <b-list-group role="tablist">
          <b-list-group-item v-b-toggle.acc-1>
            <header>
              <b class="mr-1">1.</b>
              <span>Наследование</span>
              <span
                class="description"
              >Создать классовую стурктуру. Протестировать на примере из прикрепленного архива.</span>
              <b-badge variant="primary" pill>1 балл</b-badge>
            </header>
            <b-collapse visible class="mt-2 p-0" id="acc-1" accordion="acc" role="tabpanel">
              <b-card footer-class="d-flex justify-content-end">
                <b-card-text></b-card-text>

                <template #footer>
                  <b-btn size="sm" variant="secondary" class="mr-2">Скрыть</b-btn>
                  <b-btn size="sm" variant="danger">Удалить</b-btn>
                </template>
              </b-card>
            </b-collapse>
          </b-list-group-item>
          <b-list-group-item class="add-item-cont text-muted">
            <header class="add-item">
              <b-icon icon="plus" />
              <div>Добавить лабораторную работу</div>
            </header>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.list-group-item {
  transition: background-color 0.17s;
  cursor: pointer;

  header {
    display: flex;
    align-items: center;
    .description {
      margin-left: 1em;
      color: #6c757d9d !important;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .badge {
      margin-left: auto;
    }
  }

  &:hover {
    background-color: #f8f9fa;
  }
}

.add-item-cont {
  padding: 0.1em;
  background-color: #f8f9fa;
  .add-item {
    justify-content: center;
    align-items: center;
    .bi {
      height: 2em;
      width: 2em;
    }
  }
}
</style>