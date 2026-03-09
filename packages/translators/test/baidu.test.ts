import fs from "fs";
import path from "path";
import BaiduTranslator from "../src/translators/baidu";

describe("baidu translator api", () => {
    const TRANSLATOR = new BaiduTranslator();

    it("parses detailed word metadata from dictionary result", () => {
        const fixture = fs.readFileSync(
            path.resolve(__dirname, "./fixtures/baiduTransResult.json"),
            "utf-8"
        );
        const result = TRANSLATOR.parseResult(JSON.parse(fixture));

        expect(result.originalText).toEqual("hello");
        expect(result.mainMeaning.length).toBeGreaterThan(0);
        expect(result.tPronunciation?.length).toBeGreaterThan(0);
        expect(result.sPronunciation?.length).toBeGreaterThan(0);
        expect(result.detailedMeanings?.length).toBeGreaterThan(0);
        expect(result.definitions?.length).toBeGreaterThan(0);
        expect(result.examples?.length).toBeGreaterThan(0);
    });

    it("uses dictionary endpoint only for single-word queries", () => {
        expect(TRANSLATOR.shouldUseDictionaryEndpoint("hello")).toBe(true);
        expect(TRANSLATOR.shouldUseDictionaryEndpoint("ice-cream")).toBe(true);
        expect(TRANSLATOR.shouldUseDictionaryEndpoint("hello world")).toBe(false);
        expect(TRANSLATOR.shouldUseDictionaryEndpoint("hello\nworld")).toBe(false);
    });
});
