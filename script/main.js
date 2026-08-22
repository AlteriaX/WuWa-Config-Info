console.log('Why are you checking the console?! ヾ(•ω•`)o');

const ids = ["texture-details", "view-distance", "reflections", "shadows", "ambient-occlusion", "fog", "culling", "tonemap", "auto-exposure", "postpro", "others", "raytracing", "extra", "rebar"];

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
   if (type === "b") return Math.round(-1 + 2 * (i / 100));

   if (type === "s") {
      const result = i <= 50 ? 50 * Math.pow(i / 50, 0.29595113329349826) : 50 + 50 * Math.pow((i - 50) / 50, 1.7040488667065017);
      return Math.round(result);
   }
   
   if (type === "c") {
      const result = i <= 50 ? 50 * Math.pow(i / 50, 0.3705536649270038) : 50 + 50 * Math.pow((i - 50) / 50, 1.6294463350729962);
      return Math.round(result);
   }
}

function decrypt(data) {
   const out = new Uint8Array(data.length);
   for (let i = 0; i < data.length; i++)
      out[i] = (data[i] & 0x0f) % 2 === 1 ? data[i] ^ 0xa5 : data[i] ^ 0xef;
   return out;
}

$(document).ready(function() {
   const menuButton = document.createElement('button');
   menuButton.className = 'mobile-menu-btn';
   menuButton.type = 'button';
   menuButton.setAttribute('aria-label', 'Toggle navigation');
   menuButton.setAttribute('aria-expanded', 'false');
   menuButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
   const closeMenu = () => {
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
   };
   menuButton.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      menuButton.setAttribute('aria-expanded', open);
   });
   document.addEventListener('click', (event) => {
      if (innerWidth <= 768 && !event.target.closest('.top-bar, .mobile-menu-btn')) closeMenu();
   });
   document.body.append(menuButton);

   // Decrypt page (decrypt/index.html)
   if (document.getElementById("out") && document.getElementById("file")) {
      let buf = null;

      const statusElement = document.getElementById("status");
      const documentOut = document.getElementById("out");
      const fileIcon = document.getElementById("file-icon");
      const dlBtn = document.getElementById("dl");
      const resetBtn = document.getElementById("reset");
      const file = document.getElementById("file");

      function handleFile(f) {
         if (!f) return;
         f.arrayBuffer().then((ab) => {
            buf = decrypt(new Uint8Array(ab));
            documentOut.value = new TextDecoder().decode(buf);
            documentOut.style.cursor = "text";
            fileIcon.style.display = "none";
            dlBtn.disabled = false;
            resetBtn.disabled = false;
            statusElement.textContent = "";
         });
      }

      function resetDecrypt() {
         buf = null;
         documentOut.value = "";
         documentOut.style.cursor = "pointer";
         fileIcon.style.display = "flex";
         dlBtn.disabled = true;
         resetBtn.disabled = true;
         file.value = "";
         statusElement.textContent = "";
      }

      function download() {
         const a = document.createElement("a");
         a.href = URL.createObjectURL(new Blob([buf], { type: "application/octet-stream" }));
         a.download = "Client_unencrypted.log";
         a.click();
         URL.revokeObjectURL(a.href);
      }

      $(file).on("change", (e) => handleFile(e.target.files[0]));
      $(documentOut).on("dragover", (e) => { e.preventDefault(); documentOut.classList.add("drop-over"); });
      $(documentOut).on("dragleave", () => documentOut.classList.remove("drop-over"));
      $(documentOut).on("drop", (e) => { e.preventDefault(); documentOut.classList.remove("drop-over"); handleFile(e.originalEvent.dataTransfer.files[0]); });
      $(documentOut).on("click", () => { if (!documentOut.value) file.click(); });
      $(dlBtn).on("click", download);
      $(resetBtn).on("click", resetDecrypt);
   }

   if (colorPage) {
      // Slider value and color update
      ['brightness', 'saturation', 'contrast'].forEach(id => {
         const sliderID = document.getElementById(id);
         const sliderValue = document.getElementById(id + 'Value');
         sliderID.addEventListener('input', () => {
            if (id === 'brightness') {
				const val = parseInt(sliderID.value);
				sliderID.value = val < 25 ? 0 : val < 75 ? 50 : 100;
            }
            sliderValue.textContent = sliderID.value;
            updateSlider(sliderID);
		});
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