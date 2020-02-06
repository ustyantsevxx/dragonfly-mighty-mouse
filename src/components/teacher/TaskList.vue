<template>
  <div>
    <b-row class="mb-2">
      <b-col>
        <b-btn v-b-modal.add-lab-modal variant="primary" size="sm">Добавить лабораторную</b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-list-group role="tablist">
          <b-list-group-item class="p-0" v-for="(task, i) in labListSorted" :key="i">
            <header v-b-toggle="`acc-${i}`" role="tab">
              <b class="mr-1">{{task.number}}.</b>
              <span class="text-nowrap">{{task.name}}</span>
              <span class="description">{{task.description}}</span>
              <b-badge variant="primary" pill>{{num2str(task.score, wordForms)}}</b-badge>
              <b-icon icon="arrow-bar-up" class="hider" />
            </header>
            <b-collapse :id="`acc-${i}`" accordion="acc" role="tabpanel">
              <div class="collapse-content">
                <div>
                  <b>Лабораторная работа №{{task.number}}</b>
                  <p>{{task.name}}</p>
                  <b>Описание</b>
                  <p>{{task.description}}</p>
                  <b>Награда</b>
                  <p>{{num2str(task.score, wordForms)}}</p>
                </div>
                <footer class="d-flex justify-content-end">
                  <b-btn
                    v-b-toggle="`acc-${i}`"
                    @click="deleteLab(task)"
                    size="sm"
                    variant="danger"
                  >Удалить</b-btn>
                </footer>
              </div>
            </b-collapse>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <!-- invisible -->
    <b-modal
      @hide="resetModal('add-lab-modal')"
      centered
      title="Добавить лабораторную работу"
      id="add-lab-modal"
      ref="add-lab-modal"
    >
      <b-form-group label="Номер работы" label-for="number-field">
        <b-form-input
          type="number"
          min="1"
          id="number-field"
          :state="inputState($v.number)"
          v-model.number.trim="$v.number.$model"
        />
      </b-form-group>

      <b-form-group label="Название" label-for="name-field">
        <b-form-input id="name-field" :state="inputState($v.name)" v-model.trim="$v.name.$model" />
      </b-form-group>

      <b-form-group label="Описание" label-for="descr-field">
        <b-form-textarea
          id="descr-field"
          :state="inputState($v.description)"
          v-model.trim="$v.description.$model"
        />
      </b-form-group>

      <b-form-group label="Количество баллов" label-for="score-field">
        <b-form-input
          type="number"
          id="score-field"
          :state="inputState($v.score)"
          v-model.number.trim="$v.score.$model"
        />
      </b-form-group>
      <template #modal-footer>
        <b-btn @click="resetModal('add-lab-modal')" variant="light">Отмена</b-btn>
        <btn-loader
          @click="addLabRab"
          load="btn-addLab"
          or="Добавить"
          variant="success"
          :disabled="$v.$invalid"
        />
      </template>
    </b-modal>
    <!-- /invisible !-->
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import BtnLoader from '@/components/BtnLoader'
import baseMixin from '@/mixins/base'

export default {
  components: { BtnLoader },
  mixins: [
    baseMixin({
      number: null,
      name: null,
      description: null,
      score: null,
      wordForms: ['балл', 'балла', 'баллов']
    })
  ],
  computed: {
    labListSorted() {
      return [...this.$parent.subj.tasklist].sort((a, b) => a.number - b.number)
    }
  },
  methods: {
    num2str(n, forms) {
      n = Math.abs(n) % 100
      let n1 = n % 10
      let index
      if (n > 10 && n < 20) index = 2
      else if (n1 > 1 && n1 < 5) index = 1
      else if (n1 == 1) index = 0
      else index = 2
      return n + ' ' + forms[index]
    },
    async addLabRab() {
      await this.$store.dispatch('addLabRab', {
        name: this.name,
        score: this.score,
        number: this.number,
        description: this.description,
        subjectId: this.$parent.subj.id
      })
      this.resetModal('add-lab-modal')
    },
    deleteLab(lab) {
      this.$store.dispatch('deleteLabRab', {
        labToDelete: lab,
        subjectId: this.$parent.subj.id
      })
    }
  },
  validations: {
    number: { required },
    name: { required },
    description: { required },
    score: { required }
  }
}
</script>

<style lang="scss">
.list-group-item {
  transition: background-color 0.17s;

  header {
    display: flex;
    background-color: #f8f9fa;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;

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

    .hider {
      display: block;
      font-size: 1.4rem;
      color: #6c757d9d;
      position: absolute;
      z-index: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    b,
    span,
    .description,
    .badge {
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover {
      background-color: #f8f9fa;
    }
  }

  .collapsed {
    background-color: inherit;

    b,
    span,
    .description,
    .badge {
      opacity: 1;
    }

    .hider {
      display: none;
    }
  }

  .collapse-content {
    padding: 12px 20px;
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