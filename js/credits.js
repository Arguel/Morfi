const templateItems = document.getElementById('template-items').content;
const mainRow = document.querySelector('row');

const fragment = document.createDocumentFragment();

document.addEventListener('DOMContentLoaded', () => {
  loadData();
});

const loadData = async () => {
  await $.ajax({
    url: '../../js/credits-data.json',
    method: 'GET',
  })
    .done(data => {
      console.log(data);
      renderItems(data)
    })
    .fail(() => {
      alert('asd');
    });
}

const renderItems = (arrayItems) => {

  arrayItems.forEach(item => {
    const itemImg = templateItems.querySelector('img');
    itemImg.setAttribute('src', item.imageSrc);
    itemImg.setAttribute('alt', item.imageAlt);
    const itemAnchor = templateItems.querySelectorAll('a');
    itemAnchor[0].setAttribute('href', item.author);
    itemAnchor[1].setAttribute('href', item.hostedOn);


    const clone = templateItems.cloneNode(true);
    fragment.appendChild(clone);
  });

  mainRow.appendChild(fragment);
}
