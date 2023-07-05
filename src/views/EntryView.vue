
<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, ref } from 'vue';
import Chart from '../components/ChartComponent.vue';
import FirstStep from '../components/steps/firstStep.vue';
import { useAppStore } from '../store/app';
const store = useAppStore()

interface Model {
  KP: number;
  X: number;
  Y: number;
  Z: number;
}
const model = ref({
  first_step: {
    project_name: "",
    project_desc: "",
    client: "",
    contractor: ""
  },
  second_step: {
    maxX: null,
    minX: null,
    maxY: null,
    minY: null,
    maxZ: null,
    minZ: null,
  }

})
const chart_data = ref<Model[]>([])


const rules = computed(() => {
  return {
    maxX: { required },
    minX: { required },
    maxY: { required },
    minY: { required },
    maxZ: { required },
    minZ: { required }
  }
})

const v$ = useVuelidate(rules, model.value.second_step);



async function handlSave() {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  alert("ok")
}

function handleFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>) => {
    const contents = e.target?.result as string;
    const data = parseCSV(contents);
    chart_data.value = data;
    model.value.second_step = findMinMax(data);
    console.log(findMinMax(data)); // Process the data as needed
  };

  reader.onerror = (error: ProgressEvent<FileReader>) => {
    console.error(error);
  };

  if (file) {
    reader.readAsText(file);
  }
}

function parseCSV(contents: string): Model[] {
  const lines = contents.split('\n');
  const headers = lines[0].split(',');

  const data: Model[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length === headers.length) {
      const entry: Model = {
        KP: parseInt(values[0], 10),
        X: parseFloat(values[1]),
        Y: parseFloat(values[2]),
        Z: parseFloat(values[3]),
      };
      data.push(entry);
    }
  }
  return data;
}

function findMinMax(data: Model[]): { maxX: number, minX: number, maxY: number, minY: number, maxZ: number, minZ: number } {
  let maxX = -Infinity;
  let minX = Infinity;
  let maxY = -Infinity;
  let minY = Infinity;
  let maxZ = -Infinity;
  let minZ = Infinity;

  for (const entry of data) {
    maxX = Math.max(maxX, entry.X);
    minX = Math.min(minX, entry.X);
    maxY = Math.max(maxY, entry.Y);
    minY = Math.min(minY, entry.Y);
    maxZ = Math.max(maxZ, entry.Z);
    minZ = Math.min(minZ, entry.Z);
  }

  return { maxX, minX, maxY, minY, maxZ, minZ };
}


function isNumber(evt: any) {
  evt = evt ? evt : window.event;
  const charCode = evt.which ? evt.which : evt.keyCode;
  if (
    (charCode > 31 && (charCode < 48 || charCode > 57)) && // not a number
    charCode !== 46 && // not a decimal point
    charCode !== 45 // not a minus symbol
  ) {
    evt.preventDefault();
  } else {
    return true;
  }
}

</script>
<template>
  <form class="p-4" @submit.prevent="handlSave">
    <div class="row">
      <div class="col-lg-12">
        <v-timeline direction="horizontal">
          <v-timeline-item v-for="i in   2  " :dot-color="[i == store.current_step ? 'info' : '']" />
        </v-timeline>
      </div>
    </div>
    <FirstStep v-if="store.current_step == 1" :first_step="model.first_step" v-model="model.first_step" />
    <div v-else>
      <div class="card m-4">
        <div class="card-header bg-primary">
          <div class="card-title">
            <h5>Step-2 </h5>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-3">
              <div class="form-group">
                <label for="">Project Name</label>
                <input type="text" v-model="model.first_step.project_name" disabled placeholder="Project Name"
                  class="form-control">
              </div>
            </div>

            <div class="col-lg-3">
              <div class="form-group">
                <label for="">Project Description</label>
                <input type="text" v-model="model.first_step.project_desc" disabled placeholder="Project Description"
                  class="form-control">
              </div>
            </div>

            <div class="col-lg-3">
              <div class="form-group">
                <label for="">Client</label>
                <input type="text" v-model="model.first_step.client" disabled placeholder="Client" class="form-control">
              </div>
            </div>

            <div class="col-lg-3">
              <div class="form-group">
                <label for="">Contractor</label>
                <input type="text" placeholder="Contractor" v-model="model.first_step.contractor" disabled
                  class="form-control">
              </div>
            </div>


          </div>
        </div>
      </div>

      <div class="row m-3">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group">
                    <input type="file" accept=".csv,.xlsx" @change="handleFileChange" class="form-control" />
                  </div>

                </div>
              </div>

              <div class="row mt-5">
                <div class="col-lg-6">
                  <div class="form-group" :class="[v$.maxX.$error ? 'error' : '']">
                    <label for="">max_X</label>
                    <input v-model="model.second_step.maxX" placeholder="max_X" @keypress="isNumber"
                      :class="[v$.maxX.$error ? 'is-invalid' : '']" type="text" class="form-control">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group" :class="[v$.minX.$error ? 'error' : '']">
                    <label for="">min_X</label>
                    <input type="text" @keypress="isNumber" placeholder="min_X"
                      :class="[v$.minX.$error ? 'is-invalid' : '']" v-model="model.second_step.minX" class="form-control">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group" :class="[v$.maxY.$error ? 'error' : '']">
                    <label for="">max_Y</label>
                    <input type="text" @keypress="isNumber" placeholder="max_Y"
                      :class="[v$.maxY.$error ? 'is-invalid' : '']" v-model="model.second_step.maxY" class="form-control">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group" :class="[v$.minY.$error ? 'error' : '']">
                    <label for="">min_Y</label>
                    <input type="text" @keypress="isNumber" placeholder="min_Y"
                      :class="[v$.minY.$error ? 'is-invalid' : '']" v-model="model.second_step.minY" class="form-control">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group" :class="[v$.maxZ.$error ? 'error' : '']">
                    <label for="">max_Z</label>
                    <input type="text" @keypress="isNumber" placeholder="max_Z"
                      :class="[v$.maxZ.$error ? 'is-invalid' : '']" v-model="model.second_step.maxZ" class="form-control">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group" :class="[v$.minZ.$error ? 'error' : '']">
                    <label for="">min_Z</label>
                    <input type="text" @keypress="isNumber" placeholder="min_Z"
                      :class="[v$.minZ.$error ? 'is-invalid' : '']" v-model="model.second_step.minZ" class="form-control">
                  </div>
                </div>

              </div>
              <div class="card-footer mt-5">
                <button type="button" class="btn btn-sm btn-info  text-white me-2"
                  @click="store.current_step--">previous</button>
                <button type="submit" class="btn btn-sm btn-success float-right text-white">save</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <Chart v-if="chart_data.length" :data="chart_data" />
            </div>
          </div>
        </div>
      </div>

    </div>

  </form>
</template>