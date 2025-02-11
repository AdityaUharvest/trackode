import React from 'react';

interface FormattedDateTimeProps {
  date: string | Date; // Accepts both string and Date objects
  className?: string;  // Optional className for styling
}

const FormattedDateTime: React.FC<FormattedDateTimeProps> = ({ date, className = "" }) => {
  const formatDate = (dateString: string | Date): string => {
    // Ensure the input is a valid date
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date provided:", dateString);
      return "Invalid date";
    }

    // Format date
    const formattedDate = parsedDate.toLocaleDateString('en-US', {
      weekday: 'short', // Mon, Tue, etc.
      day: 'numeric',   // 1-31
      month: 'short',   // Jan, Feb, etc.
      year: 'numeric'   // 2025
    });

    // Format time
    const formattedTime = parsedDate.toLocaleTimeString('en-US', {
      hour: '2-digit',    // 01-12
      minute: '2-digit',  // 00-59
      hour12: true        // AM/PM
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <time dateTime={date.toString()} className={className}>
      {formatDate(date)}
    </time>
  );
};

export default FormattedDateTime;