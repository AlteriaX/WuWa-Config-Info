console.log('Why are you checking the console?! ヾ(•ω•`)o');

function toggleVisibility(id) {
   document.getElementById(id)
      .classList.toggle("hide");
};

function expandAll() {
   for (let i = 1; i <= 13; i++) {
      document.getElementById(`info-${i}`).classList.remove("hide");

      const $button = $(`.info${i}-btn`);
      const $span = $button.find('span');
      const text = $button.data('text');

      $span.html('▼ ' + text);
      $button.data('state', 'expanded');
   }
}

function collapseAll() {
   for (let i = 1; i <= 13; i++) {
      document.getElementById(`info-${i}`).classList.add("hide");

      const $button = $(`.info${i}-btn`);
      const $span = $button.find('span');
      const text = $button.data('text');

      $span.html('► ' + text);
      $button.data('state', 'collapsed');
   }
}

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