<template>
  <q-page class="q-pa-md">

    <HomePage
      :groups="groups"
      :contributions="contributions"
      @open-dialog="showGroupDialog = true"
    />

    <q-dialog v-model="showGroupDialog" backdrop-filter="blur(4px)">
      <NewGroupDialog @save="addGroup" />
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import HomePage from './home/pages/HomePage.vue';
import NewGroupDialog from '../components/NewGroupDialog.vue';

const showGroupDialog = ref(false);

const groups = ref([
  { id: 1, name: 'Grupo Bairro Central', members: 10, amount: 500 },
  { id: 2, name: 'Xitique Família', members: 6, amount: 1000 },
]);

const contributions = ref([
  { id: 1, group: 'Grupo Bairro Central', amount: 500, date: '10 Jan 2026' },
]);

const addGroup = (data) => {
  groups.value.push({ id: Date.now(), ...data });
  showGroupDialog.value = false;
};
</script>
