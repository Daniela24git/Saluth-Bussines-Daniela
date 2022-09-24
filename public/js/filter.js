window.addEventListener("load", function () {
  const columns = document.querySelectorAll("#columnTable");
  const select = document.querySelector("#selectColumns");
  columns.forEach((column) => {
    const option = document.createElement("option");
    option.value = column.textContent;
    option.textContent = column.textContent;
    select.appendChild(option);
  });

  filterData();
});
/*  const valueFilter = document.querySelector("#valueFilter")
 /* let listaValue = lista_value();
 mostrarValue();
 inputFiltro,addEventListener('keyup',mostrarValue);
 
 function mostrarValue(){

    let tbody = document.querySelector('#valueFilter');
    let filtro = inputFiltro.value;

    valueFilter.innerHTML = '';

    for(let i = 0; i < listaValue.length; i++){
        if(listaValue[i]['value'].toLowerCase().includes(filtro.toLowerCase())){
            let fila = tbody.insertRow();
            let celdaColumn = fila.insertCell();
            let celdaValue = fila.insertCell();

            celdaColumn.innerHTML = listaValue[i]['column'];
            celdaValue.innerHTML =listaValue[i]['value'];

        }
    }
 }; */

/* value.addEventListener("keyup", function(e){
    const values = e.target.value.toLowerCase();
    console.log(values)
    const body = document.querySelector(".tbody")
    const rows = body.querySelector(".row")
    rows.forEach(function (row){
        const titles = row.querySelectorAll(".data")
        var isShow = false
        titles.forEach(function (title){
            const titleText = title.innerText.toLowerCase()
            if(titleText.indexOf(values) != -1){
                isShow = true
            }
        })
        if(isShow){
            row.style.display = ""
        }else{
            row.style.display = "none"
        }
    })
})   */
function mostrarFiltro() {
  document.getElementById("filtro").style.display = "block";
}
function ocultarFiltro() {
  document.getElementById("filtro").style.display = "none";
}

/* const columnsValues = document.querySelectorAll("#columnTable");
const filters = document.querySelectorAll("#filter");
filters.forEach(function(filter){
    const columnFilter = filter.querySelector("#columnFilter");
    const dataFilter = filter.querySelector("#valueFilter");
    const index = Array.from(columnsValues).findIndex((column)=>column.textContent==columnFilter.textContent)
    const body = document.querySelector(".tbody")
    const rows = body.querySelectorAll(".row")
    rows.forEach(function(row){
        const datas = row.querySelectorAll("#data")
        let isShow = false 
        console.log(index)
        datas[index].textContent.toLowerCase().indexOf(dataFilter.value) != -1 ? (isShow=true):(isShow=false)
        if(isShow){
            row.style.display = ""
        }else{
            row.style.display = "none"
        }
    })
}) */

function filterData() {
  const body = document.querySelector(".tbody");
  const rows = body.querySelectorAll(".row");
  const filters = document.querySelectorAll("#filter");

  rows.forEach(function (row) {
    var verify = 0;

    filters.forEach(function (filter) {
      const columnFilter = filter.querySelector("#columnFilter");
      const dataFilter = filter.querySelector("#valueFilter");

      const data = row.querySelector(`[data-column="${columnFilter.textContent.trim()}"]`);

      if (data.textContent.trim().toLowerCase() == dataFilter.textContent.trim().toLowerCase()) {
        verify += 1;
      }

      if (verify == filters.length) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
}
