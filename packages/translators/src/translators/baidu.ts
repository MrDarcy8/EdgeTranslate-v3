import type { AxiosResponse } from "axios";
import axios from "../axios";
import {
    Definition,
    DetailedMeaning,
    Example,
    PronunciationSpeed,
    TranslationError,
    TranslationResult,
} from "../types";

/**
 * Supported languages.
 */
const LANGUAGES: [string, string][] = [
    ["ach", "ach"],
    ["af", "afr"],
    ["aka", "aka"],
    ["sq", "alb"],
    ["am", "amh"],
    ["ar", "ara"],
    ["arg", "arg"],
    ["hy", "arm"],
    ["asm", "asm"],
    ["ast", "ast"],
    ["auto", "auto"],
    ["aym", "aym"],
    ["az", "aze"],
    ["bal", "bal"],
    ["sun", "sun"],
    ["bak", "bak"],
    ["eu", "baq"],
    ["be", "bel"],
    ["bem", "bem"],
    ["bn", "ben"],
    ["ber", "ber"],
    ["bho", "bho"],
    ["bis", "bis"],
    ["bli", "bli"],
    ["nob", "nob"],
    ["bs", "bos"],
    ["bre", "bre"],
    ["bg", "bul"],
    ["bur", "bur"],
    ["yue", "yue"],
    ["ca", "cat"],
    ["ceb", "ceb"],
    ["chr", "chr"],
    ["ny", "nya"],
    ["chv", "chv"],
    ["wyw", "wyw"],
    ["cor", "cor"],
    ["co", "cos"],
    ["cre", "cre"],
    ["cri", "cri"],
    ["hr", "hrv"],
    ["cs", "cs"],
    ["da", "dan"],
    ["div", "div"],
    ["nl", "nl"],
    ["en", "en"],
    ["eo", "epo"],
    ["et", "est"],
    ["fao", "fao"],
    ["fil", "fil"],
    ["fi", "fin"],
    ["fr", "fra"],
    ["fri", "fri"],
    ["ful", "ful"],
    ["gla", "gla"],
    ["gl", "glg"],
    ["ka", "geo"],
    ["de", "de"],
    ["el", "el"],
    ["grn", "grn"],
    ["gu", "guj"],
    ["ht", "ht"],
    ["hak", "hak"],
    ["ha", "hau"],
    ["haw", "haw"],
    ["he", "heb"],
    ["hil", "hil"],
    ["hi", "hi"],
    ["hmn", "hmn"],
    ["hu", "hu"],
    ["hup", "hup"],
    ["is", "ice"],
    ["ido", "ido"],
    ["ig", "ibo"],
    ["id", "id"],
    ["ing", "ing"],
    ["ina", "ina"],
    ["iku", "iku"],
    ["ga", "gle"],
    ["it", "it"],
    ["ja", "jp"],
    ["jw", "jav"],
    ["kab", "kab"],
    ["kal", "kal"],
    ["kn", "kan"],
    ["kau", "kau"],
    ["kas", "kas"],
    ["kah", "kah"],
    ["kk", "kaz"],
    ["km", "hkm"],
    ["kin", "kin"],
    ["tlh", "kli"],
    ["kon", "kon"],
    ["kok", "kok"],
    ["ko", "kor"],
    ["ku", "kur"],
    ["ky", "kir"],
    ["lo", "lao"],
    ["lag", "lag"],
    ["la", "lat"],
    ["lv", "lav"],
    ["lim", "lim"],
    ["lin", "lin"],
    ["lt", "lit"],
    ["loj", "loj"],
    ["lug", "lug"],
    ["lb", "ltz"],
    ["mk", "mac"],
    ["mai", "mai"],
    ["mg", "mg"],
    ["ms", "may"],
    ["ml", "mal"],
    ["mt", "mlt"],
    ["glv", "glv"],
    ["mi", "mao"],
    ["mr", "mar"],
    ["mah", "mah"],
    ["mau", "mau"],
    ["frm", "frm"],
    ["mot", "mot"],
    ["nea", "nea"],
    ["ne", "nep"],
    ["sme", "sme"],
    ["ped", "ped"],
    ["no", "nor"],
    ["nno", "nno"],
    ["oci", "oci"],
    ["oji", "oji"],
    ["eno", "eno"],
    ["or", "ori"],
    ["orm", "orm"],
    ["oss", "oss"],
    ["pam", "pam"],
    ["pap", "pap"],
    ["ps", "pus"],
    ["fa", "per"],
    ["pl", "pl"],
    ["pt", "pt"],
    ["pa", "pan"],
    ["que", "que"],
    ["ro", "rom"],
    ["roh", "roh"],
    ["ro", "ro"],
    ["ru", "ru"],
    ["ruy", "ruy"],
    ["sm", "sm"],
    ["san", "san"],
    ["srd", "srd"],
    ["sco", "sco"],
    ["src", "src"],
    ["sr", "srp"],
    ["sec", "sec"],
    ["sha", "sha"],
    ["sn", "sna"],
    ["sil", "sil"],
    ["sd", "snd"],
    ["si", "sin"],
    ["sk", "sk"],
    ["sl", "slo"],
    ["so", "som"],
    ["sol", "sol"],
    ["nbl", "nbl"],
    ["sot", "sot"],
    ["es", "spa"],
    ["sw", "swa"],
    ["sv", "swe"],
    ["syr", "syr"],
    ["tgl", "tgl"],
    ["tg", "tgk"],
    ["ta", "tam"],
    ["tat", "tat"],
    ["te", "tel"],
    ["tet", "tet"],
    ["th", "th"],
    ["tir", "tir"],
    ["zh-TW", "cht"],
    ["zh-CN", "zh"],
    ["tso", "tso"],
    ["tr", "tr"],
    ["tuk", "tuk"],
    ["twi", "twi"],
    ["uk", "ukr"],
    ["ups", "ups"],
    ["ur", "urd"],
    ["uz", "uzb"],
    ["ven", "ven"],
    ["vi", "vie"],
    ["wln", "wln"],
    ["cy", "wel"],
    ["fry", "fry"],
    ["wol", "wol"],
    ["xh", "xho"],
    ["yi", "yid"],
    ["yo", "yor"],
    ["zaz", "zaz"],
    ["zu", "zul"],
];

/**
 * Baidu translator interface.
 */
class BaiduTranslator {
    MAX_RETRY = 3; // Max retry times after failure.
    HOST = "https://fanyi.baidu.com/"; // Baidu translation url
    token = ""; // one of request parameters
    gtk = ""; // used to calculate value of "sign"
    sign = ""; // one of request parameters
    languages = {};

    HEADERS = {
        accept: "*/*",
        "accept-language":
            "en,zh;q=0.9,en-GB;q=0.8,en-CA;q=0.7,en-AU;q=0.6,en-ZA;q=0.5,en-NZ;q=0.4,en-IN;q=0.3,zh-CN;q=0.2",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    }; // request headers

    /**
     * Current transapi endpoint requires Acs-Token header.
     */
    getTransapiHeaders() {
        return {
            ...this.HEADERS,
            "Acs-Token": `edge-translate-${Date.now().toString(36)}`,
        };
    }

    /**
     * Language to translator language code.
     */
    LAN_TO_CODE = new Map(LANGUAGES);

    /**
     * Translator language code to language.
     */
    CODE_TO_LAN = new Map(LANGUAGES.map(([lan, code]) => [code, lan]));

    /**
     * TTS audio instance.
     */
    AUDIO = new Audio();

    /**
     * Throw an error.
     *
     * @param code error code
     * @param msg error message
     * @param action action, enum{detect, translate, pronounce}
     * @param text text
     * @param from original language
     * @param to target language
     * @param error original error object
     *
     * @throws error
     */
    throwError(
        code: string,
        msg: string,
        action: string,
        text: string,
        from: string | null = null,
        to: string | null = null
    ): never {
        throw {
            errorType: "API_ERR",
            errorCode: code,
            errorMsg: msg,
            errorAct: {
                api: "baidu",
                action,
                text,
                from,
                to,
            },
        } as TranslationError;
    }

    /**
     * Get latest token and gtk for urls.
     *
     * @returns used to run callback. catch(error) used to catch error
     */
    async getTokenGtk() {
        let oneRequest = async () => {
            const response = (await axios({
                method: "get",
                baseURL: this.HOST,
                timeout: 5000,
            })) as AxiosResponse<any>;
            const html = String(response.data || "");
            this.token = this.extractToken(html);
            this.gtk = this.extractGtk(html);
        };

        // request two times to ensure the token is the latest value
        // otherwise the request would return "997" error
        await oneRequest();
        await oneRequest();
    }

    /**
     * Extract token from homepage HTML.
     */
    extractToken(html: string) {
        const patterns = [
            /token\s*:\s*['"]([^'"]+)['"]/,
            /"token"\s*:\s*"([^"]+)"/,
            /token\s*=\s*['"]([^'"]+)['"]/,
        ];
        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) return match[1];
        }
        return "";
    }

    /**
     * Extract gtk from homepage HTML.
     */
    extractGtk(html: string) {
        const patterns = [
            /window\.gtk\s*=\s*['"]([^'"]+)['"]/,
            /gtk\s*:\s*['"]([^'"]+)['"]/,
            /"gtk"\s*:\s*"([^"]+)"/,
        ];
        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) return match[1];
        }
        return "";
    }

    /**
     * Parse the translate result.
     *
     * @param result translate result
     * @returns Parsed result
     */
    parseResult(result: any) {
        const parsed: TranslationResult = {
            originalText: "",
            mainMeaning: "",
        };
        let originalTexts = [],
            mainMeanings = [];
        for (let item of result.trans_result.data) {
            originalTexts.push(item.src);
            mainMeanings.push(item.dst);
        }
        parsed.originalText = originalTexts.join("\n");
        parsed.mainMeaning = mainMeanings.join("\n");

        if (result.trans_result.phonetic) {
            parsed.tPronunciation = result.trans_result.phonetic
                .map((e: any) => (e.trg_str !== " " ? e.trg_str : e.src_str))
                .reduce((t1: string, t2: string) => `${t1} ${t2}`); // get the result by splicing the array
        }

        // japanese target pronunciation
        if (result.trans_result.jp_pinyin) {
            parsed.tPronunciation = result.trans_result.jp_pinyin[0].dst;
        }

        // dictionary is not in the result
        if (result.dict_result) {
            if (result.dict_result.simple_means) {
                parsed.sPronunciation = result.dict_result.simple_means.symbols[0].ph_en;

                parsed.detailedMeanings = [];

                // Parse one detailed meaning.
                const appendDetailedMeaning = (part: any) => {
                    const meaning: DetailedMeaning = {};
                    meaning.pos = part.part; // part of speech
                    meaning.meaning = part.means.reduce(
                        (meaning1: string, meaning2: string) => `${meaning1}, ${meaning2}`
                    );
                    parsed.detailedMeanings!.push(meaning);
                };

                for (let part of result.dict_result.simple_means.symbols[0].parts) {
                    if (part.part) {
                        appendDetailedMeaning(part);
                        continue;
                    }

                    for (let mean of part.means) {
                        if (!mean.means) continue;
                        appendDetailedMeaning(mean);
                    }
                }
            }

            if (result.dict_result.edict) {
                parsed.definitions = [];
                // iterate pos
                for (let item of result.dict_result.edict.item) {
                    // iterate meaning of each pos
                    for (let tr of item.tr_group) {
                        const meaning: Definition = {};
                        meaning.pos = item.pos;
                        meaning.meaning = tr.tr[0];
                        meaning.example = tr.example[0];
                        meaning.synonyms = tr.similar_word;
                        parsed.definitions.push(meaning);
                    }
                }
            }

            if (result.dict_result.content) {
                parsed.sPronunciation = result.dict_result.voice[0].en_phonic;
                if (!parsed.detailedMeanings) parsed.detailedMeanings = [];
                for (let item of result.dict_result.content[0].mean) {
                    const meaning: DetailedMeaning = {};
                    meaning.pos = item.pre;
                    meaning.meaning = Object.keys(item.cont)[0];
                    parsed.detailedMeanings.push(meaning);
                }
            }
        }

        if (result.liju_result.double) {
            parsed.examples = [];
            let examples = result.liju_result.double;
            examples = JSON.parse(examples);
            for (let sentence of examples) {
                const example: Example = {
                    source: "",
                    target: "",
                };

                // source language examples
                example.source = sentence[0]
                    .map((a: string | any[]) => {
                        if (a.length > 4) return a[0] + a[4];
                        return a[0];
                    })
                    .reduce((a1: string, a2: string) => a1 + a2);

                // target language examples
                example.target = sentence[1]
                    .map((a: string | any[]) => {
                        if (a.length > 4) return a[0] + a[4];
                        return a[0];
                    })
                    .reduce((a1: string, a2: string) => a1 + a2);

                parsed.examples.push(example);
            }
        }
        return parsed;
    }

    /**
     * Parse simplified result from fallback API.
     *
     * Some Baidu endpoints only return plain translation text.
     */
    parseSimpleResult(result: any) {
        const parsed: TranslationResult = {
            originalText: "",
            mainMeaning: "",
        };

        // Newer transapi response shape.
        if (Array.isArray(result?.data)) {
            const originalTexts = [];
            const mainMeanings = [];
            for (const item of result.data) {
                originalTexts.push(item?.src || "");
                mainMeanings.push(item?.dst || "");
            }
            parsed.originalText = originalTexts.join("\n");
            parsed.mainMeaning = mainMeanings.join("\n");
            return parsed;
        }

        // Legacy fallback shape.
        if (Array.isArray(result?.trans_result)) {
            const originalTexts = [];
            const mainMeanings = [];
            for (const item of result.trans_result) {
                originalTexts.push(item?.src || "");
                mainMeanings.push(item?.dst || "");
            }
            parsed.originalText = originalTexts.join("\n");
            parsed.mainMeaning = mainMeanings.join("\n");
            return parsed;
        }

        // Dictionary-style transapi response where payload is encoded in `result`.
        if (typeof result?.result === "string") {
            try {
                const dictResult = JSON.parse(result.result);
                const means = [];
                const detailedMeanings: DetailedMeaning[] = [];
                for (const item of dictResult?.content || []) {
                    for (const meanItem of item?.mean || []) {
                        const meanText = Object.keys(meanItem?.cont || {});
                        if (meanText.length > 0) {
                            means.push(...meanText);
                            detailedMeanings.push({
                                pos: meanItem?.pre || "",
                                meaning: meanText.join(", "),
                            });
                        }
                    }
                }
                parsed.originalText = dictResult?.src || "";
                parsed.mainMeaning = means.join("; ");
                if (detailedMeanings.length > 0) {
                    parsed.detailedMeanings = detailedMeanings;
                }
                const voice = Array.isArray(dictResult?.voice) ? dictResult.voice[0] : null;
                if (voice?.en_phonic || voice?.us_phonic) {
                    parsed.sPronunciation = voice.en_phonic || voice.us_phonic;
                }
                return parsed;
            } catch (error) {
                return parsed;
            }
        }

        return parsed;
    }

    /**
     * Get supported languages of this API.
     *
     * @returns supported languages
     */
    supportedLanguages() {
        return new Set(this.LAN_TO_CODE.keys());
    }

    /**
     * Detect language of given text.
     *
     * @param text text to detect
     * @returns {Promise} then(result) used to return request result. catch(error) used to catch error
     */
    async detect(text: string): Promise<string> {
        const response = (await axios({
            url: "langdetect",
            method: "post",
            baseURL: this.HOST,
            headers: this.HEADERS,
            data: new URLSearchParams({
                query: text,
            }),
            timeout: 5000,
        })) as AxiosResponse<any>;

        const data = response.data || {};
        if (data.msg === "success" || data.lan) {
            return this.CODE_TO_LAN.get(data.lan) || "";
        }
        this.throwError(data.errno || "UNKNOWN", data.msg || "detect failed", "detect", text);
    }

    /**
     * Translate with fallback endpoint that does not require sign/token.
     */
    async translateByFallback(text: string, fromCode: string, toCode: string) {
        const response = (await axios({
            url: "/transapi",
            method: "post",
            baseURL: this.HOST,
            headers: this.getTransapiHeaders(),
            data: new URLSearchParams({
                from: fromCode,
                to: toCode,
                query: text,
                source: "txt",
                simple_means_flag: "3",
                domain: "common",
            }),
            timeout: 5000,
        })) as AxiosResponse<any>;

        const data = response.data || {};
        if (data.status === 0 || Array.isArray(data.data) || Array.isArray(data.trans_result)) {
            return this.parseSimpleResult(data);
        }
        this.throwError(
            data.errno || data.error || "UNKNOWN",
            data.errmsg || data.msg || "translate failed",
            "translate",
            text
        );
    }

    /**
     * Translate with the full dictionary endpoint.
     *
     * This endpoint returns richer word metadata such as phonetics,
     * detailed meanings, definitions and examples.
     */
    async translateByDictionary(text: string, from: string, to: string) {
        let retryCount = 0;

        const translateOneTime = async (): Promise<TranslationResult> => {
            let detectedFrom = from;
            if (detectedFrom === "auto") {
                detectedFrom = await this.detect(text);
            }

            const toCode = this.getLanguageCode(to, "translate", text);
            const fromCode =
                detectedFrom === "auto"
                    ? "auto"
                    : this.getLanguageCode(detectedFrom, "translate", text);

            const response = (await axios({
                url: `/v2transapi?from=${fromCode}&to=${toCode}`,
                method: "post",
                baseURL: this.HOST,
                headers: this.HEADERS,
                data: new URLSearchParams({
                    from: fromCode,
                    to: toCode,
                    query: text,
                    transtype: "realtime",
                    simple_means_flag: "3",
                    sign: this.generateSign(text, this.gtk),
                    token: this.token,
                    domain: "common",
                } as Record<string, string>),
                timeout: 5000,
            })) as AxiosResponse<any>;

            const data = response.data || {};
            if (!data.errno) {
                return this.parseResult(data);
            }

            if (retryCount < this.MAX_RETRY) {
                retryCount += 1;
                await this.getTokenGtk();
                return translateOneTime();
            }

            this.throwError(data.errno, data.msg || "translate failed", "translate", text, from, to);
        };

        if (!(this.token && this.gtk)) {
            await this.getTokenGtk();
        }

        return translateOneTime();
    }

    /**
     * Single-word queries benefit from Baidu's richer dictionary endpoint.
     */
    shouldUseDictionaryEndpoint(text: string) {
        const normalizedText = text.trim();
        if (!normalizedText || normalizedText.length > 64 || normalizedText.includes("\n")) {
            return false;
        }

        const terms = normalizedText
            .split(/[\s,/;:!?()[\]{}"'`~@#$%^&*_+=\|<>]+/)
            .filter(Boolean);

        return terms.length === 1;
    }

    /**
     * Convert language to Baidu code and validate.
     */
    getLanguageCode(language: string, action: string, text: string) {
        const code = this.LAN_TO_CODE.get(language);
        if (!code) {
            this.throwError("UNSUPPORTED_LANGUAGE", `unsupported language: ${language}`, action, text);
        }
        return code;
    }

    /**
     * Translate given text.
     *
     * @param text text to translate
     * @param from source language
     * @param to target language
     * @returns {Promise} then(result) used to return request result. catch(error) used to catch error
     */
    async translate(text: string, from: string, to: string) {
        const toCode = this.getLanguageCode(to, "translate", text);
        const fromCode = from === "auto" ? "auto" : this.getLanguageCode(from, "translate", text);
        if (this.shouldUseDictionaryEndpoint(text)) {
            try {
                return await this.translateByDictionary(text, from, to);
            } catch (error) {}
        }
        return this.translateByFallback(text, fromCode, toCode);
    }

    /**
     * Pronounce given text.
     *
     * @param text text to pronounce
     * @param language language of text
     * @param speed "fast" or "slow"
     *
     * @returns {Promise<void>} pronounce finished
     */
    async pronounce(text: string, language: string, speed: PronunciationSpeed) {
        // Pause audio in case that it's playing.
        this.stopPronounce();

        // Set actual speed value.
        let speedValue = speed === "fast" ? "7" : "3";

        this.AUDIO.src = `${this.HOST}gettts?lan=${this.LAN_TO_CODE.get(
            language
        )}&text=${encodeURIComponent(text)}&spd=${speedValue}&source=web`;

        try {
            await this.AUDIO.play();
        } catch (error: any) {
            // TODO: error might be NET_ERR or API_ERR, should be handled differently.
            throw {
                errorType: "NET_ERR",
                errorCode: 0,
                errorMsg: error.message,
                errorAct: {
                    api: "baidu",
                    action: "pronounce",
                    text,
                    from: language,
                    to: null,
                },
            };
        }
    }

    /**
     * Pause pronounce.
     */
    stopPronounce() {
        if (!this.AUDIO.paused) {
            this.AUDIO.pause();
        }
    }

    /* eslint-disable */
    tokenA(r: any, o: any) {
        for (var t = 0; t < o.length - 2; t += 3) {
            var a = o.charAt(t + 2);
            (a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a)),
                (a = "+" === o.charAt(t + 1) ? r >>> a : r << a),
                (r = "+" === o.charAt(t) ? (r + a) & 4294967295 : r ^ a);
        }
        return r;
    }
    generateSign(query: any, gtk: any) {
        var C = null;
        var o = query.length;
        o > 30 &&
            (query =
                "" +
                query.substr(0, 10) +
                query.substr(Math.floor(o / 2) - 5, 10) +
                query.substring(query.length, query.length - 10));
        var t = void 0,
            // @ts-ignore
            t = null !== C ? C : (C = gtk || "") || "";
        for (
            // @ts-ignore
            var e = t.split("."),
                h = Number(e[0]) || 0,
                i = Number(e[1]) || 0,
                d = [],
                f = 0,
                g = 0;
            g < query.length;
            g++
        ) {
            var m = query.charCodeAt(g);
            128 > m
                ? (d[f++] = m)
                : (2048 > m
                      ? (d[f++] = (m >> 6) | 192)
                      : (55296 === (64512 & m) &&
                        g + 1 < query.length &&
                        56320 === (64512 & query.charCodeAt(g + 1))
                            ? ((m = 65536 + ((1023 & m) << 10) + (1023 & query.charCodeAt(++g))),
                              (d[f++] = (m >> 18) | 240),
                              (d[f++] = ((m >> 12) & 63) | 128))
                            : (d[f++] = (m >> 12) | 224),
                        (d[f++] = ((m >> 6) & 63) | 128)),
                  (d[f++] = (63 & m) | 128));
        }
        for (var S = h, u = "+-a^+6", l = "+-3^+b+-f", s = 0; s < d.length; s++)
            (S += d[s]), (S = this.tokenA(S, u));
        return (
            (S = this.tokenA(S, l)),
            (S ^= i),
            0 > S && (S = (2147483647 & S) + 2147483648),
            (S %= 1e6),
            S.toString() + "." + (S ^ h)
        );
    }
    /* eslint-enable */
}

export default BaiduTranslator;
