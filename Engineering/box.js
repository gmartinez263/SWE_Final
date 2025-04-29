const bedbathHeader = document.querySelector('.bedbath-header');
const bedbathBody = document.querySelector('.bedbath-body');
const bedbathDone = document.querySelector('.custom-bedbath-dropdown .dropdown-done');

bedbathHeader.addEventListener('click', () => {
  bedbathBody.style.display = bedbathBody.style.display === 'block' ? 'none' : 'block';
});

bedbathDone.addEventListener('click', () => {
  bedbathBody.style.display = 'none';

  const selectedBeds = document.querySelector('input[name="beds"]:checked');
  const selectedBaths = document.querySelector('input[name="baths"]:checked');
  let label = '';

  if (selectedBeds && selectedBaths) {
    label = `${selectedBeds.value} Beds / ${selectedBaths.value} Baths`;
  } else {
    label = 'Beds / Baths';
  }

  bedbathHeader.textContent = label;
});

document.addEventListener('click', (e) => {
  const dropdown = document.querySelector('.custom-bedbath-dropdown');
  if (!dropdown.contains(e.target) && e.target !== bedbathHeader) {
    bedbathBody.style.display = 'none';
  }
});