// 4. arrayUtils.js - Array utility functions
class ArrayUtils {
    findMax(arr) {
        return Math.max(...arr);
    }

    findMin(arr) {
        return Math.min(...arr);
    }

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    chunkArray(arr, size) {
        const chunked = [];
        for (let i = 0; i < arr.length; i += size) {
            chunked.push(arr.slice(i, i + size));
        }
        return chunked;
    }

    flattenArray(arr) {
        return arr.reduce((flat, item) => 
            flat.concat(Array.isArray(item) ? this.flattenArray(item) : item), []);
    }

    intersection(arr1, arr2) {
        return arr1.filter(item => arr2.includes(item));
    }

    union(arr1, arr2) {
        return [...new Set([...arr1, ...arr2])];
    }

    difference(arr1, arr2) {
        return arr1.filter(item => !arr2.includes(item));
    }

    shuffleArray(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    groupBy(arr, key) {
        return arr.reduce((grouped, item) => {
            const groupKey = item[key];
            if (!grouped[groupKey]) grouped[groupKey] = [];
            grouped[groupKey].push(item);
            return grouped;
        }, {});
    }
}

module.exports = ArrayUtils;
