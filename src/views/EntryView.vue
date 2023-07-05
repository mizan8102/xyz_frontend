
<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, ref } from 'vue';
import Chart from '../components/ChartComponent.vue';
const current = ref<number>(1);
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
    project_name: { required },
    project_desc: { required },
    client: { required },
    contractor: { required },
  };
});

const second_step_rules = computed(() => {
  return {
    maxX: { required },
    minX: { required },
    maxY: { required },
    minY: { required },
    maxZ: { required },
    minZ: { required }
  }
})
const v$ = useVuelidate(rules, model.value.first_step);
const v$_second_step = useVuelidate(second_step_rules,model.value.second_step);
async function nextStep() {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  current.value++;
}


async function handlSave() {
  const result = await v$_second_step.value.$validate();
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
</script>
<template>
  <form class="p-4">
    <div class="row">
      <div class="col-lg-12">
        <v-timeline direction="horizontal">
          <v-timeline-item v-for="i in   2  " :dot-color="[i == current ? 'info' : '']" />
        </v-timeline>
      </div>
    </div>
    <div v-if="current == 1" class="card m-4">
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
              <input type="text" v-model="model.first_step.project_name"
                :class="[v$.project_name.$error ? 'is-invalid' : '']" placeholder="Project Name" class="form-control">
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group" :class="[v$.project_desc.$error ? 'error' : '']">
              <label for="">Project Description</label>
              <input type="text" v-model="model.first_step.project_desc"
                :class="[v$.project_desc.$error ? 'is-invalid' : '']" placeholder="Project Description"
                class="form-control">
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group" :class="[v$.client.$error ? 'error' : '']">
              <label for="">Client</label>
              <input type="text" v-model="model.first_step.client" :class="[v$.client.$error ? 'is-invalid' : '']"
                placeholder="Client" class="form-control">
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group" :class="[v$.contractor.$error ? 'error' : '']">
              <label for="">Contractor</label>
              <input type="text" placeholder="Contractor" :class="[v$.contractor.$error ? 'is-invalid' : '']"
                v-model="model.first_step.contractor" class="form-control">
            </div>
          </div>


        </div>
        <button class="btn btn-sm btn-info float-right mt-3" @click="nextStep()">next</button>


      </div>
    </div>

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
                  <div class="form-group">
                    <label for="">max_X</label>
                    <input v-model="model.second_step.maxX" type="text" class="form-control">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="">min_X</label>
                    <input type="text" v-model="model.second_step.minX" class="form-control">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="">max_Y</label>
                    <input type="text" v-model="model.second_step.maxY" class="form-control">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="">min_Y</label>
                    <input type="text" v-model="model.second_step.minY" class="form-control">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="">max_Z</label>
                    <input type="text" v-model="model.second_step.maxZ" class="form-control">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="">min_Z</label>
                    <input type="text" v-model="model.second_step.minZ" class="form-control">
                  </div>
                </div>

              </div>
              <div class="card-footer mt-5">
                <button type="button" class="btn btn-sm btn-info  text-white me-2" @click="current--">previous</button>
                <button type="button" class="btn btn-sm btn-success float-right text-white">save</button>
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