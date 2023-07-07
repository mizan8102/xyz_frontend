<script setup lang="ts">
import axiosClient from "../axios";
import { ref } from 'vue';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
const datas = ref<[]>([]);
const loading = ref<boolean>(false)
init();
function init(){
  loading.value=true;
  axiosClient.get('/xyz_api')
  .then((result) => {
    datas.value=result.data.data;
    loading.value = false;
    console.log(datas.value)
  }).catch((err) => {
    loading.value = false;
    console.log(err)
  });
}

function generatePDF() {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "in",
    page: "A4",
  });

  const data = datas.value;

  const headerTitle = "XYZ Engine";
  const tableMargin = 0.5; // Set the desired margin value in inches

  const columns = Object.keys(data[0]);
  const rows = data.map(obj => Object.values(obj));

  doc.setFontSize(18);
  doc.text(headerTitle, tableMargin, tableMargin);

  doc.autoTable({
    head: [columns],
    body: rows,
    startY: tableMargin + 0.5, // Start the table below the header title
    margin: { top: tableMargin + 1 } // Set the top margin for the table
  });

  doc.save('xyz-'+new Date()+'.pdf');
}

</script>

<template>
  <div class="  m-5">
  <div class="row">
    <div class="col-lg-12">
      <div class="dflex justify">
        <button @click="generatePDF" class="btn btn-sm btn-info pdf-button">Pdf</button>
      </div>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-lg-12">
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead class="" >
            <tr>
              <th>SL.NO</th>
              <th>Project Name</th>
              <th>Project Description</th>
              <th>Client</th>
              <th>Contractor </th>
              <th>max_X</th>
              <th>min_X</th>
              <th>max_Y</th>
              <th>min_Y</th>
              <th>max_Z</th>
              <th>min_Z</th>
            </tr>
          </thead>
          <tbody v-if="loading || !datas.length">
            <tr>
              <td colspan="11">
                <div class="d-flex justify-content-center align-items-center">
                  <div v-if="loading" class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p v-else class="text-center py-8 text-sm text-gray-700">There have no data found</p>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(data,i) in datas" :key="i">
              <td>{{ i=i+1 }}</td>
              <td>{{ data.project_name }}</td>
              <td>{{ data.project_desc }}</td>
              <td>{{ data.client }}</td>
              <td>{{ data.contractor }}</td>
              <td>{{ data.max_X }}</td>
              <td>{{ data.min_X }}</td>
              <td>{{ data.max_Y }}</td>
              <td>{{ data.min_Y }}</td>
              <td>{{ data.max_Z }}</td>
              <td>{{ data.min_Z }}</td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>
<style scoped>
th{
  background-color: rgb(11, 1, 151);
  color: #ffffff;
  font-size: 11px;
}
td{
  font-size: 10px;
}
.pdf-button{
  color: white;
}
</style>
