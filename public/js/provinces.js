var provincias = [];
var cantones = [];
var parroquias = [];

$(document).ready(function () {
  $.getJSON(
    "https://gist.githubusercontent.com/JhonTanicuchi/075e4cd9be6eb1a8689d3051d61e050c/raw/97ecf8057e64d930f36dea3f6b95dbb15b5f75d4/provinces.json",
    function (json) {
      $.each(json, function (key, value) {
        provincias.push(value.provincia);
      });
      provincias.pop();
      provincias.sort();
        
      //add the options to the provinces select
        $.each(provincias, function (key, value) {
        $("#province").append(
          $("<option>", {
            value: value,
            text: value[0].toUpperCase() + value.toLowerCase().slice(1),
            selected: $("#provinceValue").val() == value ? true : false,
          })
        );
      });

      if ($("#province").val() != "") {
        $("#canton").empty();
        $("#canton").append(
          $("<option>", {
            value: "",
            text: "Seleccione un cantón",
          })
        );
        $.each(json, function (key, value) {
          if (value.provincia == $("#province").val()) {
            $.each(value.cantones, function (key, value) {
              cantones.push(value.canton);
              cantones.sort();
            });
          }
        });
        $.each(cantones, function (key, value) {
          $("#canton").append(
            $("<option>", {
              value: value,
              text: value[0].toUpperCase() + value.toLowerCase().slice(1),
              selected: $("#cantonValue").val() == value ? true : false,
            })
          );
        }),
          (cantones = []);
      }

      if ($("#canton").val() != "") {
        $("#parish").empty();
        $("#parish").append(
          $("<option>", {
            value: "",
            text: "Seleccione una parroquia",
          })
        );
        $.each(json, function (key, value) {
          if (value.provincia == $("#province").val()) {
            $.each(value.cantones, function (key, value) {
              if (value.canton == $("#canton").val()) {
                $.each(value.parroquias, function (key, value) {
                  parroquias.push(value);
                  parroquias.sort();
                });
              }
            });
          }
        });
        $.each(parroquias, function (key, value) {
          $("#parish").append(
            $("<option>", {
              value: value,
              text: value[0].toUpperCase() + value.toLowerCase().slice(1),
              selected: $("#parishValue").val() == value ? true : false,
            })
          );
        }),
          (parroquias = []);
      }

      //change
      $("#province").change(function () {
        $("#canton").empty();
        $("#canton").append(
          $("<option>", {
            value: "",
            text: "Seleccione un cantón",
          })
        );
        $.each(json, function (key, value) {
          if (value.provincia == $("#province").val()) {
            $.each(value.cantones, function (key, value) {
              cantones.push(value.canton);
              cantones.sort();
            });
          }
        });
        $.each(cantones, function (key, value) {
          $("#canton").append(
            $("<option>", {
              value: value,
              text: value[0].toUpperCase() + value.toLowerCase().slice(1),
              selected: $("#cantonValue").val() == value ? true : false,
            })
          );
        }),
          (cantones = []);
      }),
        $("#canton").change(function () {
          $("#parish").empty();
          $("#parish").append(
            $("<option>", {
              value: "",
              text: "Seleccione una parroquia",
            })
          );
          $.each(json, function (key, value) {
            if (value.provincia == $("#province").val()) {
              $.each(value.cantones, function (key, value) {
                if (value.canton == $("#canton").val()) {
                  $.each(value.parroquias, function (key, value) {
                    parroquias.push(value);
                    parroquias.sort();
                  });
                }
              });
            }
          });
          $.each(parroquias, function (key, value) {
            $("#parish").append(
              $("<option>", {
                value: value,
                text: value[0].toUpperCase() + value.toLowerCase().slice(1),
                selected: $("#parishValue").val() == value ? true : false,
              })
            );
          }),
            (parroquias = []);
        });
    }
  );
});
