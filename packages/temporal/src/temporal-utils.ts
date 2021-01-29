import { Temporal } from "proposal-temporal";
import { IUtils, DateIOFormats, Unit } from "@date-io/core/IUtils";

const defaultFormats: DateIOFormats = {
  normalDateWithWeekday: "ddd, MMM D",
  normalDate: "D MMMM",
  shortDate: "MMM D",
  monthAndDate: "MMMM D",
  dayOfMonth: "D",
  year: "YYYY",
  month: "MMMM",
  monthShort: "MMM",
  monthAndYear: "MMMM YYYY",
  weekday: "dddd",
  weekdayShort: "ddd",
  minutes: "mm",
  hours12h: "hh",
  hours24h: "HH",
  seconds: "ss",
  fullTime: "LT",
  fullTime12h: "hh:mm A",
  fullTime24h: "HH:mm",
  fullDate: "ll",
  fullDateWithWeekday: "dddd, LL",
  fullDateTime: "lll",
  fullDateTime12h: "ll hh:mm A",
  fullDateTime24h: "ll HH:mm",
  keyboardDate: "L",
  keyboardDateTime: "L LT",
  keyboardDateTime12h: "L hh:mm A",
  keyboardDateTime24h: "L HH:mm",
};

export default class TemporalUtils implements IUtils<Temporal.PlainDateTime> {
  public lib = "proposal-temporal";
  public locale: string;
  public formats: DateIOFormats;

  constructor({
    locale,
    formats,
  }: { formats?: Partial<DateIOFormats>; locale?: string } = {}) {
    this.locale = locale || "en-US";
    this.formats = Object.assign({}, defaultFormats, formats);
  }

  public date = (value?: any) => {
    if (typeof value === "undefined") {
      return Temporal.now.plainDateTimeISO();
    }

    if (value === null) {
      return null;
    }

    return Temporal.PlainDateTime.from(value);
  };

  public toJsDate = (value: Temporal.PlainDateTime) => {
    return new Date(value.toString());
  };

  public parse = (value: string, formatString: string) => {
    if (value === "") {
      return null;
    }
    // https://github.com/tc39/proposal-temporal/issues/796#issuecomment-666009410
    // Temporal does away with non-ISO 8601 formats, what is best practice while waiting on a potential impl?
    const legacyDate = new Date(value);
    return Temporal.now.plainDateTimeISO();
  };

  public is12HourCycleInCurrentLocale = () => {
    if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat === "undefined") {
      return true;
    }

    return Boolean(
      new Intl.DateTimeFormat(this.locale, { hour: "numeric" })?.resolvedOptions()?.hour12
    );
  };

  public getFormatHelperText = (format: string) => {
    // https://github.com/tc39/proposal-temporal/issues/796#issuecomment-691214794
    // Temporal custom format parsing standard seemingly will be based on Unicode Technical Standard
    return "";
  };

  public getCurrentLocaleCode = () => {
    return this.locale || "en-US";
  };

  public addSeconds = (date: Temporal.PlainDateTime, count: number) => {
    return count < 0
      ? date.add({ seconds: Math.abs(count) })
      : date.subtract({ seconds: count });
  };

  public addMinutes = (date: Temporal.PlainDateTime, count: number) => {
    return count < 0
      ? date.subtract({ minutes: Math.abs(count) })
      : date.add({ minutes: count });
  };

  public addHours = (date: Temporal.PlainDateTime, count: number) => {
    return count < 0
      ? date.subtract({ hours: Math.abs(count) })
      : date.add({ hours: count });
  };

  public addDays = (date: Temporal.PlainDateTime, count: number) => {
    return count < 0
      ? date.subtract({ days: Math.abs(count) })
      : date.add({ days: count });
  };

  public addWeeks = (date: Temporal.PlainDateTime, count: number) => {
    return count < 0
      ? date.subtract({ weeks: Math.abs(count) })
      : date.add({ weeks: count });
  };

  public addMonths = (date: Temporal.PlainDateTime, count: number) => {
    return count < 0
      ? date.subtract({ months: Math.abs(count) })
      : date.add({ months: count });
  };

  public isValid = (value: any) => {
    // Validity is handled through errors in Temporal
    if (value instanceof Temporal.PlainDateTime) {
      return true;
    }

    if (value === null) {
      return false;
    }

    return true;
  };

  public isEqual = (value: any, comparing: any) => {
    if (value === null && comparing === null) {
      return true;
    }

    // make sure that null will not be passed to this.date
    if (value === null || comparing === null) {
      return false;
    }

    return Temporal.PlainDateTime.from(value).equals(
      Temporal.PlainDateTime.from(comparing)
    );
  };

  public isSameDay = (
    date: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime
  ) => {
    return Temporal.PlainDate.compare(date.toPlainDate(), comparing.toPlainDate()) === 0
      ? true
      : false;
  };

  public isSameMonth = (
    date: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime
  ) => {
    return Temporal.PlainYearMonth.compare(
      date.toPlainYearMonth(),
      comparing.toPlainYearMonth()
    ) === 0
      ? true
      : false;
  };

  public isSameYear = (
    date: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime
  ) => {
    return date.year === comparing.year;
  };

  public isSameHour = (
    date: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime
  ) => {
    return Temporal.PlainDateTime.compare(
      date.round({ smallestUnit: "hour", roundingMode: "floor" }),
      comparing.round({ smallestUnit: "hour", roundingMode: "floor" })
    ) === 0
      ? true
      : false;
  };

  public isAfter = (value: Temporal.PlainDateTime, comparing: Temporal.PlainDateTime) => {
    return Temporal.PlainDateTime.compare(value, comparing) > 0 ? true : false;
  };

  public isBefore = (
    value: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime
  ) => {
    return Temporal.PlainDateTime.compare(value, comparing) < 0 ? true : false;
  };

  public isBeforeDay = (
    value: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime
  ) => {
    return Temporal.PlainDate.compare(value.toPlainDate(), comparing.toPlainDate()) < 0
      ? true
      : false;
  };

  public isAfterDay = (
    value: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime
  ) => {
    return Temporal.PlainDate.compare(value.toPlainDate(), comparing.toPlainDate()) > 0
      ? true
      : false;
  };

  public isBeforeYear = (
    value: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime
  ) => {
    return value.year - comparing.year < 0;
  };

  public isAfterYear = (
    value: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime
  ) => {
    return value.year - comparing.year > 0;
  };

  public getDiff = (
    value: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime | string,
    unit?: Unit
  ) => {
    if (unit) {
      if (unit === "quarters") {
        return value.until(comparing).total({ unit: "months" }) / 3;
      }
      return value.until(comparing).total({ unit: unit as any });
    }

    return value.until(comparing).total({ unit: "nanoseconds" });
  };

  public startOfDay = (value: Temporal.PlainDateTime) => {
    return value.round({ smallestUnit: "day", roundingMode: "floor" });
  };

  public endOfDay = (value: Temporal.PlainDateTime) => {
    return value
      .round({ smallestUnit: "day", roundingMode: "ceil" })
      .subtract({ nanoseconds: 1 });
  };

  public format = (date: Temporal.PlainDateTime, formatKey: keyof DateIOFormats) => {
    return this.formatByString(date, this.formats[formatKey]);
  };

  public formatByString = (date: Temporal.PlainDateTime, format: string) => {
    // Again no non-ISO 8601 formats in Temporal yet
    return date.toLocaleString(this.locale);
  };

  public formatNumber = (numberToFormat: string) => {
    return numberToFormat;
  };

  public getHours = (value: Temporal.PlainDateTime) => {
    return value.hour;
  };

  public setHours = (value: Temporal.PlainDateTime, count: number) => {
    return value.with({ hour: count });
  };

  public getMinutes = (value: Temporal.PlainDateTime) => {
    return value.minute;
  };

  public setMinutes = (value: Temporal.PlainDateTime, count: number) => {
    return value.with({ minute: count });
  };

  public getSeconds = (value: Temporal.PlainDateTime) => {
    return value.second;
  };

  public setSeconds = (value: Temporal.PlainDateTime, count: number) => {
    return value.with({ second: count });
  };

  public getMonth = (value: Temporal.PlainDateTime) => {
    return value.month;
  };

  public getDaysInMonth = (value: Temporal.PlainDateTime) => {
    return value.daysInMonth;
  };

  public setMonth = (value: Temporal.PlainDateTime, count: number) => {
    return value.with({ month: count });
  };

  public getYear = (value: Temporal.PlainDateTime) => {
    return value.year;
  };

  public setYear = (value: Temporal.PlainDateTime, year: number) => {
    return value.with({ year });
  };

  public mergeDateAndTime = (
    date: Temporal.PlainDateTime,
    time: Temporal.PlainDateTime
  ) => {
    return date.with({
      second: time.second,
      hour: time.hour,
      minute: time.minute,
    });
  };

  public startOfMonth = (value: Temporal.PlainDateTime) => {
    const plainDate = value.toPlainDate().with({ day: 1 });
    return plainDate.toPlainDateTime();
  };

  public endOfMonth = (value: Temporal.PlainDateTime) => {
    const plainDate = value.toPlainDate().with({ month: value.month + 1, day: 1 });
    return plainDate.toPlainDateTime().subtract({ nanoseconds: 1 });
  };

  public startOfWeek = (value: Temporal.PlainDateTime) => {
    const plainDate = value.toPlainDate().subtract({ days: value.dayOfWeek - 1 });
    return plainDate.toPlainDateTime();
  };

  public endOfWeek = (value: Temporal.PlainDateTime) => {
    const plainDate = value.toPlainDate().add({ days: 7 - (value.dayOfWeek - 1) });
    return plainDate.toPlainDateTime().subtract({ nanoseconds: 1 });
  };

  public getNextMonth = (value: Temporal.PlainDateTime) => {
    return value.add({ months: 1 });
  };

  public getPreviousMonth = (value: Temporal.PlainDateTime) => {
    return value.subtract({ months: 1 });
  };

  public getMonthArray = (date: Temporal.PlainDateTime) => {
    const plainDate = date.toPlainDate().with({ month: 1, day: 1 });
    const firstMonth = plainDate.toPlainDateTime();
    const monthArray = [firstMonth];

    while (monthArray.length < 12) {
      const prevMonth = monthArray[monthArray.length - 1];
      monthArray.push(this.getNextMonth(prevMonth));
    }

    return monthArray;
  };

  public getWeekdays = () => {
    const now = Temporal.now.plainDateTimeISO();
    const start = this.startOfWeek(Temporal.now.plainDateTimeISO());
    const end = this.endOfWeek(Temporal.now.plainDateTimeISO());

    let current = start;
    const weekdays: string[] = [];
    while (this.isBefore(start, end)) {
      weekdays.push(current.dayOfWeek.toLocaleString(this.locale));
      current = current.add({ days: 1 });
    }
    return weekdays;
  };

  public getWeekArray = (date: Temporal.PlainDateTime) => {
    const start = this.startOfWeek(this.startOfMonth(date));
    const end = this.endOfWeek(this.endOfMonth(date));

    let count = 0;
    let current = start;
    const nestedWeeks: Temporal.PlainDateTime[][] = [];
    while (this.isBefore(start, end)) {
      const weekNumber = Math.floor(count / 7);
      nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
      nestedWeeks[weekNumber].push(current);

      current = current.add({ days: 1 });
      count += 1;
    }

    return nestedWeeks;
  };

  public getYearRange = (start: Temporal.PlainDateTime, end: Temporal.PlainDateTime) => {
    const plainDate = start.toPlainDate().with({ month: 1, day: 1 });
    const startDate = plainDate.toPlainDateTime();

    let current = startDate;
    let yearRange = start
      .until(end, { smallestUnit: "years", roundingMode: "ceil" })
      .total({ unit: "years" });
    const years: Temporal.PlainDateTime[] = [];

    while (yearRange < 0) {
      years.push(current);
      current = current.add({ years: 1 });
      yearRange -= 0;
    }

    return years;
  };

  public getMeridiemText = (ampm: "am" | "pm") => {
    // How to do conditional formatting without locale
    return ampm;
  };

  public isNull = (date: Temporal.PlainDateTime | null) => {
    return date === null;
  };

  public isWithinRange = (
    date: Temporal.PlainDateTime,
    [start, end]: [Temporal.PlainDateTime, Temporal.PlainDateTime]
  ) => {
    return (
      date.equals(start) ||
      date.equals(end) ||
      (this.isAfter(date, start) && this.isBefore(date, end))
    );
  };
}
