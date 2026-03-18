export default function(selector = '.sample') {
  return function(deck) {
    // search for sample elements and initialize them
    const sampleEls = deck.parent.querySelectorAll(selector);
    sampleEls.forEach(el => {
      const sampleName = el.dataset.sample;
      if (sampleName) {
        import(`../samples/${sampleName}/main.js`).then(sampleModule => {
          if (sampleModule && sampleModule.initialize) {
            // creates a canvas element inside the sample element and passes it to the sample module's initialize function
            const canvas = document.createElement('canvas');
            canvas.width = el.clientWidth;
            canvas.height = el.clientHeight;
            el.appendChild(canvas);
            sampleModule.initialize(canvas);
            
          } else {
            console.warn(`Sample module for ${sampleName} does not export an initialize function.`);
          }
        }).catch(err => {
          console.error(`Failed to load sample module for ${sampleName}:`, err);
        });
      } else {
        console.warn('Sample element does not have a data-sample attribute:', el);
      }
    });
  }
}