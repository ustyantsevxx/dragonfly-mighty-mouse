<template>
  <b-container class="mt-3">
    <b-row>
      <b-col>
        <b-list-group>
          <b-list-group-item>
            <b class="mr-1">1.</b>
            <span>Наследование</span>
            <b-badge variant="primary" pill>1 балл</b-badge>
          </b-list-group-item>
          <b-list-group-item>
            <b class="mr-1">2.</b>
            <span>Полиморфизм</span>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.list-group-item {
  display: flex;
  align-items: center;
  transition: background-color 0.17s;
  cursor: pointer;

  .badge {
    margin-left: auto;
  }
  &:hover {
    background-color: #f8f9fa;
  }
}
</style>