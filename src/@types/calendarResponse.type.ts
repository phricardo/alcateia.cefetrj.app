type CalendarLink = {
  title: string;
  link: string;
};

export type CalendarResponse = {
  calendars: {
    campus: string;
    currentYear?: {
      undergraduate?: CalendarLink[];
      subsequent_technical?: CalendarLink[];
      others?: CalendarLink[];
    };
    previousYears?: {
      [year: string]: {
        undergraduate?: CalendarLink[];
        integrated_technical?: CalendarLink[];
        subsequent_technical?: CalendarLink[];
      };
    };
  };
};
