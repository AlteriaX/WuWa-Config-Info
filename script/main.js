console.log('Why are you checking the console?! ヾ(•ω•`)o');

const ids = ["texture-details", "view-distance", "reflections", "shadows", "ambient-occlusion", "fog", "tonemap", "auto-exposure", "others", "raytracing", "extra", "rebar"];

let colorPage = false;

function changeBool(page) {
   if (page === "ColorSettings") colorPage = true;
}

function toggleVisibility(id) {
   document.getElementById(id)
      .classList.toggle("hide");
};

function expandAll() {
   ids.forEach(id => {
      document.getElementById(id).classList.remove("hide");

      const $button = $(`.${id}-btn`);
      const $span = $button.find("span");
      const text = $button.data("text");

      $span.html('▼ ' + text);
      $button.data('state', 'expanded');
   });
};

function collapseAll() {
   ids.forEach(id => {
      document.getElementById(id).classList.add("hide");

      const $button = $(`.${id}-btn`);
      const $span = $button.find('span');
      const text = $button.data('text');

      $span.html('► ' + text);
      $button.data('state', 'collapsed');
   });
};

function updateSlider(slider) {
   var value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
   slider.style.background = `linear-gradient(to right, #CDC57C 0%, #CDC57C ${value}%, #2B2A33 ${value}%, #2B2A33 100%)`;
}

function calcValue(type, i) {
   if (type === "b") {
      const result = -1 + 2 * (i / 100);
      return parseFloat(result.toFixed(14));
   };
   if (type === "s") return i <= 50 ? 50 * Math.pow(i / 50, 0.29595113329349826) : 50 + 50 * Math.pow((i - 50) / 50, 1.7040488667065017);
   if (type === "c") return i <= 50 ? 50 * Math.pow(i / 50, 0.3705536649270038) : 50 + 50 * Math.pow((i - 50) / 50, 1.6294463350729962);
}

$(document).ready(function() {
   if (colorPage) {
      // Slider value and color update
      ['brightness', 'saturation', 'contrast'].forEach(id => {
         const sliderID = document.getElementById(id);
         const sliderValue = document.getElementById(id + 'Value');
         sliderID.addEventListener('input', () => sliderValue.textContent = sliderID.value);
         sliderID.oninput = function() {
            updateSlider(sliderID);
         };
      });

      // Generate button
      $('#generate').on('click', function() {
         const bright = calcValue("b", document.getElementById("brightness").value);
         const sat = calcValue("s", document.getElementById("saturation").value);
         const con = calcValue("c", document.getElementById("contrast").value);
         $('#value-output').html(`Brightness: ${bright}&nbsp;&nbsp; | &nbsp;&nbsp;Saturation: ${sat}&nbsp;&nbsp; | &nbsp;&nbsp;Contrast: ${con}`);
         $('#sql-output').html(`INSERT OR REPLACE INTO LocalStorage (key, value) VALUES ('Brightness', '${bright}'), ('SaturationNew', '${sat}'), ('ContrastNew', '${con}');`);
      });

      // Reset button
      $('#reset').on('click', function() {
         ['brightness', 'saturation', 'contrast'].forEach(id => {
            const valueDisplayId = id + 'Value';
            document.getElementById(id).value = 50;
            document.getElementById(valueDisplayId).textContent = 50;
            updateSlider(document.getElementById(id));
         });

         $('#value-output').html(`Brightness: 0&nbsp;&nbsp; | &nbsp;&nbsp;Saturation: 50&nbsp;&nbsp; | &nbsp;&nbsp;Contrast: 50`);
         $('#sql-output').html(`INSERT OR REPLACE INTO LocalStorage (key, value) VALUES ('Brightness', '0'), ('SaturationNew', '50'), ('ContrastNew', '50');`);
      });
   }

   if (!colorPage) {
      // Existing text-change toggle
      $('.text-change').on('click', function() {
         const $button = $(this);
         const $span = $button.find('span');
         const text = $button.data('text');
         const currentState = $button.data('state');

         if (currentState === 'expanded') {
            $span.html('► ' + text);
            $button.data('state', 'collapsed');
         } else {
            $span.html('▼ ' + text);
            $button.data('state', 'expanded');
         }
      });
   }

   // Image zoom toggle
   $('.zoom-img').on('click', function() {
      $(this).toggleClass('zoomed');
   });
});