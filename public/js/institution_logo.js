const inputFile_logo = document.getElementById("inputFile_logo");
const error_logo = document.getElementById("error_logo_text");
const container_error_logo = document.getElementById("error_logo");
var files;

inputFile_logo.addEventListener("change", function (e) {
  files = e.target.files;
  showFiles(files);
});

var data_img_logo = document.getElementById("data_img_logo");
function showFiles(files) {
  if (files.length > 1) {
    error_logo.textContent = "Solo se admite una imagen";
    container_error_logo.classList.add("err");
  } else {
    processFile(files[0]);
  }
}

function processFile(file) {
  const docType = file.type;
  const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
  if (validExtensions.includes(docType)) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var img = document.getElementById("img_logo");
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    container_error_logo.classList.remove("err");
  } else {
    error_logo.textContent = "Formato incorrecto";
    container_error_logo.classList.add("err");
  }
}