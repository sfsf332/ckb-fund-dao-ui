import React from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface ProjectBudgetProps {
  formData: {
    budget: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProjectBudget: React.FC<ProjectBudgetProps> = ({ formData, onInputChange }) => {
  const { messages } = useI18n();
  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 允许空值（用于清空输入）
    if (value === '') {
      onInputChange(e);
      return;
    }
    
    // 只允许数字和点号，明确排除加号、减号、e、E等特殊字符
    // 使用正则表达式：只允许数字和单个点号
    const validPattern = /^[0-9]*\.?[0-9]*$/;
    
    // 额外检查：如果包含加号、减号、e、E等字符，直接拒绝
    if (value.includes('+') || value.includes('-') || value.includes('e') || value.includes('E')) {
      return;
    }
    
    if (validPattern.test(value)) {
      onInputChange(e);
    }
    // 如果输入包含非数字或非点号字符，则不更新状态
  };
  
  return (
    <div className="form-fields">
      <div>
        <label htmlFor="budget" className="form-label">
          {messages.proposalSteps.projectBudget.title}
        </label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleBudgetChange}
          className="form-input"
          placeholder={messages.proposalSteps.projectBudget.placeholder}
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
};

export default ProjectBudget;
