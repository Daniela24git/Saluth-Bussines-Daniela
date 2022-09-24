const eye_slash = document.getElementById("eye_slash");
const eye = document.getElementById("eye");
const password = document.getElementById("password");

password.addEventListener("keyup", (e) => {
  if (e.target.value.length > 0) {
    eye_slash.classList.remove("hidden");
    eye.classList.add("hidden");
  } else {
    eye_slash.classList.add("hidden");
    eye.classList.add("hidden");
  }
});

eye_slash.addEventListener("click", function () {
  eye.classList.toggle("hidden");
  eye_slash.classList.toggle("hidden");
  password.setAttribute("type", "text");
});

eye.addEventListener("click", function () {
  eye.classList.toggle("hidden");
  eye_slash.classList.toggle("hidden");
  password.setAttribute("type", "password");
});


function link(url) {
  const hexagon = document.getElementById("hexagon_svg");
  hexagon.classList.add("active");
  setTimeout(function () {
    window.location.href = url;
  }, 600);
}
