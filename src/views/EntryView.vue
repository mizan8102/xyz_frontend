
<script lang="ts" setup>
import {  ref } from 'vue';
import Chart from '../components/ChartComponent.vue';
import FirstStep from '../components/steps/firstStep.vue';
import { useAppStore } from '../store/app';
import axiosClient from '../axios'
import { isNumber, findMinMax,parseCSV,Model } from './Services';
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useRouter } from 'vue-router';
const store = useAppStore()
const isChartLoading = ref<boolean>(false)
const router = useRouter();

store.current_step=1;
const model = ref({
  first_step: {
    project_name: "",
    project_desc: "",
    client: "",
    contractor: ""
  },
  second_step: {
    max_X: null,
    min_X: null,
    max_Y: null,
    min_Y: null,
    max_Z: null,
    min_Z: null,
  }

})
const chart_data = ref<Model[]>([])
const  form = ref<boolean>(false);
const  loading= ref<boolean>(false);
const required =ref((v:any)=> {
  return !!v || 'Field is required'
})
async function handlSave() {
  if (!form.value) return
  loading.value = true
  axiosClient.post('/xyz_api',model.value)
  .then((result) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: "success",
      title: "XYZ Engine",
      text: "Added Successfull",
    });
    router.push('/')
       loading.value = false
  }).catch((err) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: "success",
      title: "Error",
      text: err.response.data.message,
    });
    loading.value = false
  });
}

function handleFileChange(event: Event): void {
  isChartLoading.value=true;
  const file = (event.target as HTMLInputElement).files?.[0];
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const contents = e.target?.result as string;
    const data = parseCSV(contents);
    chart_data.value = data;
    model.value.second_step = findMinMax(data);
    isChartLoading.value=false;
    console.log(findMinMax(data));
  };
  reader.onerror = (error: ProgressEvent<FileReader>) => {
    console.error(error);
  };
  if (file) {
    reader.readAsText(file);
  }

}
</script>
<template>
  <v-form class="p-4"
        v-model="form"
        @submit.prevent="handlSave"
      >
    <div class="row">
      <div class="col-lg-12">
        <v-timeline direction="horizontal">
          <v-timeline-item v-for="i in   2  " :dot-color="[i == store.current_step ? 'info' : '']" />
        </v-timeline>
      </div>
    </div>
    <FirstStep v-if="store.current_step == 1" :first_step="model.first_step" v-model="model.first_step" />
    <div v-else>
      <div class="card m-2">
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
      <div class="row me-1 ms-1 mt-3">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group">
                    <input type="file"  accept=".csv" @change="handleFileChange" class="form-control"  />
                  </div>
                </div>
              </div>
              <div class="row mt-5">
                <div class="col-lg-6">
                  <div class="form-group" >
                    <v-text-field
                      v-model="model.second_step.max_X"
                      :readonly="loading"
                      :rules="[required]"
                      density="compact"
                      placeholder="Max_X"
                      variant="outlined"
                      small
                      @keypress="isNumber"
                      label="Max_X"
                    ></v-text-field>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <v-text-field
                      v-model="model.second_step.min_X"
                      :readonly="loading"
                      :rules="[required]"
                      density="compact"
                      placeholder="Min_X"
                      variant="outlined"
                      small
                      type="text"
                      @keypress="isNumber"
                      label="Min_X"
                    ></v-text-field>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group" >
                    <v-text-field
                      v-model="model.second_step.max_Y"
                      :readonly="loading"
                      :rules="[required]"
                      density="compact"
                      placeholder="Max_Y"
                      variant="outlined"
                      small
                      @keypress="isNumber"
                      label="Max_Y"
                    ></v-text-field></div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group" >
                    <v-text-field
                      v-model="model.second_step.min_Y"
                      :readonly="loading"
                      :rules="[required]"
                      density="compact"
                      placeholder="Min_Y"
                      variant="outlined"
                      small
                      @keypress="isNumber"
                      label="Min_Y"
                    ></v-text-field></div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group" >
                    <v-text-field
                      v-model="model.second_step.max_Z"
                      :readonly="loading"
                      :rules="[required]"
                      density="compact"
                      placeholder="Max_Z"
                      variant="outlined"
                      small
                      @keypress="isNumber"
                      label="Max_Z"
                    ></v-text-field>
                    </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <v-text-field
                      v-model="model.second_step.min_Z"
                      :readonly="loading"
                      :rules="[required]"
                      density="compact"
                      placeholder="Min_Z"
                      variant="outlined"
                      @keypress="isNumber"
                      label="Min_Z"
                    ></v-text-field></div>
                </div>

              </div>
              <div class="card-footer mt-5">
                <v-row align="center" justify="center">
                  <v-col cols="auto">
                    <v-btn
                      :disabled="!form"
                      :loading="loading"
                      block
                      color="success"
                      size="small"
                      type="submit"
                      variant="elevated"
                    >
                      Save
                    </v-btn>
                    </v-col>
                  </v-row>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div v-if="isChartLoading" class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
          <div class="card" v-if="chart_data.length">
            <div class="card-body">
              <Chart  :data="chart_data" />
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-sm prev-btn btn-info mw-50 text-white mt-5 me-2" style="max-width:70px"
                  @click="store.current_step--">previous</button>
      </div>
    </div>
  </v-form>
</template>
