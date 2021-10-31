import { LOGGER } from "./logger";
import { ResponseEntity } from "./models/ResponseEntity";

class Utils {
    reformatString(input) {
        try {
            let result = input.trim().replace(/\s{2,}/g, " ");
            return result.match(/^null$/i) || result.match(/^undefined$/i) ? "" : result;
        } catch (err) {
            return "";
        }
    }
    fromAnyToNumber(input) {
        try {
            let value = parseInt(input);
            return value ? value : 0;
        } catch (err) {
            return 0;
        }
    }
}
export const utils = new Utils();

class ExpressUtils {
    makeWrapperHandler(handler = async () => {}) {
        async function wrapperHandler(req, resp) {
            try {
                await handler(req, resp);
            } catch (err) {
                console.log("[ SAFE CATCH ]");
                console.error(err);
                LOGGER.error(err);
                try {
                    // posible resp closed
                    resp.setHeader("Content-Type", "application/json; charset=utf-8");
                    resp.send(ResponseEntity.builder().code(0).message("failed").data(err).build());
                } catch (err) {
                    console.log("[ SAFE CATCH ]");
                    console.error(err);
                    LOGGER.error(err);
                } finally {
                    // finally close any connection with client
                    // don't cause exception even resp closed
                    resp.end();
                }
            }
        }
        return wrapperHandler;
    }
}
export const expressUtils = new ExpressUtils();

class DateTimeUtils {
    getDate(date = new Date()) {
        let y = date.getFullYear();
        let m = date.getMonth() + 1; //0 -> 11
        let d = date.getDate();
        return `${y}-${m > 9 ? m : "0" + m}-${d > 9 ? d : "0" + d}`;
    }
    getTime(date = new Date()) {
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        return `${h > 9 ? h : "0" + h}:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
    }
    getFull(date = new Date()) {
        return this.getDate(date) + " " + this.getTime(date);
    }
}
export const dateTimeUtils = new DateTimeUtils();
