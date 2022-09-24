const search = document.querySelector("#search");

search.addEventListener("keyup", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const body = document.querySelector(".tbody");
  const rows = body.querySelectorAll(".row");
  rows.forEach(function (row) {
    const titles = row.querySelectorAll(".data");
    let isShow = false;
    titles.forEach(function (title) {
      const titleText = title.innerText.toLowerCase();
      if (titleText.indexOf(searchTerm) != -1) {
        isShow = true;
      }

    });
    if (isShow) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });

  if (searchTerm == "") {
      filterData();

  }
});