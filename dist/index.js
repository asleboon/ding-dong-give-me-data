"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const PAGE_ONE = 'https://www.fotball.no/fotballdata/lag/kamper/?fiksId=15042';
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: "new" });
    const page = yield browser.newPage();
    yield page.goto(PAGE_ONE);
    // const title = await page.title();
    const tableData = yield page.evaluate(() => {
        const rows = document.querySelectorAll('table tbody tr');
        return Array.from(rows, row => {
            const cells = row.querySelectorAll('td');
            return Array.from(cells, cell => cell.innerText);
        });
    });
    const tableObj = {};
    tableData.forEach(row => {
        const [date, day, time, , home, result, away, arena, tournament, matchNo, gameType] = row;
        const matchObj = {
            date,
            day,
            time,
            home,
            result,
            away,
            arena,
            tournament,
            matchNo,
            gameType
        };
        tableObj[matchNo] = matchObj;
    });
    fs_1.default.writeFileSync('scraped_data.json', JSON.stringify(tableObj));
    yield browser.close();
});
main();
