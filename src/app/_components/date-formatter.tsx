import { parseISO, format } from "date-fns";

type Props = {
  dateString?: string;
};

const DateFormatter = ({ dateString }: Props) => {
  // Handle undefined or null date strings
  if (!dateString) {
    return <time>Unknown date</time>;
  }
  
  try {
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>;
  } catch (error) {
    console.error('Error formatting date:', error);
    return <time>Invalid date</time>;
  }
};

export default DateFormatter;
