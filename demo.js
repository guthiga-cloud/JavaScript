// demo.js - Test all 8 JavaScript modules
const Calculator = require('./calculator');
const TodoList = require('./todoList');
const StringManipulator = require('./stringManipulator');
const ArrayUtils = require('./arrayUtils');
const WeatherAPI = require('./weatherAPI');
const UserAuth = require('./userAuth');
const FileProcessor = require('./fileProcessor');
const DataAnalyzer = require('./dataAnalyzer');

async function runDemo() {
    console.log('\n🔷 JavaScript Utilities Demo 🔷\n');
    console.log('=' .repeat(50));

    // Test 1: Calculator
    console.log('\n📱 1. CALCULATOR');
    const calc = new Calculator();
    console.log(`   5 + 3 = ${calc.add(5, 3)}`);
    console.log(`   10 - 4 = ${calc.subtract(10, 4)}`);
    console.log(`   7 × 6 = ${calc.multiply(7, 6)}`);
    console.log(`   15 ÷ 3 = ${calc.divide(15, 3)}`);
    console.log(`   2⁴ = ${calc.power(2, 4)}`);
    console.log(`   √16 = ${calc.squareRoot(16)}`);

    // Test 2: Todo List
    console.log('\n📝 2. TODO LIST');
    const todo = new TodoList();
    todo.addTask('Learn JavaScript', 'Study ES6 features');
    todo.addTask('Build projects', 'Create 8 utility programs');
    todo.addTask('Push to GitHub', 'Upload to repository');
    todo.completeTask(1);
    console.log(`   Total tasks: ${todo.getAllTasks().length}`);
    console.log(`   Completed: ${todo.getCompletedTasks().length}`);
    console.log(`   Pending: ${todo.getPendingTasks().length}`);

    // Test 3: String Manipulator
    console.log('\n🔤 3. STRING MANIPULATOR');
    const strMan = new StringManipulator();
    const testString = "Hello World";
    console.log(`   Original: "${testString}"`);
    console.log(`   Reversed: "${strMan.reverseString(testString)}"`);
    console.log(`   Vowels: ${strMan.countVowels(testString)}`);
    console.log(`   Capitalized: "${strMan.capitalizeWords(testString)}"`);
    console.log(`   "racecar" is palindrome: ${strMan.isPalindrome("racecar")}`);

    // Test 4: Array Utils
    console.log('\n📊 4. ARRAY UTILS');
    const arrUtil = new ArrayUtils();
    const numbers = [5, 2, 8, 2, 9, 1, 5, 8];
    console.log(`   Array: [${numbers}]`);
    console.log(`   Max: ${arrUtil.findMax(numbers)}`);
    console.log(`   Min: ${arrUtil.findMin(numbers)}`);
    console.log(`   Unique: [${arrUtil.removeDuplicates(numbers)}]`);
    console.log(`   Sorted chunks (size 3): ${JSON.stringify(arrUtil.chunkArray([...numbers].sort(), 3))}`);

    // Test 5: Weather API
    console.log('\n🌤️  5. WEATHER API');
    const weather = new WeatherAPI();
    const weatherData = weather.getMockWeather("New York");
    console.log(weatherData);

    // Test 6: User Authentication
    console.log('\n🔐 6. USER AUTHENTICATION');
    const auth = new UserAuth();
    try {
        const registered = auth.registerUser("john@example.com", "secure123", "john_doe");
        console.log(`   ✅ User registered: ${registered.username}`);
        const login = auth.login("john@example.com", "secure123");
        console.log(`   ✅ Login successful!`);
        console.log(`   Session valid: ${auth.validateSession(login.token)}`);
        auth.logout(login.token);
        console.log(`   ✅ Logged out successfully`);
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 7: File Processor
    console.log('\n💾 7. FILE PROCESSOR');
    const fileProc = new FileProcessor('./test_data');
    try {
        await fileProc.writeFile("sample.txt", "Hello from FileProcessor!");
        console.log(`   ✅ File created successfully`);
        const content = await fileProc.readFile("sample.txt");
        console.log(`   File content: "${content.content}"`);
        const files = await fileProc.listFiles();
        console.log(`   Files in directory: ${files.map(f => f.name).join(", ")}`);
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 8: Data Analyzer
    console.log('\n📈 8. DATA ANALYZER');
    const analyzer = new DataAnalyzer();
    const dataset = [12, 15, 14, 10, 13, 15, 11, 12, 13, 100, 14, 12, 11, 13];
    const stats = analyzer.summaryStatistics(dataset);
    console.log(`   Dataset: [${dataset.slice(0, 5).join(", ")}...]`);
    console.log(`   Mean: ${stats.mean.toFixed(2)}`);
    console.log(`   Median: ${stats.median}`);
    console.log(`   Mode: ${stats.mode}`);
    console.log(`   Standard Deviation: ${stats.stdDev.toFixed(2)}`);
    console.log(`   Outliers: ${stats.outliers}`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Demo completed successfully!\n');
}

// Run the demo
runDemo().catch(console.error);
