Tabletop.init({
  key: 'https://docs.google.com/spreadsheets/d/16Xg6ER-VOzsByTNf4R3UTRo-zA_K3HaYmzI7V5TqOGM/edit?usp=sharing',
  callback: loadData,
  simpleSheet: true
});
let rawData = [];
function loadData(data) {
  rawData = data;
  populateFilters();
  updateMap();
}
function populateFilters() {
  const regions = [...new Set(rawData.map(r=>r.Region))];
  const modalities = [...new Set(rawData.map(r=>r.Modality))];
  const manufacturers = [...new Set(rawData.map(r=>r.Manufacturer))];
  fillSelect('regionFilter', regions);
  fillSelect('modalityFilter', modalities);
  fillSelect('manufacturerFilter', manufacturers);
  document.querySelectorAll('select').forEach(el => el.onchange = updateMap);
}
function fillSelect(id, items) {
  const sel = document.getElementById(id);
  items.forEach(i => {
    const o = document.createElement('option');
    o.value = i; o.textContent = i;
    sel.appendChild(o);
  });
}
function updateMap() {
  const reg = document.getElementById('regionFilter').value;
  const mod = document.getElementById('modalityFilter').value;
  const man = document.getElementById('manufacturerFilter').value;
  Object.keys(simplemaps_usmap_mapdata.state_specific || {})
    .forEach(s => simplemaps_usmap_mapdata.state_specific[s].color = null);
  rawData.forEach(r => {
    if ((reg===''||r.Region===reg) &&
        (mod===''||r.Modality===mod) &&
        (man===''||r.Manufacturer===man)) {
      simplemaps_usmap_mapdata.state_specific[r.State].color = "#1f497d";
      simplemaps_usmap_mapdata.state_specific[r.State].description =
        `${r.Alias}<br>${r.Modality}, ${r.Manufacturer}`;
    }
  });
  simplemaps_usmap.load();
}
