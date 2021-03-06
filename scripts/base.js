(function() {
	var cipherInput = document.getElementById('cipher-input');
	var cipherOutput = document.getElementById('cipher-output');
	var alphabetOutputHeaders = document.getElementById('alphabet-output-headers');
	var alphabetOutputCells = document.getElementById('alphabet-output-cells');
	var coordinateN1 = document.getElementById('coordinate-n-1');
	var coordinateN2 = document.getElementById('coordinate-n-2');
	var coordinateNOutput = document.getElementById('coordinate-n-output');
	var coordinateE1 = document.getElementById('coordinate-e-1');
	var coordinateE2 = document.getElementById('coordinate-e-2');
	var coordinateEOutput = document.getElementById('coordinate-e-output');

	var allCiphers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'æ', 'ø', 'å'];
	var currentCiphers = allCiphers;

	var localStorageSupported = !!window.localStorage;

	/**
	 * Returns the current array of ciphers.
	 * @returns {Array.<string>}
	 */
	function getCipherArray() {
		var ciphers = cipherInput.value.replace(/(\.|\,|\ )/g, '').split('');

		// Convert to numbers
		ciphers.forEach(function(cipher, index) {
			ciphers[index] = parseInt(cipher, 10);
		});

		ciphers.sort(function(a, b) {
			return a - b;
		});

		// Add missing ciphers
		allCiphers.forEach(function(cipher) {
			if (ciphers.indexOf(cipher) == -1) {
				ciphers.push(cipher);
			}
		});

		currentCiphers = ciphers;

		return ciphers;
	}

	/**
	 * Updates the cipher reference to match the current ciphers.
	 * If null is given an error is displayed.
	 * @param {Array.<number>} ciphers
	 */
	function updateCipherReference(ciphers) {
		if (ciphers === null) {
			cipherOutput.value = 'Error in input';
			cipherOutput.classList.add('validation-error');
			return;
		}

		cipherOutput.value = ciphers.join(' ');

		// Update success validation style
		if (cipherOutput.value.length == 0) {
			cipherOutput.classList.remove('validation-success');
		} else {
			cipherOutput.classList.add('validation-success');
		}
	}

	/**
	 * Updates the alphabetic reference to match the current ciphers
	 * If null is given nothing is updated.
	 * @param {Array.<number>} ciphers
	 */
	function updateAlphabeticReference(ciphers) {
		if (ciphers === null) {
			return;
		}
		var headers = '';
		var cells = '';
		alphabet.forEach(function(letter, index) {
			headers += '<th>' + letter + '</th>';
			cells += '<td>' + getCipherFromLetter(letter, index) + '</td>';
		});

		alphabetOutputHeaders.innerHTML = '<tr>' + headers + '</tr>';
		alphabetOutputCells.innerHTML = '<tr>' + cells + '</tr>';
	}

	/**
	 * Returns the matching cipher for the given letter.
	 * If no cipher is found the given letter is returned.
	 * @param {string} letter
	 * @param {number=} letterIndex
	 * @returns {number|string}
	 */
	function getCipherFromLetter(letter, letterIndex) {
		if (letterIndex === undefined) {
			letterIndex = alphabet.indexOf(letter);
		}
		if (letterIndex == -1) {
			return letter;
		}
		var cipherIndex = letterIndex % currentCiphers.length;
		return currentCiphers[cipherIndex];
	}

	/**
	 * Updates the converted coordinate to match the current cipher positions.
	 */
	function updateCoordinate() {
		// North
		var nString = '';
		var coordinateNArray = coordinateN1.value.split('');
		coordinateNArray.push('°');
		coordinateNArray.push(' ');
		coordinateNArray.push.apply(coordinateNArray, coordinateN2.value.split(''));
		coordinateNArray.forEach(function(letter) {
			nString += getCipherFromLetter(letter);
		});
		coordinateNOutput.textContent = 'N ' + nString;

		// East
		var eString = '';
		var coordinateEArray = coordinateE1.value.split('');
		coordinateEArray.push('°');
		coordinateEArray.push(' ');
		coordinateEArray.push.apply(coordinateEArray, coordinateE2.value.split(''));
		coordinateEArray.forEach(function(letter) {
			eString += getCipherFromLetter(letter);
		});
		coordinateEOutput.textContent = 'E ' + eString;
	}

	document.body.addEventListener('input', function() {
		// Check for validation errors if supported by the browser
		if (cipherInput.checkValidity && !cipherInput.checkValidity()) {
			updateCipherReference(null);
			updateAlphabeticReference(null);
			return;
		}

		// Save to local storage if supported
		if (localStorageSupported) {
			localStorage.setItem('raw-ciphers', cipherInput.value);
			localStorage.setItem('coordinate-n-1', coordinateN1.value);
			localStorage.setItem('coordinate-n-2', coordinateN2.value);
			localStorage.setItem('coordinate-e-1', coordinateE1.value);
			localStorage.setItem('coordinate-e-2', coordinateE2.value);
		}

		// Remove old validation error style
		cipherOutput.classList.remove('validation-error');

		// Extract ciphers
		var ciphers = getCipherArray();

		// Print ciphers to the user
		updateCipherReference(ciphers);
		updateAlphabeticReference(ciphers);
		updateCoordinate();
	});

	// Load saved data from local storage if supported
	if (localStorageSupported) {
		cipherInput.value = localStorage.getItem('raw-ciphers') || '';
		coordinateN1.value = localStorage.getItem('coordinate-n-1') || '55';
		coordinateN2.value = localStorage.getItem('coordinate-n-2') || '';
		coordinateE1.value = localStorage.getItem('coordinate-e-1') || '012';
		coordinateE2.value = localStorage.getItem('coordinate-e-2') || '';

		var ciphers = getCipherArray();
		updateCipherReference(ciphers);
		updateAlphabeticReference(ciphers);
	} else {
		updateCipherReference(allCiphers);
		updateAlphabeticReference(allCiphers);
	}
	updateCoordinate();
})();