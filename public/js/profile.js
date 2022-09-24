const identification = document.getElementById("identification");
const names = document.getElementById("names");
const surnames = document.getElementById("surnames");
const birthday = document.getElementById("birthday");
const phone = document.getElementById("phone");
const direction = document.getElementById("direction");
const province = document.getElementById("province");
const canton = document.getElementById("canton");
const parish = document.getElementById("parish");

const button_general = document.getElementById("button_general");

if (identification && names && surnames && birthday && phone && direction) {
  const identification_value = identification.value;
  const names_value = names.value;
  const surnames_value = surnames.value;
  const birthday_value = birthday.value;
  const phone_value = phone.value;
  const direction_value = direction.value;
  const province_value = province.value;
  const canton_value = canton.value;
  const parish_value = parish.value;

  inputFile_avatar.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      button_general.classList.remove("disabled");
      dataAlert();
    } else {
      button_general.classList.add("disabled");
    }
  });

  identification.addEventListener("keyup", (e) => {
    console.log(e.target.value, "==", identification_value);
    if (e.target.value != identification_value) {
      button_general.classList.remove("disabled");
      dataAlert();
    } else {
      button_general.classList.add("disabled");
    }
  });

  names.addEventListener("keyup", (e) => {
    console.log(e.target.value, "==", names_value);
    if (e.target.value != names_value) {
      button_general.classList.remove("disabled");
      dataAlert();
    } else {
      button_general.classList.add("disabled");
    }
  });

  surnames.addEventListener("keyup", (e) => {
    console.log(e.target.value, "==", surnames_value);
    if (e.target.value != surnames_value) {
      button_general.classList.remove("disabled");
      dataAlert();
    } else {
      button_general.classList.add("disabled");
    }
  });

  birthday.addEventListener("change", (e) => {
    console.log(e.target.value, "==", birthday_value);
    if (e.target.value != birthday_value) {
      button_general.classList.remove("disabled");
      dataAlert();
    } else {
      button_general.classList.add("disabled");
    }
  });

  phone.addEventListener("keyup", (e) => {
    console.log(e.target.value, "==", phone_value);
    if (e.target.value != phone_value) {
      button_general.classList.remove("disabled");
      dataAlert();
    } else {
      button_general.classList.add("disabled");
    }
  });

  direction.addEventListener("keyup", (e) => {
    console.log(e.target.value, "==", direction_value);
    if (e.target.value != direction_value) {
      button_general.classList.remove("disabled");
      dataAlert();
    } else {
      button_general.classList.add("disabled");
    }
  });

  province.addEventListener("change", (e) => {
    console.log(e.target.value, "==", province_value);
    if (e.target.value != province_value) {
      button_general.classList.remove("disabled");
      dataAlert();
    } else {
      button_general.classList.add("disabled");
    }
  });

  canton.addEventListener("change", (e) => {
    console.log(e.target.value, "==", canton_value);
    if (e.target.value != canton_value) {
      button_general.classList.remove("disabled");
      dataAlert();
    } else {
      button_general.classList.add("disabled");
    }
  });

  parish.addEventListener("change", (e) => {
    console.log(e.target.value, "==", parish_value);
    if (e.target.value != parish_value) {
      button_general.classList.remove("disabled");
      dataAlert();
    } else {
      button_general.classList.add("disabled");
    }
  });
}

const username = document.getElementById("username");
const newPassword = document.getElementById("newPassword");
const email = document.getElementById("email");
const button_security = document.getElementById("button_security");

if (username && newPassword && email) {
  const username_value = username.value;
  const newPassword_value = newPassword.value;
  const email_value = email.value;

  username.addEventListener("keyup", (e) => {
    console.log(e.target.value, "==", username_value);
    if (e.target.value != username_value) {
      button_security.classList.remove("disabled");
      dataAlert();
    } else {
      button_security.classList.add("disabled");
    }
  });

  newPassword.addEventListener("keyup", (e) => {
    console.log(e.target.value, "==", newPassword_value);
    if (e.target.value != newPassword_value) {
      button_security.classList.remove("disabled");
      dataAlert();
    } else {
      button_security.classList.add("disabled");
    }
  });

  email.addEventListener("keyup", (e) => {
    console.log(e.target.value, "==", email_value);
    if (e.target.value != email_value) {
      button_security.classList.remove("disabled");
      dataAlert();
    } else {
      button_security.classList.add("disabled");
    }
  });
}

function dataAlert() {
  window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.returnValue = "";
  });
}
