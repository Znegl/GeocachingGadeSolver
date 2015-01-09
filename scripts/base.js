(function() {
	var cipherInput = document.getElementById('cipher-input');
	var cipherOutput = document.getElementById('cipher-output');
	var alphabetOutputHeaders = document.getElementById('alphabet-output-headers');
	var alphabetOutputCells = document.getElementById('alphabet-output-cells');

	var allCiphers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'æ', 'ø', 'å'];

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
			var cipherIndex = index % ciphers.length;
			var cipher = ciphers[cipherIndex];
			headers += '<th>' + letter + '</th>';
			cells += '<td>' + cipher + '</td>';
		});

		alphabetOutputHeaders.innerHTML = '<tr>' + headers + '</tr>';
		alphabetOutputCells.innerHTML = '<tr>' + cells + '</tr>';
	}

	cipherInput.addEventListener('input', function() {
		// Check for validation errors if supported by the browser
		if (cipherInput.checkValidity && !cipherInput.checkValidity()) {
			updateCipherReference(null);
			updateAlphabeticReference(null);
			return;
		}

		// Remove old validation error style
		cipherOutput.classList.remove('validation-error');

		// Extract ciphers
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

		// Print ciphers to the user
		updateCipherReference(ciphers);
		updateAlphabeticReference(ciphers);
	});

	updateCipherReference(allCiphers);
	updateAlphabeticReference(allCiphers);

})();