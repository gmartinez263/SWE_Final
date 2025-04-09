
const dropdownHeader = document.querySelector('.dropdown-property-header');
const dropdownBody = document.querySelector('.dropdown-property-body');
const doneButton = document.querySelector('.dropdown-property-done');

dropdownHeader.addEventListener('click', () => {
  dropdownBody.style.display = dropdownBody.style.display === 'flex' ? 'none' : 'flex';
});

doneButton.addEventListener('click', () => {
  dropdownBody.style.display = 'none';

  // Optional: Update header with selected values
  const checked = dropdownBody.querySelectorAll('input[type="checkbox"]:checked');
  const values = Array.from(checked).map(cb => cb.parentElement.textContent.trim());
  dropdownHeader.textContent = values.length > 0 ? values.join(', ') : 'Property Type';
});

// Optional: Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!document.querySelector('.custom-property-dropdown').contains(e.target)) {
    dropdownBody.style.display = 'none';
  }
});

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
if (!dropdown.contains(e.target)) {
  bedbathBody.style.display = 'none';
}
});