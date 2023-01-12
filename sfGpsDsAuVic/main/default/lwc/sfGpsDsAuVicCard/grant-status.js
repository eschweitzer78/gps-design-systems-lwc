import { formatDate } from "c/sfGpsDsHelpers";

export const defaultStatusTerms = {
  open: "Open",
  closed: "Closed",
  ongoing: "Ongoing",
  openingSoon: (startdate) => `Opening on ${startdate}`,
  closingSoon: (end, now) => {
    if (!end || !now) {
      return "Opening soon";
    }
    const daysRemaining = parseInt(end.diff(now, "days"), 10);
    if (daysRemaining > 1) {
      return `Open, closing in ${daysRemaining} days`;
    } else if (daysRemaining === 1) {
      return `Open, closing in 1 day`;
    }
    return `Open, closing today`;
  }
};

export default function calcStatus(
  startDate,
  endDate,
  displaySoon = true,
  statusTerms = defaultStatusTerms
) {
  if (!statusTerms) {
    statusTerms = defaultStatusTerms;
  }

  let now = new Date();

  if (startDate || endDate) {
    if (startDate) {
      if (now > startDate) {
        if (endDate) {
          if (now < endDate) {
            // displays status as "Open, closing in x days" when current date is more start date and less than end date
            if (displaySoon) {
              return statusTerms.closingSoon(endDate, now);
            }

            return statusTerms.open;
          }

          // displays status as "closed" when current date is after start date and after end date
          return statusTerms.closed;
        }

        // displays status as "Ongoing" if there is no end date and the current date is after the start date
        return statusTerms.ongoing;
      }

      // displays status as "Opening on startdate" when current date is within one month of startdate
      let monthAgo = startDate.setMonth(startDate.getMonth() - 1);
      if (now > monthAgo && now < startDate) {
        return !displaySoon
          ? statusTerms.openingSoon()
          : statusTerms.openingSoon(formatDate(startDate));
      }

      // displays status as "Closed" when current date is more than one month of startdate
      return statusTerms.closed;
    }

    if (endDate) {
      if (now < endDate && displaySoon) {
        // displays status as "Open, closing in x days" when current date is more start date and less than end date
        return statusTerms.closingSoon(endDate, now);
      }

      return statusTerms.closed;
    }
    // displays status as "Ongoing" if there is no start or end date
    return statusTerms.ongoing;
  }

  // displays status as "Ongoing" if there is no start or end date
  return statusTerms.ongoing;
}
