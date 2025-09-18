console.log('Why are you checking the console?! ヾ(•ω•`)o');

const ids = ["texture-details", "view-distance", "reflections", "shadows", "fog", "culling", "tonemap", "others", "raytracing", "extra", "rebar"];

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

$(document)
   .ready(function() {
      $('.text-change')
         .on('click', function() {
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
            };
         });

      $('.zoom-img')
         .on('click', function() {
            $(this)
               .toggleClass('zoomed');
         });
   });