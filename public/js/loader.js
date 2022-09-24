window.addEventListener("load", function () {
  setTimeout(function () {
    document.getElementById("loader").classList.toggle("loader_close");
    document.getElementById("loader").classList.toggle("opacity-0");
  }, 400);
  setTimeout(function () {
    document.getElementById("loader").classList.toggle("hidden");
  }, 1000);
});
