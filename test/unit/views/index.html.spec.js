import fs from 'fs';
import ejs from 'ejs';

describe('Views',  () => {
    describe('index html template', () => {
        it('has the injected value in the rendered html', () => {
            const indexHtmlTemplate = fs.readFileSync(__dirname + '/../../../app/server/views/index.html.ejs', 'utf-8');
            const testValue = 'testValue';

            expect(indexHtmlTemplate.indexOf(testValue)).eq(-1);

            const html = ejs.render(indexHtmlTemplate, { data: testValue });

            expect(html.indexOf(testValue)).not.eq(-1);
        });
    });
});
