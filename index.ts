import puppeteer from 'puppeteer';
import fs from 'fs';

const PAGE_ONE = 'https://www.fotball.no/fotballdata/lag/kamper/?fiksId=15042';

const main = async () => {
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();
	await page.goto(PAGE_ONE);

  // const title = await page.title();
const tableData = await page.evaluate(() => {
  const rows = document.querySelectorAll('table tbody tr');
  return Array.from(rows, row => {
    const cells = row.querySelectorAll('td');
    return Array.from(cells, cell => cell.innerText);
  });
});

const tableObj: any = {};

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

  fs.writeFileSync('scraped_data.json', JSON.stringify(tableObj));

  await browser.close();
}

main();
