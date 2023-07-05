<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, ref } from 'vue';
import { useAppStore } from '@/store/app';
const props = defineProps({
  first_step: {
    type: Object
  }
});
const emit = defineEmits(['update:modelValue']);
const store = useAppStore();

const data = ref({
  project_name: props.first_step?.project_name ?? '',
  project_desc: props.first_step?.project_desc ?? '',
  client: props.first_step?.client ?? '',
  contractor: props.first_step?.contractor ?? ''
});
const rules = computed(() => {
  return {
    project_name: { required },
    project_desc: { required },
    client: { required },
    contractor: { required },
  };
});
const v$ = useVuelidate(rules, data);
async function nextStep() {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  emit('update:modelValue', data.value);
  store.current_step++;
}
</script>

<template>
  <div class="card m-4">
    <div class="card-header bg-primary">
      <div class="card-title">
        <h5>Step-1 </h5>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-lg-3">
          <div class="form-group" :class="[v$.project_name.$error ? 'error' : '']">
            <label for="">Project Name</label>
            <input type="text" v-model="data.project_name" :class="[v$.project_name.$error ? 'is-invalid' : '']"
              placeholder="Project Name" class="form-control">
          </div>
        </div>

        <div class="col-lg-3">
          <div class="form-group" :class="[v$.project_desc.$error ? 'error' : '']">
            <label for="">Project Description</label>
            <input type="text" v-model="data.project_desc" :class="[v$.project_desc.$error ? 'is-invalid' : '']"
              placeholder="Project Description" class="form-control">
          </div>
        </div>

        <div class="col-lg-3">
          <div class="form-group" :class="[v$.client.$error ? 'error' : '']">
            <label for="">Client</label>
            <input type="text" v-model="data.client" :class="[v$.client.$error ? 'is-invalid' : '']" placeholder="Client"
              class="form-control">
          </div>
        </div>

        <div class="col-lg-3">
          <div class="form-group" :class="[v$.contractor.$error ? 'error' : '']">
            <label for="">Contractor</label>
            <input type="text" placeholder="Contractor" :class="[v$.contractor.$error ? 'is-invalid' : '']"
              v-model="data.contractor" class="form-control">
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-sm btn-info float-right mt-3" @click="nextStep()">next</button>
  </div>
</div></template>