// 3. stringManipulator.js - String manipulation utilities
class StringManipulator {
    reverseString(str) {
        return str.split('').reverse().join('');
    }

    countVowels(str) {
        const vowels = str.match(/[aeiou]/gi);
        return vowels ? vowels.length : 0;
    }

    countConsonants(str) {
        const consonants = str.match(/[bcdfghjklmnpqrstvwxyz]/gi);
        return consonants ? consonants.length : 0;
    }

    isPalindrome(str) {
        const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleaned === cleaned.split('').reverse().join('');
    }

    capitalizeWords(str) {
        return str.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    removeDuplicates(str) {
        return [...new Set(str.split(''))].join('');
    }

    countWords(str) {
        return str.trim().split(/\s+/).length;
    }

    truncate(str, maxLength) {
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength) + '...';
    }
}

module.exports = StringManipulator;
