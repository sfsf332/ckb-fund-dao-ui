"use client";

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface CustomDatePickerProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
  dateFormat?: string;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
  showTimeSelect?: boolean;
  timeIntervals?: number;
  timeFormat?: string;
  timeCaption?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  placeholderText,
  minDate,
  maxDate,
  dateFormat,
  className = "form-input",
  disabled = false,
  autoComplete = "off",
  showTimeSelect = false,
  timeIntervals = 1,
  timeFormat = "HH:mm",
  timeCaption = "时间",
}) => {
  // 如果启用了时间选择，且没有指定 dateFormat，则使用包含时间的格式
  const defaultDateFormat = showTimeSelect ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd";
  const finalDateFormat = dateFormat || defaultDateFormat;

  return (
    <div className="input-container">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat={finalDateFormat}
        placeholderText={placeholderText}
        minDate={minDate || undefined}
        maxDate={maxDate || undefined}
        className={className}
        disabled={disabled}
        showPopperArrow={false}
        popperClassName="react-datepicker-popper"
        calendarClassName="react-datepicker-calendar"
        autoComplete={autoComplete}
        showTimeSelect={showTimeSelect}
        timeIntervals={timeIntervals}
        timeFormat={timeFormat}
        timeCaption={timeCaption}
      />
      <div className="select-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 13H8.01M12 13H12.01M16 13H16.01M8 17H8.01M12 17H12.01M16 17H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default CustomDatePicker;

