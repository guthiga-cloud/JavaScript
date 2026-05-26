// 8. dataAnalyzer.js - Data analysis and statistics
class DataAnalyzer {
    // Basic statistics
    mean(numbers) {
        if (numbers.length === 0) return 0;
        return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    }

    median(numbers) {
        if (numbers.length === 0) return 0;
        const sorted = [...numbers].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
    }

    mode(numbers) {
        const frequency = new Map();
        numbers.forEach(num => {
            frequency.set(num, (frequency.get(num) || 0) + 1);
        });
        
        let maxFreq = 0;
        let modes = [];
        
        for (const [num, freq] of frequency) {
            if (freq > maxFreq) {
                maxFreq = freq;
                modes = [num];
            } else if (freq === maxFreq) {
                modes.push(num);
            }
        }
        
        return modes;
    }

    standardDeviation(numbers) {
        const mean = this.mean(numbers);
        const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
        const variance = this.mean(squaredDiffs);
        return Math.sqrt(variance);
    }

    // Data quality checks
    findOutliers(numbers, threshold = 1.5) {
        const sorted = [...numbers].sort((a, b) => a - b);
        const q1 = this.median(sorted.slice(0, Math.floor(sorted.length / 2)));
        const q3 = this.median(sorted.slice(Math.ceil(sorted.length / 2)));
        const iqr = q3 - q1;
        const lowerBound = q1 - threshold * iqr;
        const upperBound = q3 + threshold * iqr;
        
        return numbers.filter(num => num < lowerBound || num > upperBound);
    }

    // Correlation between two datasets
    correlation(x, y) {
        if (x.length !== y.length || x.length === 0) {
            throw new Error("Arrays must have same length and not be empty");
        }
        
        const meanX = this.mean(x);
        const meanY = this.mean(y);
        
        const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
        const denominator = Math.sqrt(
            x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0) *
            y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0)
        );
        
        return denominator === 0 ? 0 : numerator / denominator;
    }

    // Frequency distribution
    frequencyDistribution(data, bins = 10) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        const binWidth = range / bins;
        
        const distribution = [];
        for (let i = 0; i < bins; i++) {
            const lower = min + i * binWidth;
            const upper = lower + binWidth;
            const count = data.filter(value => value >= lower && value < upper).length;
            distribution.push({
                range: `${lower.toFixed(2)} - ${upper.toFixed(2)}`,
                count,
                percentage: (count / data.length * 100).toFixed(2)
            });
        }
        
        return distribution;
    }

    // Moving average for time series data
    movingAverage(data, windowSize) {
        if (windowSize > data.length) {
            throw new Error("Window size cannot be larger than data length");
        }
        
        const averages = [];
        for (let i = 0; i <= data.length - windowSize; i++) {
            const window = data.slice(i, i + windowSize);
            averages.push(this.mean(window));
        }
        return averages;
    }

    // Generate summary statistics
    summaryStatistics(numbers) {
        return {
            count: numbers.length,
            sum: numbers.reduce((a, b) => a + b, 0),
            mean: this.mean(numbers),
            median: this.median(numbers),
            mode: this.mode(numbers),
            stdDev: this.standardDeviation(numbers),
            min: Math.min(...numbers),
            max: Math.max(...numbers),
            range: Math.max(...numbers) - Math.min(...numbers),
            outliers: this.findOutliers(numbers)
        };
    }
}

module.exports = DataAnalyzer;
