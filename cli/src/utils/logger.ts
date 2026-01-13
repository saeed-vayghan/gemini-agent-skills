export class Logger {
    static info(message: string) {
        console.log(`ℹ️  ${message}`);
    }

    static success(message: string) {
        console.log(`✅ ${message}`);
    }

    static warn(message: string) {
        console.log(`⚠️  ${message}`);
    }

    static error(message: string) {
        console.error(`❌ ${message}`);
    }

    static section(title: string) {
        console.log(`\n==================================================`);
        console.log(`${title}`);
        console.log(`==================================================`);
    }

    static step(step: string) {
        console.log(`\n🔹 ${step}`);
    }

    static detail(message: string) {
        console.log(`   ${message}`);
    }

    static subDetail(message: string) {
        console.log(`      ${message}`);
    }

    static header(title: string) {
        console.log(`\n\n`);
        console.log(`**************************************************`);
        console.log(`* ${title.padEnd(46)} *`);
        console.log(`**************************************************\n`);
    }
}
