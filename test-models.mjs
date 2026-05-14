const apiKey = 'AIzaSyA3zLKnmcot7_MsdudRgPWRuTJr_cnxyGE';
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      const names = data.models.map(m => m.name).filter(name => name.includes('gemini'));
      console.log(names.join('\n'));
    } else {
      console.error(data);
    }
  });
