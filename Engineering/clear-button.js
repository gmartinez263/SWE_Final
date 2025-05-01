  const clearButton = document.querySelector('.clear-button');
  const searchBar = document.querySelector('.search-bar');
  const budgetInput = document.querySelector('.budget-input-field');
  const sqftInput = document.querySelector('.sqft-input-field');
  const bedRadios = document.querySelectorAll('input[name="beds"]');
  const bathRadios = document.querySelectorAll('input[name="baths"]');

  // clearButton.addEventListener('click', (e) => {
  //   clearSearch();
  // });

  function clearSearch() {
    // Clear text/number inputs
    searchBar.value = '';
    budgetInput.value = '';
    sqftInput.value = '';

    // Reset beds radios (select "Any")
    bedRadios.forEach(radio => {
      if (radio.value === "Any") {
        radio.checked = true;
      }
    });

    // Reset baths radios (select "Any")
    bathRadios.forEach(radio => {
      if (radio.value === "Any") {
        radio.checked = true;
      }
    });

    // Open dropdown to show cleared selection (OPTIONAL)
    document.querySelector('.custom-bedbath-dropdown .bedbath-body').style.display = 'block';

    document.querySelector('.bedbath-header').textContent = 'Beds/Baths';
    
    console.log('Cleared all search and category filters!');
  }

