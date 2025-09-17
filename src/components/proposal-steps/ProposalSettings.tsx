import React from 'react';
import { IoIosArrowDown } from "react-icons/io";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ProposalSettingsProps {
  formData: {
    proposalType: string;
    title: string;
    releaseDate: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onDateChange: (date: Date | null) => void;
}

const ProposalSettings: React.FC<ProposalSettingsProps> = ({ formData, onInputChange, onDateChange }) => {
  return (
    <div className="form-fields">
      <div>
        <label htmlFor="proposalType" className="form-label">
          提案类型 :
        </label>
        <div className="input-container">
          <select
            id="proposalType"
            name="proposalType"
            value={formData.proposalType}
            onChange={onInputChange}
            className="form-select"
            required
          >
            <option value="">请选择提案类型</option>
            <option value="funding">资金申请</option>
            <option value="governance">治理提案</option>
            <option value="technical">技术提案</option>
            <option value="community">社区提案</option>
          </select>
          <div className="select-arrow">
            <IoIosArrowDown size={16} />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="title" className="form-label">
          提案标题 :
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          className="form-input"
          placeholder="请输入提案标题"
          required
        />
      </div>

      <div>
        <label htmlFor="releaseDate" className="form-label">
          发布日期 :
        </label>
        <div className="input-container">
          <DatePicker
            selected={formData.releaseDate ? new Date(formData.releaseDate) : null}
            onChange={onDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="请选择发布日期"
            minDate={new Date()}
            className="form-input"
            showPopperArrow={false}
            popperClassName="react-datepicker-popper"
            calendarClassName="react-datepicker-calendar"
            locale="zh-CN"
            autoComplete="off"
          />
          <div className="select-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 13H8.01M12 13H12.01M16 13H16.01M8 17H8.01M12 17H12.01M16 17H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalSettings;
